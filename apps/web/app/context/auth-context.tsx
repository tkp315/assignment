"use client";
import React, { createContext, useContext, useState } from "react";
import useApiCall from "../hooks/useApiCall";
import { USER_ENDPOINTS } from "../services/user";

interface AuthContextType {
  user: any;
  login: (userdata: any) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  profile: () => Promise<any>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const apiCall = useApiCall();

  const login = async (userdata) => {
    const payload = {
      url: USER_ENDPOINTS.login.url,
      method: USER_ENDPOINTS.login.method,
      data: userdata,
    };

    try {
      const res = await apiCall(payload);

      const data = res?.data ?? res;
      const accessToken =
        data?.accessToken ??
        data?.tokens?.accessToken ??
        data?.token;

      const refreshToken =
        data?.refreshToken ??
        data?.tokens?.refreshToken;

      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      setIsLoggedIn(!!accessToken);

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsLoggedIn(false);
      throw error;
    }
  };

  const register = async (userData) => {
    const payload = {
      url: USER_ENDPOINTS.register.url,
      method: USER_ENDPOINTS.register.method,
      data: userData, // FIXED: userdata → userData
    };

    try {
      const res = await apiCall(payload);
      return res.data ?? res;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

 
  const logout = async () => {
    const payload = {
      url: USER_ENDPOINTS.logout.url,
      method: USER_ENDPOINTS.logout.method,
    };

    try {
      await apiCall(payload);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const profile = async () => {
    const payload = {
      url: USER_ENDPOINTS.me.url,
      method: USER_ENDPOINTS.me.method,
    };

    try {
      const res = await apiCall(payload);
      setUser(res.data ?? res);
      return res;
    } catch (error) {
      console.error("Profile fetch failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        profile,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export const useAuth = () => useContext(AuthContext);
