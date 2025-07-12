import axios from "../lib/axios.js";

export const getNoteSummary = async ({ noteId, title, content }) => {
  try {
    const response = await axios.post(`/ai/notes/${noteId}/summarize`, {
      title,
      content,
    });
    return response?.data;
  } catch (err) {
    const msg = err.response?.data?.message || "Error fetching note summary";
    throw new Error(msg);
  }
};

export const getTaskSummary = async ({ taskId }) => {
  try {
    const response = await axios.get(`/ai/tasks/${taskId}/summarize`);
    return response.data?.data?.summary;
  } catch (err) {
    const msg = err.response?.data?.message || "Error fetching task summary";
    throw new Error(msg);
  }
};
