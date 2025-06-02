import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  getInClassJournal,
  createInClassJournal,
  updateInClassJournal
} from "../../../services/InClassService";
import { getStudentById, getUser } from "../../../services/UserService";
import { getAllSubjects } from "../../../services/SubjectService";
import { toast } from "react-toastify";
import { useDebouncedSubmit } from "../../../components/hooks/useDebounceSubmit";
import "./InClass.css";
import { AddLearningJournalFormButton } from "../../../components/ui/Button/AddLearningJournalFormButton";
import { useParams } from "react-router-dom";
import { autoResize } from "../../../components/utils/TextAreaAutoResize";
import { StudentComment } from "../StudentComment/StudentComment";
import { getCommentByJournalId } from "../../../services/CommentService";
import CommentBox from "../StudentComment/CommentBox";

// Enhanced cache system with invalidation
const cache = {
  users: new Map(),
  subjects: new Map(),
  journals: new Map(),
  comments: new Map(),
  // Cache invalidation methods
  invalidateJournals: (userId, weekId) => {
    const key = `journal_${userId}_${weekId}`;
    cache.journals.delete(key);
  },
  invalidateComments: (journalId) => {
    const key = `comments_${journalId}_in_class`;
    cache.comments.delete(key);
  },
  // Clear all cache
  clearAll: () => {
    cache.users.clear();
    cache.subjects.clear();
    cache.journals.clear();
    cache.comments.clear();
  }
};

// Global event emitter for cache invalidation
const cacheEvents = {
  listeners: new Map(),
  on: (event, callback) => {
    if (!cacheEvents.listeners.has(event)) {
      cacheEvents.listeners.set(event, []);
    }
    cacheEvents.listeners.get(event).push(callback);
  },
  emit: (event, data) => {
    if (cacheEvents.listeners.has(event)) {
      cacheEvents.listeners.get(event).forEach(callback => callback(data));
    }
  },
  off: (event, callback) => {
    if (cacheEvents.listeners.has(event)) {
      const callbacks = cacheEvents.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
};

// Memoized constants
const ASSESSMENT_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" }
];

const PROBLEM_SOLVED_OPTIONS = [
  { value: 1, label: "Yes" },
  { value: 0, label: "No" }
];

// Saving indicator component
const SavingIndicator = React.memo(({ isSaving }) => {
  if (!isSaving) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '2px',
      right: '2px',
      background: '#4CAF50',
      color: 'white',
      padding: '2px 6px',
      borderRadius: '3px',
      fontSize: '10px',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        border: '1px solid white',
        borderTop: '1px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      Saving...
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

export function InClass({ weekId, isSubmited }) {
  const [subjects, setSubjects] = useState([]);
  const [inClassJournal, setInClassJournal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extraForms, setExtraForms] = useState([]);
  const [isShowCommentBox, setIsShowCommentBox] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { studentId } = useParams();
  const isReadOnly = useMemo(() => !!studentId, [studentId]);

  // Memoized styles
  const cellStyle = useMemo(() => ({
    width: "100%",
    outline: "none",
    height: "100%"
  }), []);

  const selectStyle = useMemo(() => ({
    width: "100%",
    outline: "none"
  }), []);

  // Callback để handle khi có form mới được tạo hoặc cập nhật
  const handleFormCreatedOrUpdated = useCallback((newJournal) => {
    setInClassJournal(prev => {
      // Nếu là cập nhật, thay thế journal cũ bằng journal mới
      if (newJournal.id) {
        const updatedJournals = prev.map(journal =>
          journal.id === newJournal.id ? newJournal : journal
        );
        // Nếu không tìm thấy id, thêm mới
        if (!updatedJournals.some(journal => journal.id === newJournal.id)) {
          return [...updatedJournals, newJournal];
        }
        return updatedJournals;
      }
      // Nếu là tạo mới, thêm vào danh sách
      return [...prev, newJournal];
    });
    // Xóa cache để lần sau load được data mới
    if (weekId) {
      const userCacheKey = studentId || 'current_user';
      cache.invalidateJournals(userCacheKey, weekId);
      // Không gọi setRefreshTrigger ngay để tránh load lại trong khi người dùng đang nhập
    }
  }, [weekId, studentId]);

  // Cache invalidation listener
  useEffect(() => {
    const handleCacheInvalidation = (data) => {
      if (data.weekId === weekId) {
        setRefreshTrigger(prev => prev + 1);
      }
    };

    cacheEvents.on('journalUpdated', handleCacheInvalidation);
    cacheEvents.on('journalCreated', handleCacheInvalidation);

    return () => {
      cacheEvents.off('journalUpdated', handleCacheInvalidation);
      cacheEvents.off('journalCreated', handleCacheInvalidation);
    };
  }, [weekId]);

  // Optimized data fetching with better cache management
  useEffect(() => {
    if (!weekId) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Cache keys
        const userCacheKey = studentId || 'current_user';
        const journalCacheKey = `journal_${userCacheKey}_${weekId}`;

        // Get user from cache or API
        let user;
        if (cache.users.has(userCacheKey)) {
          user = cache.users.get(userCacheKey);
        } else {
          const userRes = await (studentId ? getStudentById(studentId) : getUser());
          user = userRes.data;
          cache.users.set(userCacheKey, user);
        }

        if (!isMounted) return;

        const classroomId = user.student_classroom_id;
        const subjectsCacheKey = `subjects_${classroomId}`;

        // Parallel requests for subjects and journal
        const promises = [];

        // Subjects request with cache
        if (cache.subjects.has(subjectsCacheKey)) {
          promises.push(Promise.resolve({ data: cache.subjects.get(subjectsCacheKey) }));
        } else {
          promises.push(getAllSubjects(classroomId));
        }

        // Journal request - force refresh if needed
        if (refreshTrigger === 0 && cache.journals.has(journalCacheKey)) {
          promises.push(Promise.resolve({ data: cache.journals.get(journalCacheKey) }));
        } else {
          promises.push(getInClassJournal(user.id, weekId));
        }

        const [subjectRes, journalRes] = await Promise.all(promises);

        if (!isMounted) return;

        // Set subjects
        const subjectsData = subjectRes.data;
        if (!cache.subjects.has(subjectsCacheKey)) {
          cache.subjects.set(subjectsCacheKey, subjectsData);
        }
        setSubjects(subjectsData);

        // Set journal data
        const journalData = journalRes.data;
        cache.journals.set(journalCacheKey, journalData); // Always update cache
        setInClassJournal(journalData.length > 0 ? journalData : []);

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
  }, [weekId, studentId, refreshTrigger]);

  const handleAddForm = useCallback(() => {
    setExtraForms(prev => [...prev, { id: Date.now() }]);
  }, []);

  const toggleCommentBox = useCallback(() => {
    setIsShowCommentBox(prev => !prev);
  }, []);

  // Memoized renders
  const renderJournalForms = useMemo(() => {
    return inClassJournal.map((journal) => (
      <InClassForm
        key={journal.id}
        isShowCommentBox={isShowCommentBox}
        initialData={journal}
        subjects={subjects}
        cellStyle={cellStyle}
        selectStyle={selectStyle}
        isReadOnly={isReadOnly}
        isSubmited={isSubmited}
        weekId={weekId}
        onFormUpdated={handleFormCreatedOrUpdated}
      />
    ));
  }, [inClassJournal, isShowCommentBox, subjects, cellStyle, selectStyle, isReadOnly, isSubmited, weekId, handleFormCreatedOrUpdated]);

  const renderExtraForms = useMemo(() => {
    return extraForms.map((form) => (
      <EmptyInClassForm
        key={form.id}
        subjects={subjects}
        cellStyle={cellStyle}
        selectStyle={selectStyle}
        weekId={weekId}
        isReadOnly={isReadOnly}
        isSubmited={isSubmited}
        onFormCreated={(newJournal) => {
          handleFormCreatedOrUpdated(newJournal);
          setExtraForms(prev => prev.filter(f => f.id !== form.id));
        }}
      />
    ));
  }, [extraForms, subjects, cellStyle, selectStyle, weekId, isReadOnly, isSubmited, handleFormCreatedOrUpdated]);

  return (
    <div className="learning-journal-table-container">
      <div className="learning-journal-table">
        <HeaderRow />

        {/* Luôn hiển thị forms, kể cả khi đang loading */}
        {renderJournalForms}
        {!isReadOnly && renderExtraForms}
        {!isReadOnly && inClassJournal.length === 0 && extraForms.length === 0 && (
          <EmptyInClassForm
            subjects={subjects}
            cellStyle={cellStyle}
            selectStyle={selectStyle}
            weekId={weekId}
            isReadOnly={isReadOnly}
            isSubmited={isSubmited}
            onFormCreated={handleFormCreatedOrUpdated}
          />
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

// Memoized header component
const HeaderRow = React.memo(() => (
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
));

const EmptyInClassForm = React.memo(function EmptyInClassForm({
  subjects, cellStyle, selectStyle, weekId, isReadOnly, isSubmited, onFormCreated
}) {
  // Memoized initial form data
  const initialFormData = useMemo(() => ({
    id: null,
    date: null,
    subject_id: subjects?.[0]?.id || "",
    lesson: "",
    self_assessment: "1",
    difficulties: "",
    plan: "",
    is_problem_solved: 0,
    week_id: weekId,
  }), [subjects, weekId]);

  const [formData, setFormData] = useState(initialFormData);
  const [isNew, setIsNew] = useState(true);
  const [id, setId] = useState(null);
  const [isShowCommentModal, setIsShowCommentModal] = useState(false);
  const [commentTarget, setCommentTarget] = useState(null);
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);

  const triggerAutoSubmit = useDebouncedSubmit(handleAutoCreate, 500);
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
    setIsSaving(true);
    try {
      const response = await (isNew ? createInClassJournal(formData) : updateInClassJournal(id, formData));
      if (isNew) {
        const newId = response.data.inClassId;
        setId(newId);
        setIsNew(false);
        toast.success("New in-class journal created.");

        // Emit event for cache invalidation and notify parent
        if (onFormCreated) {
          onFormCreated({
            ...formData,
            id: newId
          });
        }
        cacheEvents.emit('journalCreated', { weekId, journalId: newId });
      } else {
        // Emit event for update and notify parent
        if (onFormCreated) {
          onFormCreated({
            ...formData,
            id
          });
        }
        cacheEvents.emit('journalUpdated', { weekId, journalId: id });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating in-class journal.");
    } finally {
      setIsSaving(false);
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
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isShowCommentModal]);

  // Memoized options
  const subjectOptions = useMemo(() =>
    subjects.map((subject) => (
      <option key={subject.id} value={subject.id}>
        {subject.subject_name}
      </option>
    )), [subjects]);

  const assessmentOptions = useMemo(() =>
    ASSESSMENT_OPTIONS.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )), []);

  const problemSolvedOptions = useMemo(() =>
    PROBLEM_SOLVED_OPTIONS.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )), []);

  return (
    <>
      <form className="learning-journal-row in-class" style={{ position: 'relative' }}>
        <SavingIndicator isSaving={isSaving} />

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
            {subjectOptions}
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
            {assessmentOptions}
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
            {problemSolvedOptions}
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
});

const InClassForm = React.memo(function InClassForm({
  initialData, subjects, cellStyle, selectStyle, isReadOnly, isSubmited, isShowCommentBox, weekId
}) {
  const [formData, setFormData] = useState(initialData);
  const [comments, setComments] = useState([]);
  const [isShowCommentModal, setIsShowCommentModal] = useState(false);
  const [commentTarget, setCommentTarget] = useState(null);
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);

  const triggerAutoSubmit = useDebouncedSubmit(handleAutoUpdate, 500);
  const commentRef = useRef(null);

  // Optimized comments fetching with cache invalidation
  useEffect(() => {
    if (!formData.id) return;

    let isMounted = true;
    const commentsCacheKey = `comments_${formData.id}_in_class`;

    async function fetchComments() {
      try {
        // Check cache first
        if (cache.comments.has(commentsCacheKey)) {
          if (isMounted) {
            setComments(cache.comments.get(commentsCacheKey));
          }
          return;
        }

        const response = await getCommentByJournalId(formData.id, "in_class");
        if (isMounted) {
          const commentsData = response.data;
          cache.comments.set(commentsCacheKey, commentsData);
          setComments(commentsData);
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
    setIsSaving(true);
    try {
      await updateInClassJournal(formData.id, formData);
      // Gọi callback khi cập nhật thành công
      cacheEvents.emit('journalUpdated', { weekId, journalId: formData.id });
    } catch (error) {
      console.error(error);
      toast.error("Update failed. Please wait and try again.");
    } finally {
      setIsSaving(false);
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

  const handleCommentUpdate = useCallback((newComments) => {
    setComments(newComments);
    // Update cache
    const commentsCacheKey = `comments_${formData.id}_in_class`;
    cache.comments.set(commentsCacheKey, newComments);
  }, [formData.id]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setIsShowCommentModal(false);
      }
    }

    if (isShowCommentModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isShowCommentModal]);

  // Memoized options
  const subjectOptions = useMemo(() =>
    subjects.map((subject) => (
      <option key={subject.id} value={subject.id}>
        {subject.subject_name}
      </option>
    )), [subjects]);

  const assessmentOptions = useMemo(() =>
    ASSESSMENT_OPTIONS.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )), []);

  const problemSolvedOptions = useMemo(() =>
    PROBLEM_SOLVED_OPTIONS.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )), []);

  // Memoized comment boxes
  const renderComments = useMemo(() =>
    comments.map((comment) => (
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
    )), [comments, isShowCommentBox]);

  return (
    <form style={{ position: "relative" }} className="learning-journal-row in-class">
      <SavingIndicator isSaving={isSaving} />

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
          {subjectOptions}
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
          {assessmentOptions}
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
          {problemSolvedOptions}
        </select>
      </div>

      {renderComments}

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
            setComments={handleCommentUpdate}
          />
        </div>
      )}
    </form>
  );
});