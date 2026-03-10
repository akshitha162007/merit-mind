const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const registerUser = async ({ name, email, password, role }) => {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  return data;
};

export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  return data;
};

export const logoutUser = async (token) => {
  const response = await fetch(`${BASE_URL}/api/auth/logout?token=${token}`, {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
  return true;
};
