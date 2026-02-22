import crypto from 'crypto';

/**
 * EncryptionService - Handles AES-256-GCM encryption for sensitive data
 * Used for encrypting OAuth tokens and TOTP secrets
 */
export class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private keyLength = 32; // 256 bits
  private ivLength = 16; // 128 bits
  private saltLength = 64;
  private tagLength = 16;
  private encryptionKey: Buffer;

  constructor() {
    const secret = process.env.ENCRYPTION_SECRET;
    if (!secret) {
      throw new Error('ENCRYPTION_SECRET environment variable is required');
    }
    this.encryptionKey = this.deriveKey(secret);
  }

  /**
   * Derive encryption key from secret using scrypt
   */
  deriveKey(secret: string): Buffer {
    const salt = crypto.createHash('sha256').update('fatos-pro-salt').digest();
    return crypto.scryptSync(secret, salt, this.keyLength);
  }

  /**
   * Encrypt plaintext using AES-256-GCM
   * Returns format: iv:authTag:ciphertext (all base64 encoded)
   */
  encrypt(plaintext: string): string {
    // Generate random IV
    const iv = crypto.randomBytes(this.ivLength);
    
    // Create cipher
    const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);
    
    // Encrypt
    let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
    ciphertext += cipher.final('base64');
    
    // Get authentication tag
    const authTag = cipher.getAuthTag();
    
    // Return format: iv:authTag:ciphertext
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${ciphertext}`;
  }

  /**
   * Decrypt ciphertext using AES-256-GCM
   * Expects format: iv:authTag:ciphertext (all base64 encoded)
   */
  decrypt(encrypted: string): string {
    try {
      // Parse encrypted string
      const parts = encrypted.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const iv = Buffer.from(parts[0], 'base64');
      const authTag = Buffer.from(parts[1], 'base64');
      const ciphertext = parts[2];

      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv);
      decipher.setAuthTag(authTag);

      // Decrypt
      let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
      plaintext += decipher.final('utf8');

      return plaintext;
    } catch (error) {
      throw new Error('Decryption failed: Invalid data or key');
    }
  }
}

// Singleton instance
let encryptionServiceInstance: EncryptionService | null = null;

export function getEncryptionService(): EncryptionService {
  if (!encryptionServiceInstance) {
    encryptionServiceInstance = new EncryptionService();
  }
  return encryptionServiceInstance;
}
