// Single source of truth for the (client-side, non-secret) admin gate used to hide /admin from the public UI.
const ADMIN_PIN_CODES = '50.50.50.51';

export const isAdminPin = (pin) =>
  pin
    .trim()
    .split('')
    .map((c) => c.charCodeAt(0))
    .join('.') === ADMIN_PIN_CODES;
