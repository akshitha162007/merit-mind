const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const registerUser = async ({ name, email, password, role }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Registration failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Login failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/logout?token=${token}`, {
      method: "POST"
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    return true;
  } catch (error) {
    throw error;
  }
};
