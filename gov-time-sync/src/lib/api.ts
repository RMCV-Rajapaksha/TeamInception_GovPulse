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

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
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

  async addFreeTimeSlot(data: FreeTimeSlot) {
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