import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  getInClassJournal,
  createInClassJournal,
  updateInClassJournal
} from "../../../services/InClassService";
import { getStudentById, getUser } from "../../../services/UserService";
import { getAllSubjects } from "../../../services/SubjectService";
import { LoadingData } from "../../../components/ui/Loading/LoadingData";
import { toast } from "react-toastify";
import { useDebouncedSubmit } from "../../../components/hooks/useDebounceSubmit";
import "./InClass.css";
import { AddLearningJournalFormButton } from "../../../components/ui/Button/AddLearningJournalFormButton";
import { useParams } from "react-router-dom";
import { useUpdateEffect } from "../../../components/hooks/useUpdateEffect";
import { autoResize } from "../../../components/utils/TextAreaAutoResize";
import { StudentComment } from "../StudentComment/StudentComment";
import { getCommentByJournalId } from "../../../services/CommentService";
import CommentBox from "../StudentComment/CommentBox";

export function InClass({ weekId, isSubmited }) {
  const [subjects, setSubjects] = useState([]);
  const [inClassJournal, setInClassJournal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extraForms, setExtraForms] = useState([]);
  const [isShowCommentBox, setIsShowCommentBox] = useState(false);

  const { studentId } = useParams();
  const isReadOnly = useMemo(() => !!studentId, [studentId]);

  // Memoize styles để tránh tạo object mới mỗi lần render
  const cellStyle = useMemo(() => ({
    width: "100%",
    outline: "none",
    height: "100%"
  }), []);

  const selectStyle = useMemo(() => ({
    width: "100%",
    outline: "none"
  }), []);

  // Fetch data một lần duy nhất khi weekId thay đổi
  useEffect(() => {
    if (!weekId) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user và subjects song song
        const [userRes, subjectRes] = await Promise.all([
          studentId ? getStudentById(studentId) : getUser(),
          getAllSubjects(studentId ?
            (await (studentId ? getStudentById(studentId) : getUser())).data.student_classroom_id :
            (await getUser()).data.student_classroom_id
          )
        ]);

        if (!isMounted) return;

        const user = userRes.data;
        setSubjects(subjectRes.data);

        // Fetch journal data
        const journalRes = await getInClassJournal(user.id, weekId);

        if (!isMounted) return;

        setInClassJournal(journalRes.data.length > 0 ? journalRes.data : []);
      } catch (error) {
        if (isMounted) {
          toast.error("Fail to load data.");
          console.error(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [weekId, studentId]);

  const handleAddForm = useCallback(() => {
    setExtraForms(prev => [...prev, { id: Date.now() }]);
  }, []);

  const toggleCommentBox = useCallback(() => {
    setIsShowCommentBox(prev => !prev);
  }, []);

  return (
    <div className="learning-journal-table-container">
      <div className="learning-journal-table">
        <HeaderRow />

        {loading ? (
          <LoadingData content="Loading ..." />
        ) : (
          <>
            {inClassJournal.map((journal) => (
              <InClassForm
                key={journal.id}
                isShowCommentBox={isShowCommentBox}
                initialData={journal}
                subjects={subjects}
                cellStyle={cellStyle}
                selectStyle={selectStyle}
                isReadOnly={isReadOnly}
                isSubmited={isSubmited}
              />
            ))}

            {extraForms.map((form) => (
              <EmptyInClassForm
                key={form.id}
                subjects={subjects}
                cellStyle={cellStyle}
                selectStyle={selectStyle}
                weekId={weekId}
                isReadOnly={isReadOnly}
                isSubmited={isSubmited}
              />
            ))}

            {inClassJournal.length === 0 && (
              <EmptyInClassForm
                subjects={subjects}
                cellStyle={cellStyle}
                selectStyle={selectStyle}
                weekId={weekId}
                isReadOnly={isReadOnly}
                isSubmited={isSubmited}
              />
            )}
          </>
        )}
      </div>

      <div className="add-form-button-places d-flex justify-content-between">
        <div style={{ cursor: "pointer" }} onClick={toggleCommentBox}>
          <div style={{ padding: "3px 6px", backgroundColor: "#FE9C3B", color: "white" }}>
            <i className={`fa-solid ${isShowCommentBox ? 'fa-comment' : 'fa-comment-slash'}`} />
          </div>
        </div>
        {!isReadOnly && <AddLearningJournalFormButton onClick={handleAddForm} />}
      </div>
    </div>
  );
}

// Tách header thành component riêng để tránh re-render
const HeaderRow = () => (
  <div className="learning-journal-row in-class header-row">
    <div className="learning-journal-cell header">Date</div>
    <div className="learning-journal-cell header">Skill/Module</div>
    <div className="learning-journal-cell header">
      My lesson <br /> What did I learn today?
    </div>
    <div className="learning-journal-cell header">
      Self-assessment<br />
      1: I need more practice <br />
      2: I sometimes find this difficult <br />
      3: No problem!
    </div>
    <div className="learning-journal-cell header">My difficulties</div>
    <div className="learning-journal-cell header">My plan</div>
    <div className="learning-journal-cell header">Problem solved</div>
  </div>
);

function EmptyInClassForm({ subjects, cellStyle, selectStyle, weekId, isReadOnly, isSubmited }) {
  const [formData, setFormData] = useState(() => ({
    id: null,
    date: null,
    subject_id: subjects?.[0]?.id || "",
    lesson: "",
    self_assessment: "1",
    difficulties: "",
    plan: "",
    is_problem_solved: 0,
    week_id: weekId,
  }));

  const [isNew, setIsNew] = useState(true);
  const [id, setId] = useState(null);
  const [isShowCommentModal, setIsShowCommentModal] = useState(false);
  const [commentTarget, setCommentTarget] = useState(null);
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });

  const triggerAutoSubmit = useDebouncedSubmit(handleAutoCreate, 1500);
  const commentRef = useRef(null);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "is_problem_solved" ? parseInt(value) : value,
    }));
    triggerAutoSubmit();
  }, [triggerAutoSubmit]);

  async function handleAutoCreate() {
    setIsNew(false);
    try {
      const response = await (isNew ? createInClassJournal(formData) : updateInClassJournal(id, formData));
      if (isNew) {
        const newId = response.data.inClassId;
        setId(newId);
        toast.success("New in-class journal created.");
      }
    } catch (error) {
      console.error(error);
      setIsNew(true);
      toast.error("Error creating in-class journal.");
    }
  }

  const handleRightClick = useCallback((e, fieldName) => {
    e.preventDefault();
    if (isNew) {
      toast.error("Please enter new journal before comment!");
      return;
    }
    setCommentTarget(fieldName);
    setCommentPosition({ x: e.clientX, y: e.clientY });
    setIsShowCommentModal(true);
  }, [isNew]);

  const handleCommentSubmit = useCallback(() => {
    setIsShowCommentModal(false);
  }, []);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setIsShowCommentModal(false);
      }
    }

    if (isShowCommentModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShowCommentModal]);

  return (
    <>
      <form className="learning-journal-row in-class">
        <div className="learning-journal-cell">
          <input
            type="date"
            name="date"
            style={cellStyle}
            value={formData.date || ""}
            onChange={handleChange}
            readOnly={isReadOnly || isSubmited}
          />
        </div>
        <div className="learning-journal-cell">
          <select
            name="subject_id"
            value={formData.subject_id}
            style={selectStyle}
            onChange={handleChange}
            disabled={isReadOnly || isSubmited}
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.subject_name}
              </option>
            ))}
          </select>
        </div>
        <div className="learning-journal-cell">
          <textarea
            onInput={(e) => autoResize(e)}
            name="lesson"
            rows="3"
            style={cellStyle}
            value={formData.lesson}
            onChange={handleChange}
            readOnly={isReadOnly || isSubmited}
            onContextMenu={(e) => handleRightClick(e, 'lesson')}
          />
        </div>
        <div className="learning-journal-cell">
          <select
            name="self_assessment"
            value={formData.self_assessment}
            onChange={handleChange}
            style={selectStyle}
            disabled={isReadOnly || isSubmited}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div className="learning-journal-cell">
          <textarea
            onInput={(e) => autoResize(e)}
            name="difficulties"
            rows="3"
            style={cellStyle}
            value={formData.difficulties}
            onChange={handleChange}
            readOnly={isReadOnly || isSubmited}
            onContextMenu={(e) => handleRightClick(e, 'difficulties')}
          />
        </div>
        <div className="learning-journal-cell">
          <textarea
            onInput={(e) => autoResize(e)}
            name="plan"
            rows="3"
            style={cellStyle}
            value={formData.plan}
            onChange={handleChange}
            readOnly={isReadOnly || isSubmited}
            onContextMenu={(e) => handleRightClick(e, 'plan')}
          />
        </div>
        <div className="learning-journal-cell">
          <select
            name="is_problem_solved"
            value={formData.is_problem_solved}
            onChange={handleChange}
            style={selectStyle}
            disabled={isReadOnly || isSubmited}
          >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </div>

        {isShowCommentModal && (
          <div
            ref={commentRef}
            style={{
              position: 'absolute',
              left: `${commentPosition.x}px`,
              top: `${commentPosition.y}px`,
              zIndex: 1000
            }}>
            <StudentComment
              targetField={commentTarget}
              onClose={handleCommentSubmit}
              journalId={formData.id}
              journalType="in_class"
              setIsShowCommentModal={setIsShowCommentModal}
            />
          </div>
        )}
      </form>
    </>
  );
}

function InClassForm({ initialData, subjects, cellStyle, selectStyle, isReadOnly, isSubmited, isShowCommentBox }) {
  const [formData, setFormData] = useState(initialData);
  const [comments, setComments] = useState([]);
  const [isShowCommentModal, setIsShowCommentModal] = useState(false);
  const [commentTarget, setCommentTarget] = useState(null);
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });

  const triggerAutoSubmit = useDebouncedSubmit(handleAutoUpdate, 1500);
  const commentRef = useRef(null);

  // Fetch comments một lần duy nhất
  useEffect(() => {
    if (!formData.id) return;

    let isMounted = true;

    async function fetchComments() {
      try {
        const response = await getCommentByJournalId(formData.id, "in_class");
        if (isMounted) {
          setComments(response.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }

    fetchComments();

    return () => {
      isMounted = false;
    };
  }, [formData.id]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "is_problem_solved" ? parseInt(value) : value,
    }));
    triggerAutoSubmit();
  }, [triggerAutoSubmit]);

  async function handleAutoUpdate() {
    try {
      await updateInClassJournal(formData.id, formData);
    } catch (error) {
      console.error(error);
      toast.error("Update failed. Please wait and try again.");
    }
  }

  const handleRightClick = useCallback((e, fieldName) => {
    e.preventDefault();
    const form = e.target.closest("form");
    if (!form) return;

    const formRect = form.getBoundingClientRect();
    const relativeX = e.clientX - formRect.left;
    const relativeY = e.clientY - formRect.top;

    setCommentTarget(fieldName);
    setCommentPosition({ x: relativeX, y: relativeY });
    setIsShowCommentModal(true);
  }, []);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setIsShowCommentModal(false);
      }
    }

    if (isShowCommentModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShowCommentModal]);

  return (
    <form style={{ position: "relative" }} className="learning-journal-row in-class">
      <div className="learning-journal-cell">
        <input
          type="date"
          name="date"
          style={cellStyle}
          value={formData?.date ? formData.date.slice(0, 10) : ""}
          onChange={handleChange}
          readOnly={isReadOnly || isSubmited}
        />
      </div>
      <div className="learning-journal-cell">
        <select
          name="subject_id"
          value={formData.subject_id}
          style={selectStyle}
          onChange={handleChange}
          disabled={isReadOnly || isSubmited}
        >
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.subject_name}
            </option>
          ))}
        </select>
      </div>
      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="lesson"
          rows="3"
          style={cellStyle}
          value={formData.lesson}
          onChange={handleChange}
          readOnly={isReadOnly || isSubmited}
          onContextMenu={(e) => handleRightClick(e, 'lesson')}
        />
      </div>
      <div className="learning-journal-cell">
        <select
          name="self_assessment"
          value={formData.self_assessment}
          onChange={handleChange}
          style={selectStyle}
          disabled={isReadOnly || isSubmited}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="difficulties"
          rows="3"
          style={cellStyle}
          value={formData.difficulties}
          onChange={handleChange}
          readOnly={isReadOnly || isSubmited}
          onContextMenu={(e) => handleRightClick(e, 'difficulties')}
        />
      </div>
      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="plan"
          rows="3"
          style={cellStyle}
          value={formData.plan}
          onChange={handleChange}
          readOnly={isReadOnly || isSubmited}
          onContextMenu={(e) => handleRightClick(e, 'plan')}
        />
      </div>
      <div className="learning-journal-cell">
        <select
          name="is_problem_solved"
          value={formData.is_problem_solved}
          onChange={handleChange}
          style={selectStyle}
          disabled={isReadOnly || isSubmited}
        >
          <option value={1}>Yes</option>
          <option value={0}>No</option>
        </select>
      </div>

      {comments.map((comment) => (
        <div
          key={comment.id}
          className="comment-box-container"
          style={{
            visibility: isShowCommentBox ? 'visible' : 'hidden',
            position: 'absolute',
            left: `${comment.relative_x}px`,
            top: `${comment.relative_y}px`,
            zIndex: 10000
          }}>
          <CommentBox comment={comment} />
        </div>
      ))}

      {isShowCommentModal && (
        <div
          ref={commentRef}
          style={{
            position: 'absolute',
            left: `${commentPosition.x}px`,
            top: `${commentPosition.y}px`,
            zIndex: 10000
          }}>
          <StudentComment
            field={commentTarget}
            journalId={formData?.id}
            journalType="in_class"
            relativeX={commentPosition.x}
            relativeY={commentPosition.y}
            setIsShowCommentModal={setIsShowCommentModal}
            setComments={setComments}
          />
        </div>
      )}
    </form>
  );
}