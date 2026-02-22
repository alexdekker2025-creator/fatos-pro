@echo off
echo ========================================
echo Testing Advanced Authentication API
echo ========================================
echo.

echo [1/6] Testing Password Reset Request...
curl -X POST http://localhost:3000/api/auth/password-reset/request -H "Content-Type: application/json" -d "{\"email\":\"admin@fatos.pro\"}"
echo.
echo.

echo [2/6] Testing Email Verification (invalid token)...
curl -X POST http://localhost:3000/api/auth/email/verify -H "Content-Type: application/json" -d "{\"token\":\"test-token-123\"}"
echo.
echo.

echo [3/6] Testing Password Reset Verify (invalid token)...
curl "http://localhost:3000/api/auth/password-reset/verify?token=test-token-123"
echo.
echo.

echo [4/6] Testing Validation - Invalid Email...
curl -X POST http://localhost:3000/api/auth/password-reset/request -H "Content-Type: application/json" -d "{\"email\":\"invalid-email\"}"
echo.
echo.

echo [5/6] Testing Validation - Short Password...
curl -X POST http://localhost:3000/api/auth/password-reset/confirm -H "Content-Type: application/json" -d "{\"token\":\"abc\",\"newPassword\":\"short\"}"
echo.
echo.

echo [6/6] Testing Rate Limiting (4 requests)...
curl -X POST http://localhost:3000/api/auth/password-reset/request -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"
echo.
curl -X POST http://localhost:3000/api/auth/password-reset/request -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"
echo.
curl -X POST http://localhost:3000/api/auth/password-reset/request -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"
echo.
echo This 4th request should return 429 (Too Many Requests):
curl -X POST http://localhost:3000/api/auth/password-reset/request -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"
echo.
echo.

echo ========================================
echo Testing Complete!
echo ========================================
pause
