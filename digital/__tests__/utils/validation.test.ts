import { signupSchema, loginSchema } from '../../src/utils/validation';

describe('Validation Schemas', () => {
  describe('signupSchema', () => {
    it('should validate correct signup data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };
      
      expect(() => signupSchema.parse(validData)).not.toThrow();
    });

    it('should reject signup data with short name', () => {
      const invalidData = {
        name: 'J', // Only 1 character, should be min 2
        email: 'john@example.com',
        password: 'password123'
      };
      
      expect(() => signupSchema.parse(invalidData)).toThrow();
    });

    it('should reject signup data with invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };
      
      expect(() => signupSchema.parse(invalidData)).toThrow();
    });

    it('should reject signup data with short password', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123'
      };
      
      expect(() => signupSchema.parse(invalidData)).toThrow();
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'john@example.com',
        password: 'password123'
      };
      
      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it('should reject login data with invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123'
      };
      
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should accept login data with empty password (schema allows it)', () => {
      const validData = {
        email: 'john@example.com',
        password: ''
      };
      
      expect(() => loginSchema.parse(validData)).not.toThrow();
    });
  });
});