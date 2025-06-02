import apiClient from './apiClient';

export async function getStudentCount() {
  try {
    const res = await apiClient.get('api/students');
    return res.data.length;
  } catch (error) {
    console.error('Error fetching student count:', error);
    throw error;
  }
}

export async function getTeacherCount() {
  try {
    const res = await apiClient.get('api/teachers');
    return res.data.length;
  } catch (error) {
    console.error('Error fetching teacher count:', error);
    throw error;
  }
} 

export async function getAllClassrooms() {
  try {
    const res = await apiClient.get('api/classrooms');
    return res.data;
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    throw error;
  }
}

export async function getTeacherPerClass() {
  try {
    const res = await apiClient.get('api/dashboard/teacher-per-class');
    return res.data;
  } catch (error) {
    console.error('Error fetching teacher-per-class data:', error);
    throw error;
  }
}
  
export async function getUserVisitLogsByDay(date) {
  try {
    const res = await apiClient.get('api/dashboard/user-visit-logs-by-day', {
      params: { date }
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching user visit logs by day:', error);
    throw error;
  }
}

export async function logUserVisit() {
  try {
    await apiClient.post('/api/user-visit-log');
  } catch (error) {
    console.error('Error logging user visit:', error);
  }
}

export async function getTotalVisitLogs() {
  try {
    const res = await apiClient.get('api/dashboard/total-visit-logs');
    return res.data.total ?? 0;
  } catch (error) {
    console.error('Error fetching total visit logs:', error);
    throw error;
  }
}

export async function getUserVisitLogsByRange(startDate, endDate) {
  try {
    const res = await apiClient.get('api/dashboard/user-visit-logs-by-range', {
      params: { start_date: startDate, end_date: endDate }
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching user visit logs by range:', error);
    throw error;
  }
}

export function get7ConsecutiveDays(startDate) {
  const days = [];
  const start = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

