// ClassroomInfo.jsx
import "./ClassroomInfo.css";

export function ClassroomInfo() {
    return (
        <div className="content classroom-info-container">
            <h4 style={{ paddingTop: "10px" }}>Class information</h4>
            <form className="classroom-info-form">
                <label>
                    <span className="label-title">Class name:</span>
                    <input value="PNV 26A" />
                </label>

                <label>
                    <span className="label-title">Created at:</span>
                    <input type="date" value="2025-01-01" />
                </label>

                <span className="label-title">Teachers:</span>
                <div className="teacher-avatar-place form-section">
                    {[1, 2, 3].map((_, i) => (
                        <div className="teacher-avatar-item" key={i}>
                            <div className="teacher-avatar"
                                style={{
                                    backgroundImage: "url('https://th.bing.com/th/id/OIP.lFfefuSR0zhQyrwk3N93NAHaEK?w=281&h=180&c=7&r=0&o=5&cb=iwc2&pid=1.7')"
                                }}></div>
                            <p className="teacher-name">Ho Ly Kim Sa</p>
                        </div>
                    ))}
                </div>

                <label>
                    <span className="label-title">Total students:</span> 25
                </label>

                <label>
                    <span className="label-title">Subjects: 5</span>
                    <div className="subjects-place">
                        {Array(5).fill("GE3 - IT English").map((subj, idx) => (
                            <span className="badge" key={idx}>{subj}</span>
                        ))}
                    </div>
                </label>

                <label>
                    <span className="label-title">Semesters: 6 (6 months/ 1)</span>
                    <div className="semester-list">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <div className="semester-row" key={num}>
                                <span>Semester {num}:</span>
                                <input type="date" value="2025-01-01" />
                                <input type="date" value="2025-06-01" />
                            </div>
                        ))}
                    </div>
                </label>

                <div className="action-buttons">
                    <button className="action-button edit-class-button">
                        <i className="fas fa-pen"></i>
                    </button>
                    <button className="action-button delete-class-button">
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            </form>
        </div>
    );
}
