import "./style.css";

export function TeacherManagement() {
    
    const teachers = Array.from({ length: 10 }, (_, index) => ({
        id: `00${index + 1}`,
        name: `Teacher ${index + 1}`,
        gender: index % 2 === 0 ? "Male" : "Female",
        email: `teacher${index + 1}@gmail.com`,
        createdAt: `12/02/2025 16:00:${10 + index}`
    }));

    return (
        <div className="teacher-management-container">

            {/* Place of add button and search box */}
            <div className="add-and-search-container">
                <button id="add-button">+ Add</button>
                <form id="search-box">
                    <input type="text" placeholder="Search ..." />
                    <div id="search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                </form>
            </div>

            {/* Place of main content */}
            <div className="main-content-container">
                <table className="view-all-teacher-table">
                    <thead>
                        <tr>
                            <td className="col-id">ID</td>
                            <td className="col-name">Teacher</td>
                            <td className="col-gender">Gender</td>
                            <td className="col-email">Email</td>
                            <td className="col-date">Created_at</td>
                            <td className="col-action">Action</td>
                        </tr>
                    </thead>


                </table>
                <div className="table-scroll-container">
                    <table className="view-all-teacher-table">
                        <tbody>
                            {teachers.map((teacher) => (
                                <tr className="teacher-account-item" key={teacher.id}>
                                    <td className="col-id">{teacher.id}</td>
                                    <td className="col-name">{teacher.name}</td>
                                    <td className="col-gender">{teacher.gender}</td>
                                    <td className="col-email">{teacher.email}</td>
                                    <td className="col-date">{teacher.createdAt}</td>
                                    <td className="col-action">
                                        <div className="button-container">
                                            <button className="button-edit"><i className="fa-solid fa-pen-to-square"></i></button>
                                            <button className="button-remove"><i className="fa-solid fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination-place">
                    <div className="pagination-container">
                        <i class="fa-solid fa-angles-left"></i>
                        <div className="pagination-buttons">
                            <button className="active">1</button>
                            <button>2</button>
                            <button>3</button>
                        </div>
                        <i class="fa-solid fa-angles-right"></i>
                    </div>
                </div>
            </div>
        </div>
    );
}