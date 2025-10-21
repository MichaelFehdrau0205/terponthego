// Get current user from localStorage
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  };
  
  // Get token
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Check if user is authenticated
  export const isAuthenticated = () => {
    return !!getToken();
  };
  
  // Check if user is deaf
  export const isDeafUser = () => {
    const user = getCurrentUser();
    return user?.user_type === 'deaf';
  };
  
  // Check if user is interpreter
  export const isInterpreter = () => {
    const user = getCurrentUser();
    return user?.user_type === 'interpreter';
  };
  
  // Login - save token and user
  export const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  // Logout - clear everything
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };