import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Load user data on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Ensure token is properly formatted
          // ✅ Always add Bearer prefix here only
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
          // axios.defaults.headers.common['Authorization'] = formattedToken;
          
          const res = await axios.get('http://localhost:5000/api/users/profile');
          setUser(res.data);
        } catch (error) {
          console.error('Error loading user data:', error);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      // Add Bearer prefix only when setting the header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, [token]);

  const register = async (formData) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role || 'user'
      });

      if (data) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        // Set user data
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        });
        
        setToken(data.token);
        toast.success('Registration successful!');
        return true;
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      const { token, user } = res.data;
      
      // Store raw token without Bearer prefix
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      toast.success('Login successful!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateProfile = async (formData) => {
    try {
      console.log('Sending profile update request with data:', formData);
      const res = await axios.put('http://localhost:5000/api/users/profile', formData);
      console.log('Profile update response:', res.data);
      setUser(res.data);
      toast.success('Profile updated successfully');
      return true;
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error(err.response?.data?.message || 'Profile update failed');
      return false;
    }
  };

  const value = {
    user,
    loading,
    token,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 