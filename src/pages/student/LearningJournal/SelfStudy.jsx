import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { getAllSubjects } from "../../../services/SubjectService";
import { getStudentById, getUser } from "../../../services/UserService";
import { createSelfStudyJournal, getWeeklySelfStudyJournalOfStudent, updateSelfStudyJournal } from "../../../services/SelfStudyService";
import { toast } from "react-toastify";
import { AddLearningJournalFormButton } from "../../../components/ui/Button/AddLearningJournalFormButton";
import { useParams } from "react-router-dom";
import { autoResize } from "../../../components/utils/TextAreaAutoResize";
import { useDebouncedSubmit } from "../../../components/hooks/useDebounceSubmit";
import "./SelfStudy.css";

// Cache với phương thức để invalidate
const cache = {
  subjects: new Map(),
  students: new Map(),
  selfStudies: new Map(),

  invalidateSelfStudies: (studentId, weekId) => {
    const key = `selfStudies_${studentId}_${weekId}`;
    cache.selfStudies.delete(key);
  },

  invalidateAll: () => {
    cache.subjects.clear();
    cache.students.clear();
    cache.selfStudies.clear();
  },

  // Thêm method để cập nhật cache
  updateSelfStudyCache: (studentId, weekId, studies) => {
    const key = `selfStudies_${studentId}_${weekId}`;
    cache.selfStudies.set(key, studies);
  }
};

export function SelfStudy({ weekId, isSubmited }) {
  const [subjects, setSubjects] = useState([]);
  const [selfStudies, setSelfStudies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [extraForms, setExtraForms] = useState([]);
  const { studentId } = useParams();
  const isReadOnly = !!studentId;
  const [isShowCommentBox, setIsShowCommentBox] = useState(true);
  const [currentStudentId, setCurrentStudentId] = useState(null);

  const cellStyle = useMemo(() => ({
    width: "100%",
    outline: "none",
    height: "100%"
  }), []);

  const selectStyle = useMemo(() => ({
    width: "100%",
    outline: "none"
  }), []);

  // Callback để cập nhật selfStudies và cache ngay lập tức
  const handleFormCreatedOrUpdated = useCallback((newStudy) => {
    setSelfStudies(prev => {
      let updatedStudies;
      if (newStudy.id) {
        // Cập nhật existing study
        const existingIndex = prev.findIndex(study => study.id === newStudy.id);
        if (existingIndex !== -1) {
          updatedStudies = prev.map(study =>
            study.id === newStudy.id ? newStudy : study
          );
        } else {
          // Thêm mới nếu không tìm thấy
          updatedStudies = [...prev, newStudy];
        }
      } else {
        // Thêm study mới
        updatedStudies = [...prev, newStudy];
      }

      // Cập nhật cache ngay lập tức
      if (weekId && currentStudentId) {
        cache.updateSelfStudyCache(currentStudentId, weekId, updatedStudies);
      }

      return updatedStudies;
    });
  }, [weekId, currentStudentId]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const studentCacheKey = studentId || 'current_user';
        let student;
        if (cache.students.has(studentCacheKey)) {
          student = cache.students.get(studentCacheKey);
        } else {
          const studentResponse = await (studentId ? getStudentById(studentId) : getUser());
          student = studentResponse.data;
          cache.students.set(studentCacheKey, student);
        }

        setCurrentStudentId(student.id);
        const classroomId = student.student_classroom_id;

        const promises = [];
        const subjectsCacheKey = `subjects_${classroomId}`;
        if (cache.subjects.has(subjectsCacheKey)) {
          promises.push(Promise.resolve({ data: cache.subjects.get(subjectsCacheKey) }));
        } else {
          promises.push(getAllSubjects(classroomId));
        }

        if (weekId) {
          const selfStudiesCacheKey = `selfStudies_${student.id}_${weekId}`;
          if (cache.selfStudies.has(selfStudiesCacheKey)) {
            promises.push(Promise.resolve({ data: cache.selfStudies.get(selfStudiesCacheKey) }));
          } else {
            promises.push(getWeeklySelfStudyJournalOfStudent(student.id, weekId));
          }
        }

        const results = await Promise.all(promises);

        // Set subjects
        const subjectsData = results[0].data;
        cache.subjects.set(subjectsCacheKey, subjectsData);
        setSubjects(subjectsData);

        // Set self studies nếu có
        if (weekId && results[1]) {
          const selfStudiesData = results[1].data;
          const selfStudiesCacheKey = `selfStudies_${student.id}_${weekId}`;
          cache.selfStudies.set(selfStudiesCacheKey, selfStudiesData);
          setSelfStudies(selfStudiesData);
        }
      } catch (error) {
        toast.error("Failed to load data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [weekId, studentId]);

  const handleAddForm = useCallback(() => {
    setExtraForms((prev) => [...prev, { id: Date.now() }]);
  }, []);

  const toggleCommentBox = useCallback(() => {
    setIsShowCommentBox(prev => !prev);
  }, []);

  const renderSelfStudyForms = useMemo(() => {
    return selfStudies.map((study) => (
      <div className="journal-form-container" key={study.id}>
        <SelfStudyForm
          subjects={subjects}
          study={study}
          cellStyle={cellStyle}
          selectStyle={selectStyle}
          readOnly={isReadOnly}
          isSubmited={isSubmited}
          onFormUpdated={handleFormCreatedOrUpdated}
        />
      </div>
    ));
  }, [selfStudies, subjects, cellStyle, selectStyle, isReadOnly, isSubmited, handleFormCreatedOrUpdated]);

  const renderExtraForms = useMemo(() => {
    return extraForms.map((form) => (
      <div className="journal-form-container" key={form.id}>
        <EmptyForm
          weekId={weekId}
          subjects={subjects}
          cellStyle={cellStyle}
          selectStyle={selectStyle}
          isSubmited={isSubmited}
          onFormCreated={handleFormCreatedOrUpdated}
          studentId={currentStudentId}
        />
      </div>
    ));
  }, [extraForms, weekId, subjects, cellStyle, selectStyle, isSubmited, handleFormCreatedOrUpdated, currentStudentId]);

  return (
    <div className="learning-journal-table-container self-study">
      <div className="learning-journal-table">
        <TableHeader />
        {renderSelfStudyForms}
        {!isReadOnly && renderExtraForms}
        {!isReadOnly && selfStudies.length === 0 && extraForms.length === 0 && (
          <div>
            <EmptyForm
              weekId={weekId}
              subjects={subjects}
              cellStyle={cellStyle}
              selectStyle={selectStyle}
              isSubmited={isSubmited}
              onFormCreated={handleFormCreatedOrUpdated}
              studentId={currentStudentId}
            />
          </div>
        )}

        {loading && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#28a745',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '3px',
            fontSize: '12px',
            zIndex: 1000
          }}>
            Loading ...
          </div>

        )}
      </div>

      {!isReadOnly && (
        <div className="add-form-button-places d-flex justify-content-between">
          <div style={{ cursor: "pointer" }} onClick={toggleCommentBox}>
            <div style={{ padding: "3px 6px", backgroundColor: "#FE9C3B", color: "white" }}>
              {isShowCommentBox ? <i className="fa-solid fa-comment"></i> : <i className="fa-solid fa-comment-slash"></i>}
            </div>
          </div>
          <AddLearningJournalFormButton onClick={handleAddForm} />
        </div>
      )}
    </div>
  );
}

const TableHeader = React.memo(() => (
  <div className="learning-journal-row header-row">
    <div className="learning-journal-cell header frozen">Date</div>
    <div className="learning-journal-cell header frozen">Skills/Module</div>
    <div className="learning-journal-cell header scrollable">My lesson - What did I learn today?</div>
    <div className="learning-journal-cell header scrollable">Time allocation</div>
    <div className="learning-journal-cell header scrollable">Learning resources</div>
    <div className="learning-journal-cell header scrollable">Learning activities</div>
    <div className="learning-journal-cell header scrollable">Concentration</div>
    <div className="learning-journal-cell header scrollable">Plan & follow plan</div>
    <div className="learning-journal-cell header scrollable">Evaluation of my work</div>
    <div className="learning-journal-cell header scrollable">Reinforcing learning</div>
    <div className="learning-journal-cell header scrollable">Notes</div>
  </div>
));

export const EmptyForm = React.memo(function EmptyForm({
  subjects,
  cellStyle,
  selectStyle,
  weekId,
  readOnly = false,
  isSubmited,
  onFormCreated,
  studentId
}) {
  const [isNew, setIsNew] = useState(true);
  const [id, setId] = useState(null);
  const [isUserUpdate, setIsUserUpdate] = useState(false);
  // Removed isSaving state

  const initialFormData = useMemo(() => ({
    id: null,
    student_id: studentId,
    subject_id: subjects?.length > 0 ? subjects[0].id : "",
    week_id: weekId,
    date: "",
    lesson: "",
    time_allocation: "",
    learning_resources: "",
    learning_activities: "",
    concentration: "",
    is_follow_plan: 0,
    evaluation: "",
    reinforcing_learning: "",
    notes: ""
  }), [subjects, weekId, studentId]);

  const [formData, setFormData] = useState(initialFormData);
  const triggerAutoSubmit = useDebouncedSubmit(handleAutoCreate, 1000); // Tăng debounce time

  // Update formData khi subjects thay đổi
  useEffect(() => {
    if (subjects?.length > 0 && !formData.subject_id) {
      setFormData(prev => ({
        ...prev,
        subject_id: subjects[0].id,
        student_id: studentId
      }));
    }
  }, [subjects, formData.subject_id, studentId]);

  useEffect(() => {
    if (isUserUpdate && !readOnly && !isSubmited) {
      triggerAutoSubmit();
    }
  }, [formData, isUserUpdate, readOnly, isSubmited, triggerAutoSubmit]);

  const handleOnChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setIsUserUpdate(true);
  }, []);

  const handlePlanChange = useCallback((e) => {
    const isFollowPlan = e.target.value === "true";
    setFormData((prev) => ({
      ...prev,
      is_follow_plan: isFollowPlan
    }));
    setIsUserUpdate(true);
  }, []);

  async function handleAutoCreate() {
    try {
      if (!formData.date || !formData.subject_id) {
        return;
      }

      const dataToSave = {
        ...formData,
        student_id: studentId
      };

      const response = await (isNew ? createSelfStudyJournal(dataToSave) : updateSelfStudyJournal(id, dataToSave));

      if (isNew) {
        const newId = response.data.selfStudyId;
        setId(newId);
        setIsNew(false);

        const newStudy = {
          ...dataToSave,
          id: newId
        };

        if (onFormCreated) {
          onFormCreated(newStudy);
        }
        toast.success("New learning journal created.");
      } else {
        const updatedStudy = {
          ...dataToSave,
          id
        };

        if (onFormCreated) {
          onFormCreated(updatedStudy);
        }
      }
    } catch (error) {
      toast.error("Please try again, some error occurred!");
      console.error("Error saving journal:", error);
    } finally {
      setIsUserUpdate(false);
    }
  }

  const textAreaFields = useMemo(() =>
    ["lesson", "time_allocation", "learning_resources", "learning_activities"], []);

  const evaluationFields = useMemo(() =>
    ["evaluation", "reinforcing_learning", "notes"], []);

  return (
    <form className="learning-journal-row">
      <div className="learning-journal-cell frozen input-date">
        <input
          type="date"
          name="date"
          style={cellStyle}
          value={formData.date}
          onChange={handleOnChange}
          readOnly={readOnly || isSubmited}
        />
      </div>

      <div className="learning-journal-cell frozen">
        <select
          name="subject_id"
          value={formData.subject_id}
          style={selectStyle}
          onChange={handleOnChange}
          disabled={readOnly || isSubmited}
        >
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.subject_name}
            </option>
          ))}
        </select>
      </div>

      {textAreaFields.map((field) => (
        <div key={field} className="learning-journal-cell scrollable">
          <textarea
            onInput={(e) => autoResize(e)}
            name={field}
            rows="3"
            style={cellStyle}
            value={formData[field]}
            onChange={handleOnChange}
            readOnly={readOnly || isSubmited}
          />
        </div>
      ))}

      <div className="learning-journal-cell scrollable">
        <select
          name="concentration"
          value={formData.concentration}
          style={selectStyle}
          onChange={handleOnChange}
          disabled={readOnly || isSubmited}
        >
          <option value="1">Not sure</option>
          <option value="0">No</option>
          <option value="2">Yes</option>
        </select>
      </div>

      <div className="learning-journal-cell scrollable">
        <select
          name="is_follow_plan"
          value={formData.is_follow_plan ? "true" : "false"}
          style={selectStyle}
          onChange={handlePlanChange}
          disabled={readOnly || isSubmited}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      {evaluationFields.map((field) => (
        <div key={field} className="learning-journal-cell scrollable">
          <textarea
            onInput={(e) => autoResize(e)}
            name={field}
            rows="3"
            style={cellStyle}
            value={formData[field]}
            onChange={handleOnChange}
            readOnly={readOnly || isSubmited}
          />
        </div>
      ))}
    </form>
  );
});

export const SelfStudyForm = React.memo(function SelfStudyForm({
  subjects,
  study,
  cellStyle,
  selectStyle,
  readOnly = false,
  isSubmited,
  onFormUpdated
}) {
  const [formData, setFormData] = useState(study);
  const [isUserUpdate, setIsUserUpdate] = useState(false);
  // Removed isSaving state
  const triggerAutoSubmit = useDebouncedSubmit(handleAutoUpdate, 1000); // Tăng debounce time

  useEffect(() => {
    setFormData(study); // Đồng bộ formData với study
  }, [study]);

  useEffect(() => {
    if (isUserUpdate && !readOnly && !isSubmited) {
      triggerAutoSubmit();
    }
  }, [formData, isUserUpdate, readOnly, isSubmited, triggerAutoSubmit]);

  const handleOnChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setIsUserUpdate(true);
  }, []);

  const handlePlanChange = useCallback((e) => {
    const isFollowPlan = e.target.value === "true";
    setFormData((prev) => ({
      ...prev,
      is_follow_plan: isFollowPlan
    }));
    setIsUserUpdate(true);
  }, []);

  async function handleAutoUpdate() {
    try {
      if (!formData.date || !formData.subject_id) {
        return;
      }

      await updateSelfStudyJournal(formData.id, formData);
      if (onFormUpdated) {
        onFormUpdated(formData);
      }
    } catch (error) {
      toast.error("Update failed, please try again!");
      console.error("Error updating journal:", error);
    } finally {
      setIsUserUpdate(false);
    }
  }

  const textAreaFields = useMemo(() =>
    ["lesson", "time_allocation", "learning_resources", "learning_activities"], []);

  const evaluationFields = useMemo(() =>
    ["evaluation", "reinforcing_learning", "notes"], []);

  return (
    <form className="learning-journal-row">
      <div className="learning-journal-cell frozen">
        <input
          type="date"
          name="date"
          style={cellStyle}
          value={formData.date ? formData.date.slice(0, 10) : ""}
          onChange={handleOnChange}
          readOnly={readOnly || isSubmited}
        />
      </div>

      <div className="learning-journal-cell frozen">
        <select
          name="subject_id"
          value={formData.subject_id}
          style={selectStyle}
          onChange={handleOnChange}
          disabled={readOnly || isSubmited}
        >
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.subject_name}
            </option>
          ))}
        </select>
      </div>

      {textAreaFields.map((field) => (
        <div key={field} className="learning-journal-cell scrollable">
          <textarea
            onInput={(e) => autoResize(e)}
            name={field}
            rows="3"
            style={cellStyle}
            value={formData[field]}
            onChange={handleOnChange}
            readOnly={readOnly || isSubmited}
          />
        </div>
      ))}

      <div className="learning-journal-cell scrollable">
        <select
          name="concentration"
          value={formData.concentration}
          style={selectStyle}
          onChange={handleOnChange}
          disabled={readOnly || isSubmited}
        >
          <option value="1">Not sure</option>
          <option value="0">No</option>
          <option value="2">Yes</option>
        </select>
      </div>

      <div className="learning-journal-cell scrollable">
        <select
          name="is_follow_plan"
          value={formData.is_follow_plan ? "true" : "false"}
          style={selectStyle}
          onChange={handlePlanChange}
          disabled={readOnly || isSubmited}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      {evaluationFields.map((field) => (
        <div key={field} className="learning-journal-cell scrollable">
          <textarea
            onInput={(e) => autoResize(e)}
            name={field}
            rows="3"
            style={cellStyle}
            value={formData[field]}
            onChange={handleOnChange}
            readOnly={readOnly || isSubmited}
          />
        </div>
      ))}
    </form>
  );
});