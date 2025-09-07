import axios from "axios";
import api from "../../context/api";

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/schedules`;
const API_URL = `/schedules`;

// GET all published
export const getSchedules = async (workspaceId) => {
  // const res = await axios.get(`${API_URL}/published`,{
  const res = await api.get(`${API_URL}/published`,{
    withCredentials:true,
    params: { workspaceId }
  });
  return res.data;
};

// GET by ID
export const getScheduleById = async (id) => {
  // const res = await axios.get(`${API_URL}/${id}`,{withCredentials:true});
  const res = await api.get(`${API_URL}/${id}`,{withCredentials:true});
  return res.data;
};

// CREATE schedule
export const createSchedule = async (scheduleData) => {
  // const res = await axios.post(API_URL, scheduleData, {
  const res = await api.post(API_URL, scheduleData, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// UPDATE schedule (multipart)
export const updateSchedule = async (id, scheduleData, files = []) => {
  const formData = new FormData();

  formData.append(
    "request",
    new Blob([JSON.stringify(scheduleData)], { type: "application/json" })
  );

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  // const res = await axios.put(`${API_URL}/${id}`, formData, {
  const res = await api.put(`${API_URL}/${id}`, formData, {
    withCredentials:true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE schedule
export const deleteSchedule = async (id) => {
  // await axios.delete(`${API_URL}/${id}`,{withCredentials:true});
  await api.delete(`${API_URL}/${id}`,{withCredentials:true});
};

// GET all published
export const getSchedulesPosted = async (workspaceId) => {
  const res = await api.get(`${API_URL}/posted`,{
    withCredentials:true,
    params: { workspaceId }
  });
  return res.data;
};