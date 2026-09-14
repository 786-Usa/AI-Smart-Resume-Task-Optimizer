import axios from "axios";
const API_BASE_URL = "http://localhost:5000/api";

export const analyzeResume = async (resumeInput, jobDescription) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);

  if (resumeInput instanceof File) {
    formData.append("resumeFile", resumeInput);
  } else {
    formData.append("resumeText", resumeInput);
  }

  const response = await axios.post(
    `${API_BASE_URL}/resume/analyze`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return response.data;
};

export const toggleTaskStatus = async (analysisId, taskId) => {
  const response = await axios.patch(
    `${API_BASE_URL}/resume/tasks/${analysisId}/${taskId}`,
  );
  return response.data;
};

export const rewriteBulletPoint = async (currentBullet, missingSkill) => {
  const response = await axios.post(`${API_BASE_URL}/resume/improve-bullet`, {
    currentBullet,
    missingSkill,
  });
  return response.data;
};
export const fetchHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/resume/history`);
  return response.data;
};

export const generateCvTemplate = async (
  resumeText,
  missingSkills,
  improvements,
) => {
  const response = await axios.post(
    `${API_BASE_URL}/resume/generate-template`,
    {
      resumeText,
      missingSkills,
      improvements,
    },
  );
  return response.data;
};

// Axios interceptor to attach JWT token
axios.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });
  if (res.data.success) {
    localStorage.setItem("user", JSON.stringify(res.data.data));
  }
  return res.data;
};

export const registerUser = async (name, email, password) => {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, {
    name,
    email,
    password,
  });
  if (res.data.success) {
    localStorage.setItem("user", JSON.stringify(res.data.data));
  }
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};
