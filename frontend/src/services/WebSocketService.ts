import { io } from 'socket.io-client';

interface Notification {
  id: string;
  user_id: number;
  notification_type: string;
  notification_content: string;
  issue_id?: number | null;
  authority_id?: number | null;
  appointment_id?: number | null;
  timestamp: string;
  read: boolean;
}

interface AuthenticatedData {
  success: boolean;
  userId: number;
}

interface AuthenticationError {
  success: boolean;
  message: string;
}

class WebSocketService {
  private socket: any | null = null;
  private token: string | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 5000;

  connect(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.token = token;
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      
      this.socket = io(backendUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        
        // Authenticate with the server
        this.socket!.emit('authenticate', { token });
      });

      this.socket.on('authenticated', (data: AuthenticatedData) => {
        console.log('WebSocket authenticated:', data);
        resolve(true);
      });

      this.socket.on('authentication_error', (error: AuthenticationError) => {
        console.error('WebSocket authentication error:', error);
        reject(new Error(error.message || 'Authentication failed'));
      });

      this.socket.on('disconnect', (reason: string) => {
        console.log('WebSocket disconnected:', reason);
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          this.handleReconnect();
        }
      });

      this.socket.on('connect_error', (error: Error) => {
        console.error('WebSocket connection error:', error);
        this.handleReconnect();
      });

      // Set up notification listener
      this.socket.on('notification', (notification: Notification) => {
        // Dispatch custom event for notification handling
        window.dispatchEvent(new CustomEvent('websocket-notification', {
          detail: notification
        }));
      });
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        if (this.token) {
          this.connect(this.token).catch(console.error);
        }
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnect attempts reached');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.token = null;
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  onNotification(callback: (notification: Notification) => void) {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('websocket-notification', handler as EventListener);
    
    return () => {
      window.removeEventListener('websocket-notification', handler as EventListener);
    };
  }
}

export default new WebSocketService();
export type { Notification };
