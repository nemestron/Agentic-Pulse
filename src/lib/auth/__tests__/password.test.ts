import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../password';

describe('Password Utility', () => {
  it('should securely hash a password and verify it successfully', async () => {
    const rawPassword = 'SuperSecretPassword123!';
    const hash = await hashPassword(rawPassword);
    
    expect(hash).not.toEqual(rawPassword);
    
    const isValid = await verifyPassword(rawPassword, hash);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const hash = await hashPassword('CorrectPassword');
    const isValid = await verifyPassword('WrongPassword', hash);
    expect(isValid).toBe(false);
  });
});