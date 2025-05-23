import { ButtonDelete } from "../../../components/ui/Button/Delete/ButtonDelete";
import { ButtonEdit } from "../../../components/ui/Button/Edit/ButtonEdit";
import { DateConverter } from "../../../components/utils/DateConverter";
import "./ClassroomInfo.css";

export function ClassroomInfo({classroom}) {
    return (
        <div className="content classroom-info-container">
            <h4 style={{ paddingTop: "10px" }}>Class information</h4>
            {
                classroom && (
                    <form className="classroom-info-form">
                        <label>
                            <span className="label-title">Class name:</span>
                            <input value={classroom.class_name} />
                        </label>

                        <label>
                            <span className="label-title">Created at:</span>
                            <input readOnly type="date" value={DateConverter(classroom.created_at)} />
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
                            <span className="label-title">Total students:</span>
                            <div>25</div>
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
                            <span className="label-title">Semesters:</span>
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
                            <ButtonEdit/>
                            <ButtonDelete/>
                        </div>
                    </form>
                )
            }
        </div>
    );
}
