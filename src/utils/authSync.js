"use client";

// Authentication synchronization utility for cross-tab support
class AuthSync {
  constructor() {
    this.listeners = new Set();
    this.broadcastChannel = null;
    this.storageKey = process.env.NEXT_PUBLIC_SALEOR_API_URL + "+saleor_auth_module_refresh_token";
    this.authStateKey = "auth_state_sync";
    
    if (typeof window !== 'undefined') {
      this.initializeBroadcastChannel();
      this.setupStorageListener();
    }
  }

  initializeBroadcastChannel() {
    try {
      this.broadcastChannel = new BroadcastChannel('auth_sync');
      this.broadcastChannel.addEventListener('message', (event) => {
        if (event.data.type === 'AUTH_STATE_CHANGED') {
          this.notifyListeners();
        }
      });
    } catch (error) {
      // Fallback for browsers that don't support BroadcastChannel
      console.warn('BroadcastChannel not supported, using localStorage events only');
    }
  }

  setupStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey || event.key === this.authStateKey) {
        this.notifyListeners();
      }
    });
  }

  // Get authentication token
  getToken() {
    if (typeof window === 'undefined') return null;
    
    // Try localStorage first (for cross-tab sync), then sessionStorage (for backward compatibility)
    return localStorage.getItem(this.storageKey) || 
           sessionStorage.getItem(this.storageKey);
  }

  // Set authentication token
  setToken(token) {
    if (typeof window === 'undefined') return;
    
    if (token) {
      // Store in both localStorage (for cross-tab sync) and sessionStorage (for backward compatibility)
      localStorage.setItem(this.storageKey, token);
      sessionStorage.setItem(this.storageKey, token);
      localStorage.setItem(this.authStateKey, Date.now().toString());
    } else {
      // Clear from both storages
      localStorage.removeItem(this.storageKey);
      sessionStorage.removeItem(this.storageKey);
      localStorage.setItem(this.authStateKey, 'logged_out_' + Date.now().toString());
    }
    
    this.broadcastAuthChange();
  }

  // Remove authentication token
  removeToken() {
    this.setToken(null);
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  // Broadcast authentication state change to other tabs
  broadcastAuthChange() {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'AUTH_STATE_CHANGED',
        timestamp: Date.now()
      });
    }
    
    // Also trigger custom event for components listening to authChange
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authChange'));
    }
  }

  // Add listener for authentication state changes
  addListener(callback) {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners of authentication state change
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.isAuthenticated());
      } catch (error) {
        console.error('Error in auth sync listener:', error);
      }
    });
  }

  // Clean up resources
  destroy() {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
    this.listeners.clear();
  }
}

// Create singleton instance
const authSync = new AuthSync();

export default authSync; 