import "./SubjectList.css";
export function SubjectList({subjects}) {
  return (
    <div className="subject-list-container">
          <div className="subject-list-content">
            <div className='subject-list-body-header'>
                 <div className="subject-list-header-left">
                    <h2 className='subject-list-body-header-title'>All Subjects</h2>
                    <button className="create-subject-btn">
                    <i className="fa-solid fa-plus"></i> Create Subject
                    </button>
                </div>
                <div className='subject-list-body-header-search'>
                    <input
                        type="text"
                        placeholder="Search ..."
                        className="subject-list-search-input"
                    />
                    <span className="subject-list-search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>
            </div>

            <div className="subject-list-grid">
              {subjects.length > 0 ? (
                subjects.map((cls, idx) => {
                  const colorClass = `subject-card-${idx % 3}`;
                  return (
                    <div
                      key={cls.id || idx}
                      className={`subject-card ${colorClass}`}
                    >
                      <h3 className="subject-card-title">
                        {cls.subject_name}
                      </h3>
                    </div>
                  );
                })
              ) : (
                <div className="subject-list-empty">
                  No subjects found.
                </div>
              )}
            </div>
          </div>
    </div>
  );
}