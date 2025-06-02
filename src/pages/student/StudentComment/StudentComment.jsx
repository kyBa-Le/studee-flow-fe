import { useEffect, useState } from 'react';
import './StudentComment.css';
import { getUser } from '../../../services/UserService';
import { createComment, getAllTeachersByClassroomId } from '../../../services/CommentService';

export function StudentComment({ setIsShowCommentModal, journalId, field, relativeX, relativeY, isReadOnly, data, setComments }) {
    const [user, setUser] = useState();
    const [teachers, setTeachers] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUser();
            setUser(response.data);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchTeachers = async () => {
            if (user?.student_classroom_id) {
                try {
                    const response = await getAllTeachersByClassroomId(user.student_classroom_id);
                    setTeachers(response.data || []);
                } catch (error) {
                    console.error("Error fetching teachers:", error);
                }
            }
        };
        fetchTeachers();
    }, [user]);

    const [comment, setComment] = useState({
        receiver_id: selectedTeacher?.id || null,
        type: "in_class",
        relative_x: relativeX,
        relative_y: relativeY,
        in_class_id: journalId,
        self_study_id: null,
        content: data?.content || "",
        field: field
    });

    // Xử lý thay đổi nội dung comment
    const handleContentChange = (e) => {
        const value = e.target.value;
        setComment({ ...comment, content: value });

        // Kiểm tra nếu có ký tự @ để hiển thị gợi ý
        const lastAtIndex = value.lastIndexOf('@');
        if (lastAtIndex !== -1) {
            const searchTerm = value.substring(lastAtIndex + 1).toLowerCase();
            const filtered = teachers.filter(teacher =>
                teacher.full_name.toLowerCase().includes(searchTerm)
            );
            setFilteredTeachers(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    // Chọn teacher từ danh sách gợi ý
    const handleSelectTeacher = (teacher) => {
        const content = comment.content;
        const lastAtIndex = content.lastIndexOf('@');
        const newContent = content.substring(0, lastAtIndex) + `@${teacher.full_name} `;

        setComment({
            ...comment,
            content: newContent,
            receiver_id: teacher.id
        });
        setSelectedTeacher(teacher);
        setShowSuggestions(false);
    };

    // Xử lý submit
    async function handleSubmit() {
        if (!comment.content.trim()) {
            alert("Vui lòng nhập nội dung comment");
            return;
        }

        console.log("Submitting comment:", comment);
        try {
            const newComment = (await createComment(comment)).data.comment;
            setComments(prev => [...prev, newComment]);
            setIsShowCommentModal(false);
        } catch (error) {
            console.error("Error creating comment:", error);
            alert("Có lỗi xảy ra khi tạo comment");
        }
    }

    return (
        <div className='student-comment-container'>
            <div className='student-comment-content'>
                <div className='student-comment-info'>
                    <img
                        src={user?.avatar_link}
                        alt="Avatar"
                        className="avatar"
                    />
                    <span className="username">{user?.full_name}</span>
                </div>

                <div className="comment-input-wrapper" style={{ position: 'relative' }}>
                    <input
                        style={{ width: '100%' }}
                        disabled={isReadOnly}
                        value={comment.content}
                        onChange={handleContentChange}
                        name="content"
                        type="text"
                        placeholder="Comment or add others with @"
                        className="comment-input"
                        onFocus={() => {
                            if (comment.content.includes('@')) {
                                const lastAtIndex = comment.content.lastIndexOf('@');
                                const searchTerm = comment.content.substring(lastAtIndex + 1).toLowerCase();
                                const filtered = teachers.filter(teacher =>
                                    teacher.full_name.toLowerCase().includes(searchTerm)
                                );
                                setFilteredTeachers(filtered);
                                setShowSuggestions(true);
                            }
                        }}
                        onBlur={() => {
                            // Delay để cho phép click vào suggestion
                            setTimeout(() => setShowSuggestions(false), 200);
                        }}
                    />

                    {/* Danh sách gợi ý teachers */}
                    {showSuggestions && filteredTeachers.length > 0 && (
                        <div className="teacher-suggestions" style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            zIndex: 1000,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            {filteredTeachers.map(teacher => (
                                <div
                                    key={teacher.id}
                                    className="teacher-suggestion-item"
                                    onClick={() => handleSelectTeacher(teacher)}
                                    style={{
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        borderBottom: '1px solid #eee'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                >
                                    <img
                                        src={teacher.avatar_link}
                                        alt={teacher.full_name}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <span>{teacher.full_name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hiển thị teacher đã được tag */}
                {selectedTeacher && (
                    <div className="tagged-teacher" style={{
                        marginTop: '8px',
                        padding: '4px 8px',
                        backgroundColor: '#e8f4fd',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px'
                    }}>
                        <img
                            src={selectedTeacher.avatar_link}
                            alt={selectedTeacher.full_name}
                            style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}
                        />
                        <span>Đã tag: {selectedTeacher.full_name}</span>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedTeacher(null);
                                setComment({ ...comment, receiver_id: null });
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0',
                                marginLeft: '4px'
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className='student-comment-button-group'>
                    <button
                        type='button'
                        className="student-comment-btn student-comment-btn-cancel"
                        onClick={() => setIsShowCommentModal(false)}
                    >
                        Cancel
                    </button>
                    {!isReadOnly && (
                        <button
                            type='button'
                            className="student-comment-btn student-comment-btn-submit"
                            onClick={handleSubmit}
                        >
                            Comment
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};