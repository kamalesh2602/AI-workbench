import apiClient from "./apiClient";
import API_BASE_URL from "../config/api";

const API = `${API_BASE_URL}/auth`;

export const registerUser = async (
  name,
  email,
  password
) => {

  const response =
    await apiClient.post(
      `${API}/register`,
      {
        name,
        email,
        password
      }
    );

  return response.data;
};

export const loginUser = async (
  email,
  password
) => {

  const response =
    await apiClient.post(
      `${API}/login`,
      {
        email,
        password
      }
    );

  return response.data;
};