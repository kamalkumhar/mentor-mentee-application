// Function to update notification badge count
function updateNotificationBadge() {
  const token = localStorage.getItem('token');
  if (!token) return;

  // Fetch unread messages count instead of notifications
  fetch('/api/messages/unread-count', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
  .then(response => response.json())
  .then(data => {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
      if (data.count > 0) {
        badge.textContent = data.count;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }
  })
  .catch(error => {
    console.error('Error loading unread messages count:', error);
  });
}

// Update badge when page loads
document.addEventListener('DOMContentLoaded', function() {
  updateNotificationBadge();
  
  // Update badge every 30 seconds
  setInterval(updateNotificationBadge, 30000);
});
