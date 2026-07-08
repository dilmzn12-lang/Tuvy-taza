import { describe, expect, it } from 'vitest';
import { authErrorMessage } from '../authErrors';

describe('authErrorMessage', () => {
  it.each([
    ['auth/email-already-in-use', 'An account already exists with this email.'],
    ['auth/invalid-credential', 'The email or password is incorrect.'],
    ['auth/weak-password', 'Password is too weak. Use at least 8 characters.'],
    ['auth/user-not-found', 'No account found for that email.'],
    ['auth/wrong-password', 'The password is incorrect.'],
    ['auth/too-many-requests', 'Too many attempts. Try again later.'],
    ['auth/network-request-failed', 'Network error. Check your connection and try again.'],
    ['auth/invalid-email', 'Please enter a valid email address.'],
    ['auth/popup-closed-by-user', 'Sign-in popup was closed before completion.'],
    ['auth/popup-blocked', 'Popup blocked by your browser. Allow popups and try again.'],
    ['auth/account-exists-with-different-credential', 'An account already exists with a different sign-in method.'],
    ['auth/requires-recent-login', 'Please sign in again to continue.'],
    ['auth/operation-not-allowed', 'This sign-in method is not enabled.'],
  ])('maps %s', (code, expected) => {
    expect(authErrorMessage(code)).toBe(expected);
  });

  it('falls back to a generic message for unknown codes', () => {
    expect(authErrorMessage('auth/some-unknown-code')).toBe('Something went wrong. Please try again.');
  });
});
