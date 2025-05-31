import apiClient from './apiClient';

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