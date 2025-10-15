// Socket.IO Client for Real-time Messaging
class SocketClient {
  constructor() {
    // Connect to Socket.IO server
    this.socket = io('http://localhost:3000');
    this.currentRoom = null;
    this.currentUser = null;
    this.userRole = null; // 'student' or 'mentor'
    
    this.initializeSocket();
  }
  
  initializeSocket() {
    // Connection established
    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server with ID:', this.socket.id);
    });
    
    // Receive message
    this.socket.on('receive_message', (data) => {
      this.displayMessage(data);
    });
    
    // User typing
    this.socket.on('user_typing', (data) => {
      this.showTypingIndicator(data.user);
    });
    
    // Connection error
    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
    
    // Disconnection
    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });
  }
  
  joinRoom(roomId, user, role) {
    this.currentRoom = roomId;
    this.currentUser = user;
    this.userRole = role;
    this.socket.emit('join_room', roomId);
    console.log(`Joined room: ${roomId}`);
  }
  
  sendMessage(message, toUser) {
    if (!this.currentRoom || !this.currentUser) {
      console.error('Not in a room or user not set');
      return;
    }
    
    const messageData = {
      room: this.currentRoom,
      from: this.currentUser,
      fromRole: this.userRole,
      to: toUser,
      message: message,
      timestamp: new Date()
    };
    
    this.socket.emit('send_message', messageData);
    this.displayMessage(messageData); // Display own message immediately
  }
  
  sendTyping(user) {
    if (!this.currentRoom) return;
    
    const typingData = {
      room: this.currentRoom,
      user: user
    };
    
    this.socket.emit('typing', typingData);
  }
  
  displayMessage(data) {
    // Create a custom event to notify the UI
    const event = new CustomEvent('newMessage', { detail: data });
    document.dispatchEvent(event);
  }
  
  showTypingIndicator(user) {
    // Create a custom event to notify the UI
    const event = new CustomEvent('userTyping', { detail: user });
    document.dispatchEvent(event);
  }
  
  // Format timestamp for display
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

// Initialize the socket client when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.socketClient = new SocketClient();
});