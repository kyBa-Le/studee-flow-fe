import React from 'react'
import apiClient from "./apiClient";

export async function getWeeklySelfStudyJournalOfStudent(week_id = 0) {
   try {
    const response = await apiClient.get(`/api/student/self-studies?week_id=${week_id}`);
    return response;
  } catch (error) {
    console.error("Error while fetching semester goals:", error);
    return [];
  }
}
export async function createSelfStudyJournal(data) {
  try {
    const response = await apiClient.post("/api/student/self-studies", data);
    return response;
  } catch (error) {
    return error;
  }
}
