import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // true while hydrating from localStorage
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'HYDRATE_DONE':
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('zepnest_token');
      const user = JSON.parse(localStorage.getItem('zepnest_user') || 'null');
      if (token && user) {
        dispatch({ type: 'HYDRATE', payload: { token, user } });
      } else {
        dispatch({ type: 'HYDRATE_DONE' });
      }
    } catch {
      dispatch({ type: 'HYDRATE_DONE' });
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('zepnest_token', token);
    localStorage.setItem('zepnest_user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: { token, user } });
  };

  const logout = () => {
    localStorage.removeItem('zepnest_token');
    localStorage.removeItem('zepnest_user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
