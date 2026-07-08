const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/account-exists-with-different-credential': 'An account already exists with a different sign-in method.',
  'auth/email-already-in-use': 'An account already exists with this email.',
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
  'auth/popup-blocked': 'Popup blocked by your browser. Allow popups and try again.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed before completion.',
  'auth/requires-recent-login': 'Please sign in again to continue.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/user-not-found': 'No account found for that email.',
  'auth/weak-password': 'Password is too weak. Use at least 8 characters.',
  'auth/wrong-password': 'The password is incorrect.',
};

export function authErrorMessage(code: string): string {
  const normalized = code.toLowerCase();
  return AUTH_ERROR_MESSAGES[normalized] ?? 'Something went wrong. Please try again.';
}
