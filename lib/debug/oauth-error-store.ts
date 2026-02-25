// Temporary debug store for OAuth errors
// This will be removed after debugging

let lastError: any = null;

export function setLastOAuthError(error: any) {
  lastError = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    type: error instanceof Error ? error.constructor.name : typeof error,
    timestamp: new Date().toISOString(),
  };
}

export function getLastOAuthError() {
  return lastError;
}
