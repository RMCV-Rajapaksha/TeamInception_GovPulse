const API_BASE_URL = 'http://localhost:4000/api';

export interface OfficialRegisterRequest {
  username: string;
  password: string;
  position: string;
  authority_id: number;
}

export interface OfficialLoginRequest {
  username: string;
  password: string;
}

export interface FreeTimeSlot {
  authority_id: number;
  date: string;
  time_slots: string[];
}

export interface AddFreeTimeSlotRequest {
  date: string;
  start_time: string;
  end_time: string;
}

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Utility function to check if token is expired
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true; // Consider invalid tokens as expired
    }
  }

  // Validate current session
  async validateSession(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      // Check if token is expired
      if (this.isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        return false;
      }

      // Make a test API call to verify token is still valid
      const response = await fetch(`${API_BASE_URL}/time-slots/view-free-time-slots`, {
        method: 'GET',
        headers: {
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      return false;
    }
  }

  async officialRegister(data: OfficialRegisterRequest) {
    const response = await fetch(`${API_BASE_URL}/officials/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  async officialLogin(data: OfficialLoginRequest) {
    const response = await fetch(`${API_BASE_URL}/officials/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  async viewFreeTimeSlots() {
    const response = await fetch(`${API_BASE_URL}/time-slots/view-free-time-slots`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  async addFreeTimeSlot(data: AddFreeTimeSlotRequest) {
    const response = await fetch(`${API_BASE_URL}/time-slots/add-free-time-slot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  async removeFreeTimeSlot(data: { date: string; start_time: string; end_time: string }) {
    const response = await fetch(`${API_BASE_URL}/time-slots/remove-free-time-slot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  async getFreeTimeSlotsOfAuthority(authorityId: number) {
    const response = await fetch(`${API_BASE_URL}/time-slots/get-free-time-slots-of-authority/${authorityId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();