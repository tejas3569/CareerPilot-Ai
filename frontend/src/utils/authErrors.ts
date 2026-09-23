/**
 * Utility to map Firebase Authentication error codes and API errors
 * to clear, human-readable instructions.
 */
export function getAuthErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred. Please try again.';

  const code: string = err.code || '';
  const message: string = err.message || '';
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'career-pilot-ai.vercel.app';

  if (code === 'auth/unauthorized-domain') {
    return `Domain "${hostname}" is not authorized in Firebase. Please add "${hostname}" to Firebase Console ➔ Authentication ➔ Settings ➔ Authorized Domains.`;
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'Google sign-in popup was closed before completing.';
  }
  if (code === 'auth/popup-blocked') {
    return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
  }
  if (code === 'auth/email-already-in-use') {
    return 'An account with this email already exists. Please sign in instead.';
  }
  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }
  if (code === 'auth/user-not-found') {
    return 'No account found with this email. Please register first.';
  }
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
    return 'Incorrect email or password. Please verify your credentials or click "Forgot password?".';
  }
  if (code === 'auth/weak-password') {
    return 'Password is too weak. Please use at least 8 characters with a special character (e.g. !, @, #, $).';
  }
  if (code === 'auth/too-many-requests') {
    return 'Access temporarily disabled due to many failed attempts. Please wait a few moments or reset your password.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Backend FastAPI response detail fallback
  if (err.response?.data?.detail) {
    const detail = err.response.data.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
    }
  }

  return message || 'Authentication failed. Please try again.';
}
