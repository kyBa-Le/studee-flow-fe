import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClassrooms } from "../../../services/ClassroomService";
import { getAllStudentsByClassroomId } from "../../../services/UserService";
import "./TeacherHome.css";

export function TeacherHome() {
  const [classes, setClasses] = useState([]);
  const [studentCounts, setStudentCounts] = useState({});
  const [teacherCounts, setTeacherCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, [classes]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resClasses = await getAllClassrooms();
        setClasses(resClasses.data);

        const studentCounts = {};
        const teacherCounts = {};

        const promises = resClasses.data.map(async (cls) => {
          try {
            const resStudents = await getAllStudentsByClassroomId(cls.id);
            studentCounts[cls.id] = resStudents.data.length;

            teacherCounts[cls.id] = cls.teachers ? cls.teachers.length : 0;

          } catch (error) {
            console.error(`Failed to fetch data for class ${cls.id}:`, error);
            studentCounts[cls.id] = 0;
            teacherCounts[cls.id] = 0;
          }
        });

        await Promise.all(promises);
        setStudentCounts(studentCounts);
        setTeacherCounts(teacherCounts);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };

    fetchData();
  }, []);

  const handleClassClick = (classId, className) => {
    navigate(`/teacher/classroom/${classId}`, {
      state: {
        className: className
      }
    });
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <main>
        <section className="max-w-[90vw] mx-auto px-6 py-10 pt-[130px]">
          <div className="bg-white p-8 rounded-xl shadow px-[65px] min-h-[80vh]">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-[24px] font-semibold" style={{ color: "#5F5F64" }}>All classes</h2>
            </div>

            <div className="grid grid-cols-3" style={{ gridTemplateColumns: "1fr 1fr 1fr", paddingLeft: "0px", gap: "3vw" }}>
              {classes.length > 0 ? (
                classes.map((cls, idx) =>
                {
                  const colorClass = `classroom-card-${idx % 3}`;
                  return (
                    <div
                      key={cls.id || idx}
                      className={`${cls.color || "bg-purple-100"
                        } p-5 rounded-xl shadow-sm transition transform hover:scale-105 hover:shadow-md cursor-pointer ${colorClass}`}
                      onClick={() => handleClassClick(cls.id, cls.class_name)}
                    >
                      <h3 className="font-normal text-[22px] pb-2 classroom-card-title">
                        {cls.class_name}
                      </h3>
                      <div className="flex items-center text-sm gap-3">
                        <i data-feather="users" className="w-4 h-4"></i>
                        <span>
                          {studentCounts[cls.id] || 0}
                          {studentCounts[cls.id] > 1 ? " students" : " student"}
                        </span>
                        <i data-feather="monitor" className="w-4 h-4 ml-4"></i>
                        <span>
                          {teacherCounts[cls.id] || 0}
                          {teacherCounts[cls.id] > 1 ? " teachers" : " teacher"}
                        </span>
                      </div>
                    </div>
                  )
                }
                )
              ) : (
                <div className="text-center col-span-full text-gray-500">
                  No classrooms found.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}