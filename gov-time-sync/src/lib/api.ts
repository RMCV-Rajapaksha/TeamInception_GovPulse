const API_BASE_URL = 'http://localhost:4000/api/v2';

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

export interface Appointment {
  appointment_id: number;
  user_id: number;
  authority_id: number;
  issue_id?: number;
  date: string;
  time_slot: string;
  official_comment?: string;
  User?: {
    first_name?: string;
    last_name?: string;
    name?: string;
    email: string;
  };
  Authority?: {
    name: string;
    ministry?: string;
  };
  Issue?: {
    title: string;
    description?: string;
  };
}

export interface AddCommentRequest {
  appointment_id: number;
  comment: string;
}

export interface UpdateCommentRequest {
  appointment_id: number;
  comment: string;
}

export interface Issue {
  issue_id: number;
  title: string;
  description: string;
  gs_division?: string;
  ds_division?: string;
  urgency_score: number;
  image_urls?: string;
  created_at: string;
  updated_at: string;
  User: {
    user_id: number;
    first_name?: string;
    last_name?: string;
    email: string;
  };
  Issue_Status: {
    status_id: number;
    status_name: string;
  };
  Authority: {
    authority_id: number;
    name: string;
    ministry?: string;
  };
  Category: {
    category_id: number;
    category_name: string;
  };
}

export interface Feedback {
  feedback_id: number;
  appointment_id: number;
  rating: number;
  comment?: string;
  Appointment?: {
    appointment_id: number;
    date: string;
    time_slot: string;
    User: {
      user_id: number;
      first_name?: string;
      last_name?: string;
      name?: string;
      email: string;
    };
    Authority: {
      authority_id: number;
      name: string;
      ministry?: string;
    };
  };
}

export interface CreateFeedbackRequest {
  appointment_id: number;
  rating: number;
  comment?: string;
}

export interface UpdateFeedbackRequest {
  rating?: number;
  comment?: string;
}

export interface FeedbackResponse {
  feedbacks: Feedback[];
  count: number;
}

export interface AuthorityIssuesResponse {
  message: string;
  authority_id: number;
  total_issues: number;
  issues: Issue[];
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

  // Appointment methods
  async getAuthorityAppointments(): Promise<Appointment[]> {
    const response = await fetch(`${API_BASE_URL}/appointments/authority-appointments`, {
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

  async getAppointmentById(appointmentId: number): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/appointment-by-id/${appointmentId}`, {
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

  // Comment methods
  async addCommentToAppointment(data: AddCommentRequest) {
    const response = await fetch(`${API_BASE_URL}/comments/add-comment`, {
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

  async updateAppointmentComment(data: UpdateCommentRequest) {
    const response = await fetch(`${API_BASE_URL}/comments/update-comment`, {
      method: 'PUT',
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

  async deleteAppointmentComment(appointmentId: number) {
    const response = await fetch(`${API_BASE_URL}/comments/delete-comment/${appointmentId}`, {
      method: 'DELETE',
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

  async getAppointmentComment(appointmentId: number) {
    const response = await fetch(`${API_BASE_URL}/comments/appointment/${appointmentId}`, {
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

  // Issue methods
  async getAuthorityIssues(): Promise<AuthorityIssuesResponse> {
    const response = await fetch(`${API_BASE_URL}/issues/authority-issues`, {
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

  async updateIssueStatus(issueId: number, statusId: number) {
    const response = await fetch(`${API_BASE_URL}/issues/update-status/${issueId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ status_id: statusId }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  // Feedback methods
  async getAllFeedback(authorityId?: number, limit?: number, offset?: number): Promise<FeedbackResponse> {
    const params = new URLSearchParams();
    if (authorityId) params.append('authority_id', authorityId.toString());
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    const response = await fetch(`${API_BASE_URL}/feedback/all?${params.toString()}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  async getFeedbackByAppointmentId(appointmentId: number): Promise<{ feedback: Feedback }> {
    const response = await fetch(`${API_BASE_URL}/feedback/appointment/${appointmentId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  async createFeedback(data: CreateFeedbackRequest): Promise<{ message: string; feedback: Feedback }> {
    const response = await fetch(`${API_BASE_URL}/feedback/create-feedback`, {
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

  async updateFeedback(appointmentId: number, data: UpdateFeedbackRequest): Promise<{ message: string; feedback: Feedback }> {
    const response = await fetch(`${API_BASE_URL}/feedback/appointment/${appointmentId}`, {
      method: 'PUT',
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

  async deleteFeedback(appointmentId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/feedback/appointment/${appointmentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();