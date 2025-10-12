// Session management with auto-logout on inactivity
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
let inactivityTimer: NodeJS.Timeout | null = null;
let onLogoutCallback: (() => void) | null = null;

const resetInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  
  inactivityTimer = setTimeout(() => {
    if (onLogoutCallback) {
      onLogoutCallback();
    }
  }, INACTIVITY_TIMEOUT);
};

export const initSessionManager = (logoutCallback: () => void) => {
  onLogoutCallback = logoutCallback;
  
  // Activity events to track
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
  
  events.forEach(event => {
    document.addEventListener(event, resetInactivityTimer, true);
  });
  
  // Start the timer
  resetInactivityTimer();
};

export const cleanupSessionManager = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
  events.forEach(event => {
    document.removeEventListener(event, resetInactivityTimer, true);
  });
};
