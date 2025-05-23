// ClassroomList.jsx
import "./ClassroomList.css";

export function ClassroomList({ classrooms }) {
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
            </table>
            <table>
                <colgroup>
                    <col style={{ width: '7.69%' }} />
                    <col style={{ width: '23.07%' }} />
                    <col style={{ width: '23.07%' }} />
                    <col style={{ width: '23.07%' }} />
                </colgroup>
                <tbody>
                    {classrooms.map((classroom) => (
                        <tr key={classroom.id}>
                            <td>{classroom.id}</td>
                            <td>PNV 26A</td>
                            <td>2025-05-22 16:07:10</td>
                            <td>2025-05-22 16:07:10</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
