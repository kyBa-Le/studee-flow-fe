import apiClient from "./apiClient";
import { messaging, getToken } from "./firebase";

export async function customGetToken() {
  try {
    const swReg = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey:
        "BIbPickuUN99DQ2jA2fy69yuqANpjOdC2w72OJWlMXsaJxmwmUGvsb6xfx0NBGlTPR082F8ErZv7ht3u89auO5c",
      serviceWorkerRegistration: swReg,
    });

    if (token) {
      await apiClient.post("/api/users/notification-token", {
        fcm_token: token,
      });
    }
  } catch (err) {
    console.error("Can not get the CFM token:", err);
  }
}

export async function getNotifications() {
    try {
        return await apiClient.get('/api/notifications');
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
}

export async function markNotificationAsRead(notificationId) {
    try {
        return await apiClient.post(`/api/notifications/${notificationId}/read`);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
}
