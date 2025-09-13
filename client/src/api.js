import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "", // same-origin via Vite proxy
  withCredentials: true
});

// Auth
export const register = (email, password) => api.post("/api/auth/register", { email, password });
export const login = (email, password) => api.post("/api/auth/login", { email, password });
export const logout = () => api.post("/api/auth/logout");

// Notes
export const getNotes = () => api.get("/api/notes");
export const createNote = (data) => api.post("/api/notes", data);
export const updateNote = (id, data) => api.put(`/api/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/api/notes/${id}`);

// Tasks
export const getTasks = () => api.get("/api/tasks");
export const createTask = (data) => api.post("/api/tasks", data);
export const patchTask = (id, data) => api.patch(`/api/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);
