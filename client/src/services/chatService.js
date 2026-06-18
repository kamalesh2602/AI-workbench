import apiClient from "./apiClient";
import API_BASE_URL from "../config/api";

const API = `${API_BASE_URL}/chat`;

export const askQuestion = async (
    workspaceId,
    question
) => {

    const response = await apiClient.post(
        `${API}/ask`,
        {
            workspace_id: workspaceId,
            question: question
        }
    );

    return response.data;
};

export const getChatHistory = async (
    workspaceId
) => {

    const response = await apiClient.get(
        `${API}/history/${workspaceId}`
    );

    return response.data;
};


export const clearChatHistory =
  async (workspaceId) => {

    const response =
      await apiClient.delete(
        `/chat/history/${workspaceId}`
      );

    return response.data;
  };