import { useEffect, useState } from 'react';
import './StudentComment.css';
import { getUser } from '../../../services/UserService';
import { createComment } from '../../../services/CommentService';

export function StudentComment({setIsShowCommentModal, journalId, field, relativeX, relativeY, isReadOnly, data, setComments}) {
    const [user, setUser] = useState();
    const [comment, setComment] = useState({
        receiver_id: 3, // Assuming receiver_id is fixed for now
        type: "in_class",
        relative_x: relativeX,
        relative_y: relativeY,
        in_class_id: journalId,
        self_study_id: null,
        content: data?.content || "",
        field: field
    });

    async function handleSubmit() {
        console.log("Submitting comment:", comment);
        const newComment = (await createComment(comment)).data.comment;
        setComments(prev => [...prev, newComment]);
        setIsShowCommentModal(false);
    }

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUser();
            setUser(response.data);
        };
        fetchUser();
    }, []);

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
                <input
                    disabled={isReadOnly}
                    value={comment.content}
                    onChange={(e) => setComment({ ...comment, content: e.target.value })}
                    name="content"
                    type="text"
                    placeholder="Comment or add others with @"
                    className="comment-input"
                />
                <div className='student-comment-button-group'>
                    <button type='button' className="student-comment-btn student-comment-btn-cancel" onClick={() => setIsShowCommentModal(false)}>Cancel</button>
                    {!isReadOnly && <button type='button' className="student-comment-btn student-comment-btn-submit" onClick={() => handleSubmit()} >Comment</button>}
                </div>
            </div>
        </div>
    );
};

 