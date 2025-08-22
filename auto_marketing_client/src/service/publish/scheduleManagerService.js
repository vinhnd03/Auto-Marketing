import axios from "axios";

const API_URL = "http://localhost:8080/api/schedules";

// GET all published
export const getSchedules = async () => {
  const res = await axios.get(`${API_URL}/published`,{withCredentials:true});
  return res.data;
};

// GET by ID
export const getScheduleById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`,{withCredentials:true});
  return res.data;
};

// CREATE schedule
export const createSchedule = async (scheduleData) => {
  const res = await axios.post(API_URL, scheduleData, {
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

  const res = await axios.put(`${API_URL}/${id}`, formData, {
    withCredentials:true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE schedule
export const deleteSchedule = async (id) => {
  await axios.delete(`${API_URL}/${id}`,{withCredentials:true});
};
