// ClassroomList.jsx
import { DateConverter } from "../../../components/utils/DateConverter";
import "./ClassroomList.css";

export function ClassroomList({ classrooms, setSelectedClassroom }) {

    return (
        <div className="content classroom-list-container">
            <table>
                <colgroup>
                    <col style={{ width: '7.69%' }} />
                    <col style={{ width: '23.07%' }} />
                    <col style={{ width: '23.07%' }} />
                    <col style={{ width: '23.07%' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Class name</th>
                        <th>Created at</th>
                        <th>Updated at</th>
                    </tr>
                </thead>
                {
                    classrooms.map((classroom, index) => {
                        return (
                            <tbody>
                                <tr onClick={() => setSelectedClassroom(index)} style={{cursor: "pointer"}} key={classroom.id}>
                                    <td>{classroom.id}</td>
                                    <td>{classroom.class_name}</td>
                                    <td>{DateConverter(classroom.created_at)}</td>
                                    <td>{DateConverter(classroom.updated_at)}</td>
                                </tr>
                            </tbody>
                        );
                    })
                }
            </table>
        </div>
    );
}
