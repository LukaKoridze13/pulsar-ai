import axios from "axios";
const link = "http://localhost:3333/";
// Register a new user
export const register = async (fullName, user, password) => {
  try {
    const response = await axios.post(link + "register", {
      fullName,
      user,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Login an existing user
export const login = async (user, password) => {
  try {
    const response = await axios.put(link + "login", {
      user,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Logout a user
export const logout = async (refreshToken) => {
  try {
    const response = await axios.put(link + "logout", {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUser = async  (user)=>{
  return await  axios.get(link+'users/'+user)
}

export const setOnline = async (user)=>{
  return await  axios.get(link+'users/'+user+'/online/')

}
export const setOffline = async (user)=>{
  return await  axios.get(link+'users/'+user+'/offline/')

}


export const getRegisteredUsers = async (refreshToken) => {
  try {
    const response = await axios.get(link + "registered-users/"+refreshToken);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const storeUserRefeshtoken = (user, refreshToken) =>{
  localStorage.setItem("snjci82q7fg72u", JSON.stringify({user, refreshToken}))
}
export const getUserRefeshtoken = (user, refreshToken) =>{
  return JSON.parse(localStorage.getItem("snjci82q7fg72u"))
}
export const deleteUserRefeshtoken = ()=>{
  localStorage.removeItem("snjci82q7fg72u")
}