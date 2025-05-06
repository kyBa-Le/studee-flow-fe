import 'bootstrap/dist/css/bootstrap.min.css';
import "./TeacherManagement.css";
import { getAllTeachers } from '../../../services/UserService';
import { useEffect, useState } from "react";

export function TeacherManagement() {

    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [centerButton, setCenterButton] = useState(1);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setLoading(true);
                const response = await getAllTeachers({ size: 10, page: currentPage });
                setTotalPages(response.last_page);
                setTeachers(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, [currentPage]);

    function renderPaginationButtons() {
        const startPage = Math.max(1, centerButton - 1);
        const endPage = Math.min(totalPages, centerButton + 1);
        const pageButtons = [];
        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    className={`page-button ${currentPage === i ? "active" : ""}`}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </button>
            );
        }
        return pageButtons;
    }

    function handleArrowClick(direction) {
        let newCenter = centerButton + direction;
        newCenter = Math.max(1, Math.min(totalPages, newCenter));
        setCenterButton(newCenter);
    }

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center vh-100"><i className="fa-solid fa-spinner fa-spin"></i></div>;
    }

    if (error) {
        return <div className="text-center text-danger d-flex justify-content-center align-items-center vh-100">Opp !_! We got an error! Please try again.</div>;
    }

    return (
        <div className="teacher-management-container">

            {/* Add button and search box */}
            <div className="add-and-search-container">
                <button id="add-button">+ Add</button>
                <form id="search-box">
                    <input type="text" placeholder="Search ..." />
                    <div id="search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                </form>
            </div>

            {/* Main content */}
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
                            {teachers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-danger">
                                        No teachers found.
                                    </td>
                                </tr>
                            ) : (
                                teachers.map((teacher) => (
                                    <tr className="teacher-account-item" key={teacher.id}>
                                        <td className="col-id">{teacher.id ?? "NULL"}</td>
                                        <td className="col-name">{teacher.full_name ?? "NULL"}</td>
                                        <td className="col-gender">{teacher.gender ?? "NULL"}</td>
                                        <td className="col-email">{teacher.email ?? "NULL"}</td>
                                        <td className="col-date">{teacher.created_at ?? "NULL"}</td>
                                        <td className="col-action">
                                            <div className="button-container">
                                                <button className="button-edit"><i className="fa-solid fa-pen-to-square"></i></button>
                                                <button className="button-remove"><i className="fa-solid fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination-place">
                    <div className="pagination-container">
                        <i className="fa-solid fa-angles-left" onClick={() => handleArrowClick(-3)}></i>
                        <div className="pagination-buttons">
                            {renderPaginationButtons()}
                        </div>
                        <i className="fa-solid fa-angles-right" onClick={() => handleArrowClick(3)}></i>
                    </div>
                </div>
            </div>
        </div>
    );
}
