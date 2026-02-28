/**
 * Centralized API Service for Admin Dashboard
 */

const getApiBase = () => {
  let base = (import.meta as any).env.VITE_API_BASE_URL || "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
};

const API_BASE = getApiBase();

const ADMIN_API_URL = `${API_BASE}/api/admin`;
const MESSAGE_API_URL = `${API_BASE}/api/admin/message`;

const safeFetch = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, options);
  
  const contentType = response.headers.get("content-type");
  
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
    } catch (e) {
      // Ignore parsing errors for error messages
    }
    throw new Error(errorMessage);
  }

  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    // Handle the { success: true, data: ... } structure
    return data.data !== undefined ? data.data : data;
  } else {
    // If it's not JSON but was successful, something is wrong with the server routing
    const text = await response.text();
    console.error("Expected JSON but received:", text.substring(0, 100));
    throw new Error("Server returned an unexpected response format (not JSON). Please check if the API route is correct.");
  }
};

const getHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const apiService = {
  /**
   * Fetch all messages
   */
  getMessages: async (sort: string = "newest") => {
    return safeFetch(`${ADMIN_API_URL}/messages?sort=${sort}`, {
      headers: getHeaders()
    });
  },

  /**
   * Search messages by keyword
   */
  searchMessages: async (keyword: string) => {
    return safeFetch(`${ADMIN_API_URL}/messages/search?keyword=${encodeURIComponent(keyword)}`, {
      headers: getHeaders()
    });
  },

  /**
   * Filter messages
   */
  filterMessages: async (projectType: string, fromDate?: string, toDate?: string) => {
    const params = new URLSearchParams({ projectType });
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    
    return safeFetch(`${ADMIN_API_URL}/messages/filter?${params.toString()}`, {
      headers: getHeaders()
    });
  },

  /**
   * Update message status
   */
  updateStatus: async (id: number, status: string) => {
    return safeFetch(`${MESSAGE_API_URL}/${id}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
  },

  /**
   * Delete a message
   */
  deleteMessage: async (id: number) => {
    return safeFetch(`${MESSAGE_API_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
  },

  /**
   * Get dashboard stats
   */
  getStats: async () => {
    return safeFetch(`${ADMIN_API_URL}/stats`, {
      headers: getHeaders()
    });
  }
};
