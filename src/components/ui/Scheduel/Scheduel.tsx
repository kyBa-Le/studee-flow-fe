import React, { useState, useEffect } from "react";
import { getTask } from "../../../services/TaskService";
import {
  ScheduleComponent,
  Day,
  Week,
  Inject,
  ViewsDirective,
  ViewDirective,
  EventSettingsModel,
} from "@syncfusion/ej2-react-schedule";

const Schedule = () => {
  const [events, setEvents] = useState<any[]>([]);

  const transformEvents = (data: any[]) => {
    return data.map((event) => {
      const start = event.start_time.split(" ");
      const startDate = start[0].split("-");
      const startTime = start[1].split(":");

      const end = event.end_time.split(" ");
      const endDate = end[0].split("-");
      const endTime = end[1].split(":");

      return {
        Subject: event.title, 
        StartTime: new Date(
          parseInt(startDate[0]),
          parseInt(startDate[1]) - 1,
          parseInt(startDate[2]),
          parseInt(startTime[0]),
          parseInt(startTime[1])
        ),
        EndTime: new Date(
          parseInt(endDate[0]),
          parseInt(endDate[1]) - 1,
          parseInt(endDate[2]),
          parseInt(endTime[0]),
          parseInt(endTime[1])
        ),
        student_id: event.student_id,
      };
    });
  };

  useEffect(() => {
    getTask()
      .then((response) => {
        const transformedData = transformEvents(response);
        setEvents(transformedData);
      })
      .catch((error) => console.error("Error fetching User:", error));
  }, []);

  const eventSettings: EventSettingsModel = { dataSource: events };

  return (
    <ScheduleComponent
      width={"100%"}
      height={"540px"}
      currentView="Week"
      eventSettings={eventSettings}
    >
      <ViewsDirective>
        <ViewDirective option="Day" />
        <ViewDirective option="Week" />
      </ViewsDirective>
      <Inject services={[Day, Week]} />
    </ScheduleComponent>
  );
};

export default Schedule;
