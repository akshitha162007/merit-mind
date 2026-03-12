import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const submitResumeText = async (candidate_id, text) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/resume/submit-text`,
      { candidate_id, text },
      { headers: { ...getHeaders(), 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitResumePdf = async (candidate_id, file) => {
  try {
    const formData = new FormData();
    formData.append('candidate_id', candidate_id);
    formData.append('file', file);
    const response = await axios.post(
      `${BASE_URL}/api/resume/submit-pdf`,
      formData,
      { headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitResumeImage = async (candidate_id, file) => {
  try {
    const formData = new FormData();
    formData.append('candidate_id', candidate_id);
    formData.append('file', file);
    const response = await axios.post(
      `${BASE_URL}/api/resume/submit-image`,
      formData,
      { headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCandidateResumeStatus = async (candidate_id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/resume/candidate/${candidate_id}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllResumes = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/resume/all`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getResumeDetail = async (resume_id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/resume/detail/${resume_id}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
