import axios from 'axios';

// Register a new user
export const register = async (fullName, user, password) => {
  try {
    const response = await axios.post('http://localhost:3333/register', {
      fullName,
      user,
      password,
      refreshToken: null
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Login an existing user
export const login = async (user, password) => {
  try {
    const response = await axios.post('http://localhost:3333/login', {
      user,
      password
    });
    localStorage.setItem('jhsaf78-refreshToken', response.data.refreshToken);
    return "Success";
  } catch (error) {
    throw error.response.data;
  }
};

// Logout a user
export const logout = async (refreshToken) => {
  try {
    const response = await axios.post('http://localhost:3333/logout', {
      refreshToken
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getOnlineUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3333/online-users');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getRegisteredUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3333/registered-users');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};