import axios from "../lib/axios.js";

export const getNoteSummary = async ({ noteId, title, content }) => {
  try {
    const response = await axios.post(`/ai/notes/${noteId}/summarize`, {
      title,
      content,
    });
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || "Error fetching note summary";
    throw new Error(msg);
  }
};
