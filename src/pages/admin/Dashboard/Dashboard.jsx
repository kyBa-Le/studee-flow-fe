import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  getStudentCount,
  getTeacherCount,
  getTeacherPerClass,
  getAllClassrooms,
  getUserVisitLogsByRange,
  get7ConsecutiveDays,
  getUserVisitLogsByDay,
} from "../../../services/DashboardService";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

export function Dashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [classrooms, setClassrooms] = useState([]);
  const [teacherChartData, setTeacherChartData] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [userLogs, setUserLogs] = useState({ students: [], teachers: [] });
  const [selectedDate, setSelectedDate] = useState(() => {
    // Mặc định là ngày hôm nay
    return new Date().toISOString().split("T")[0];
  });

  const [studentBarData, setStudentBarData] = useState({
    labels: ["Visits"],
    datasets: [
      {
        label: "Student Visits",
        data: [0],
        backgroundColor: ["#36A2EB"],
      },
    ],
  });
  const [teacherBarData, setTeacherBarData] = useState({
    labels: ["Visits"],
    datasets: [
      {
        label: "Teacher Visits",
        data: [0],
        backgroundColor: ["#FF6384"],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [students, teachers, classrooms, teacherChart] =
          await Promise.all([
            getStudentCount(),
            getTeacherCount(),
            getAllClassrooms(),
            getTeacherPerClass(),
          ]);

        // Lấy 7 ngày gần nhất
        const today = new Date();
        const endDate = today.toISOString().split("T")[0];
        const startDateObj = new Date(today.setDate(today.getDate() - 6));
        const startDate = startDateObj.toISOString().split("T")[0];

        const logs = await getUserVisitLogsByRange(startDate, endDate);

        // Tạo mảng 7 ngày liên tiếp
        const days = get7ConsecutiveDays(startDate);
        // Map dữ liệu logs vào từng ngày, nếu không có thì set 0
        const logsByDate = {};
        logs.forEach((item) => {
          logsByDate[item.date] = item;
        });

        setStudentCount(students);
        setTeacherCount(teachers);
        setClassrooms(classrooms);

        // Sắp xếp classroom cho Pie chart
        const sortedChart = teacherChart.sort((a, b) => {
          const [, numA, letterA] = a.class_name.match(/(\d+)([A-Z])/i) || [];
          const [, numB, letterB] = b.class_name.match(/(\d+)([A-Z])/i) || [];

          if (parseInt(numA) !== parseInt(numB)) {
            return parseInt(numA) - parseInt(numB);
          }
          return letterA.localeCompare(letterB);
        });
        setTeacherChartData(sortedChart);

        setStudentBarData({
          labels: days,
          datasets: [
            {
              label: "Student Visits",
              data: days.map((date) => logsByDate[date]?.student_visits || 0),
              backgroundColor: "#36A2EB",
            },
          ],
        });
        setTeacherBarData({
          labels: days,
          datasets: [
            {
              label: "Teacher Visits",
              data: days.map((date) => logsByDate[date]?.teacher_visits || 0),
              backgroundColor: "#FF6384",
            },
          ],
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Lấy log chi tiết từng user theo ngày (khi chọn ngày)
  useEffect(() => {
    const fetchUserLogs = async () => {
      try {
        const logs = await getUserVisitLogsByDay(selectedDate);
        setUserLogs(logs);
      } catch (err) {
        setUserLogs({ students: [], teachers: [] });
      }
    };
    fetchUserLogs();
  }, [selectedDate]);

  const pieData = {
    labels: teacherChartData.map((item) => item.class_name),
    datasets: [
      {
        label: "Number of teachers per classroom",
        data: teacherChartData.map((item) => item.teacher_count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
          "#8A2BE2",
          "#00CED1",
          "#FFD700",
        ],
        borderWidth: 1,
      },
    ],
  };
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right", labels: { font: { size: 16 } } },
      title: {
        display: true,
        text: "Distribution of teachers by classrooms",
        font: { size: 20, weight: "bold" },
      },
    },
  };

  const studentBarOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { font: { size: 16 } } },
      title: {
        display: true,
        text: "Student Visit Count",
        font: { size: 20, weight: "bold" },
      },
    },
    scales: {
      x: { ticks: { font: { size: 14 } } },
      y: { ticks: { font: { size: 14 } } },
    },
  };
  const teacherBarOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { font: { size: 16 } } },
      title: {
        display: true,
        text: "Teacher Visit Count",
        font: { size: 20, weight: "bold" },
      },
    },
    scales: {
      x: { ticks: { font: { size: 14 } } },
      y: { ticks: { font: { size: 14 } } },
    },
  };

  return (
    <div className="dashboard">
      <div className="dashboard__cards">
        <div className="dashboard__card">
          <div>
            <h3 className="dashboard__card-title">{studentCount}</h3>
            <p className="dashboard__card-subtitle">Total Students</p>
          </div>
        </div>
        <div className="dashboard__card">
          <div>
            <h3 className="dashboard__card-title">{teacherCount}</h3>
            <p className="dashboard__card-subtitle">Total Teachers</p>
          </div>
        </div>
        <div className="dashboard__card">
          <div>
            <h3 className="dashboard__card-title">{classrooms.length}</h3>
            <p className="dashboard__card-subtitle">Total Classrooms</p>
          </div>
        </div>
      </div>

      {/* Pie chart: phân phối giáo viên */}
      <div
        className="dashboard__chart"
        style={{ maxWidth: "1200px", height: "1200px", margin: "40px auto" }}
      >
        <Pie data={pieData} options={pieOptions} height={400} />
      </div>

      {/* Bar chart riêng: Student Visits */}
      <div
        className="dashboard__chart"
        style={{ maxWidth: "1200px", height: "1200px", margin: "40px auto" }}
      >
        <Bar data={studentBarData} options={studentBarOptions} height={400} />
      </div>

      {/* Bar chart riêng: Teacher Visits */}
      <div
        className="dashboard__chart"
        style={{ maxWidth: "1200px", height: "1200px", margin: "40px auto" }}
      >
        <Bar data={teacherBarData} options={teacherBarOptions} height={400} />
      </div>

      {/* Chọn ngày để xem chi tiết log từng user */}
      <div className="dashboard__date-picker">
        <label htmlFor="log-date">View user access details on:</label>
        <input
          id="log-date"
          type="date"
          value={selectedDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Bảng chi tiết số lần truy cập từng user theo ngày */}
      <div className="dashboard__user-log">
        <h3>User Visit Details ({selectedDate})</h3>
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Role</th>
              <th>Visit Count</th>  
            </tr>
          </thead>
          <tbody>
            {userLogs.students?.map((s) => (
              <tr key={"student-" + s.user_id}>
                <td>{s.full_name}</td>
                <td>Student</td>
                <td>{s.visit_count}</td>
              </tr>
            ))}
            {userLogs.teachers?.map((t) => (
              <tr key={"teacher-" + t.user_id}>
                <td>{t.full_name}</td>
                <td>Teacher</td>
                <td>{t.visit_count}</td>
              </tr>
            ))}
            {!userLogs.students?.length && !userLogs.teachers?.length && (
              <tr>
                <td colSpan={3}>No access data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
