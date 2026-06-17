import apiClient from "./apiClient";
import API_BASE_URL from "../config/api";

const API = `${API_BASE_URL}/chat`;


export const processDocument =
    async (documentId) => {

        const response =
            await apiClient.post(
                `${API_BASE_URL}/documents/process/${documentId}`
            );

        return response.data;
    };

export const embedDocument =
    async (documentId) => {

        const response =
            await apiClient.post(
                `${API_BASE_URL}/documents/embed/${documentId}`
            );

        return response.data;
    };

export const generateSummary =
  async (documentId) => {

  const response =
    await apiClient.post(
      `${API_BASE_URL}/documents/summary/${documentId}`
    );

  return response.data;
};

export const getDocumentUrl = (
  documentId
) =>
  `${API_BASE_URL}/documents/view/${documentId}`;