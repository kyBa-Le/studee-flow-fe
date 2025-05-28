import { Link } from 'react-router-dom';
import "./StudentList.css";

export function StudentList({students, progressData, handleChangeFeedback}) {
    return (
        <div className='student-list'>
            <div className="student-list-count-wrap">
                <div className="student-list-count">
                    <span className="student-list-count-icon"><i class="fa-solid fa-user-graduate"></i></span>
                    <span className="count">{students.length > 1 ? students.length + " students" : students.length + " student" } </span>
                </div>
            </div>
            <div className='student-list-body'>
                <div className='student-list-body-header'>
                    <h2 className='student-list-body-header-title'>All Students</h2>
                    <div className='student-list-body-header-search'>
                        <input
                            type="text"
                            placeholder="Search ..."
                            className="student-list-search-input"
                        />
                        <span className="student-list-search-icon">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </span>
                    </div>
                </div>
                <table className="student-list-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Weekly goal completion rate</th>
                            <th>Deadline completion rate</th>
                            <th>Learning journal</th>
                            <th>Activity</th>
                        </tr>
                    </thead>
                    <tbody>
                    {students.map((student, index) => {
                        const progress = progressData[student.id]?.[0] || {};
                        const weeklyRate = progress.completion_rate_weekly ?? 0;
                        const deadlineRate = progress.deadline_completion_rate ?? 0;

                        const weeklyColor = weeklyRate < 50 ? '#ff9900' : '#34c9f2';
                        const deadlineColor = deadlineRate < 50 ? '#ff9900' : '#34c9f2';

                        return (
                        <tr key={index}>
                            <td className="student-list-image-cell">
                            <img  src={student.avatar_link || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"} alt="Avatar" className="student-list-avatar" />
                            </td>
                            <td className="student-list-name-cell">{student.full_name}</td>
                            <td>
                            {weeklyRate}%
                            <div className="student-list-progress-bar-container">
                                <div
                                className="student-list-progress-bar goal"
                                style={{ width: `${weeklyRate}%`, backgroundColor: weeklyColor }}
                                ></div>
                            </div>
                            </td>
                            <td>
                            {deadlineRate}%
                            <div className="student-list-progress-bar-container">
                                <div
                                className="student-list-progress-bar deadline"
                                style={{ width: `${deadlineRate}%`, backgroundColor: deadlineColor }}
                                ></div>
                            </div>
                            </td>
                        <td>
                            <select
                                value={progress.learning_journal_feedback || ""}
                                onChange={(e) => handleChangeFeedback(student.id, e.target.value)}
                                className={`status-select ${
                                progress.learning_journal_feedback === "Good" ? "good" :
                                progress.learning_journal_feedback === "OK" ? "ok" :
                                progress.learning_journal_feedback === "Need to be fixed" ? "need" :
                                ""
                                }`}
                            >
                                <option value="Good">Good</option>
                                <option value="OK">OK</option>
                                <option value="Need to be fixed">Need to be fixed</option>
                            </select>
                            </td>
                            <td>
                            <div className="student-list-action-buttons">
                                <Link to={`/student/${student.id}/semester-goal`} className="student-list-action-button">Semester goals</Link>
                                <Link  to={`/student/${student.id}/learning-journal`} className="student-list-action-button">Learning journal</Link>
                                <Link to={`/student/${student.id}/profile`} className="student-list-action-button">View profile</Link>
                            </div>
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};