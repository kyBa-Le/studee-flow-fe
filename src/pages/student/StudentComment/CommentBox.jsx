export default function CommentBox({comment}) {
    const user = comment.commenter;
    return (
        <div
            className="d-flex align-items-start gap-3 bg-light p-3 rounded"
            style={{
                fontFamily: 'sans-serif',
                maxWidth: '500px'
            }}
        >
            {/* Avatar */}
            <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                    backgroundImage: `url(${user.avatar_link})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                    width: '35px',
                    height: '35px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    flexShrink: 0
                }}
            >
            </div>

            {/* Content */}
            <div className="d-flex flex-column">
                {/* Header */}
                <div className="d-flex gap-2" style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    <div>{user.full_name}</div>
                    <div style={{ color: 'gray', fontWeight: 'normal' }}>{comment.created_at}</div>
                </div>

                {/* Comment text */}
                <div style={{ marginTop: '4px', fontSize: '14px' }}>{comment.content}</div>
            </div>
        </div>
    );
}
  