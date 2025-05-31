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
import { registerLicense } from '@syncfusion/ej2-base';
import { getAllDeadlinesByClassroomId } from "../../../services/DeadlineService";

registerLicense('Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXpedXRTRWBfWUNzV0pWYUA=');

const Schedule = ({studentId, classroomId, deadlines}) => {
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
        student_id: studentId,
      };
    });
  };

  const transformDeadlineToEvents = (deadlines: any[]) => {
    return deadlines.map((deadline) => {
      const [startHour, startMinute] = deadline.started_at.split(':').map(Number);
      const [endHour, endMinute] = deadline.ended_at.split(':').map(Number);
      const [year, month, day] = deadline.date.split('-').map(Number);
  
      return {
        Subject: deadline.title,
        StartTime: new Date(year, month - 1, day, startHour, startMinute),
        EndTime: new Date(year, month - 1, day, endHour, endMinute),
        student_id: null,
      };
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const transformedEvents: any[] = [];
  
        // Nếu có studentId -> lấy task và convert
        if (studentId) {
          const taskRes = await getTask(studentId);
          const taskEvents = transformEvents(taskRes.data); // task → transformEvents
          transformedEvents.push(...taskEvents);
        }
  
        // Nếu có classroomId -> lấy deadlines và convert
        if (classroomId) {
          const deadlineRes = await getAllDeadlinesByClassroomId(classroomId);
          const classDeadlines = transformDeadlineToEvents(deadlineRes.data); // deadline → transformDeadlineToEvents
          transformedEvents.push(...classDeadlines);
        }
  
        // Nếu props.deadlines được truyền riêng → convert tiếp
        if (deadlines) {
          const extraDeadlines = transformDeadlineToEvents(deadlines);
          transformedEvents.push(...extraDeadlines);
        }
  
        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents();
  }, [studentId, classroomId, deadlines]);
  


const eventSettings: EventSettingsModel = React.useMemo(() => ({ dataSource: events }), [events]);


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
