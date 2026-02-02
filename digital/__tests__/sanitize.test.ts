import { sanitizeInput } from '../src/utils/sanitize';

test('sanitizes HTML tags', () => {
  const maliciousInput = '<script>alert("XSS")</script>';
  const sanitized = sanitizeInput(maliciousInput);
  expect(sanitized).toBe('');
});

test('sanitizes HTML attributes', () => {
  const maliciousInput = '<img src=x onerror=alert(1)>';
  const sanitized = sanitizeInput(maliciousInput);
  expect(sanitized).toBe('');
});

test('preserves plain text', () => {
  const plainText = 'Hello World';
  const sanitized = sanitizeInput(plainText);
  expect(sanitized).toBe('Hello World');
});

test('handles non-string inputs', () => {
  const numberInput = 123;
  const sanitized = sanitizeInput(numberInput);
  expect(sanitized).toBe('123');
});

test('handles empty strings', () => {
  const emptyInput = '';
  const sanitized = sanitizeInput(emptyInput);
  expect(sanitized).toBe('');
});
