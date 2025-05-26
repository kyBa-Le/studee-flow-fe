import { useEffect, useState, useRef } from "react";
import { getAllSubjects } from "../../../services/SubjectService";
import { getStudentById, getUser } from "../../../services/UserService";
import { createSelfStudyJournal, getWeeklySelfStudyJournalOfStudent, updateSelfStudyJournal } from "../../../services/SelfStudyService";
import { LoadingData } from "../../../components/ui/Loading/LoadingData";
import { useDebouncedSubmit } from "../../../components/hooks/useDebounceSubmit";
import { toast } from "react-toastify";
import { AddLearningJournalFormButton } from "../../../components/ui/Button/AddLearningJournalFormButton";
import { useParams } from "react-router-dom";
import { autoResize } from "../../../components/utils/TextAreaAutoResize";

export function SelfStudy({ weekId }) {
  const [subjects, setSubjects] = useState([]);
  const [selfStudies, setSelfStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extraForms, setExtraForms] = useState([]);
  const cellStyle = { width: "100%", outline: "none", height: "100%" };
  const selectStyle = { width: "100%", outline: "none" };
  const { studentId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const student = (await (studentId ? getStudentById(studentId) : getUser())).data;
        const classroomId = student.student_classroom_id;

        const subjectsResponse = await getAllSubjects(classroomId);
        setSubjects(subjectsResponse.data);

        if (weekId) {
          const selfStudies = await getWeeklySelfStudyJournalOfStudent(student.id, weekId);
          setSelfStudies(selfStudies.data);
        }
      } catch (error) {
        toast.error("Fail to load data")
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [weekId]);

  const handleAddForm = () => {
    setExtraForms((prev) => [...prev, { id: Date.now() }]);
  }

  return (
    <div className="learning-journal-table-container">
      <div className="learning-journal-table">
        {/* Header */}
        <div className="learning-journal-row header-row">
          <div className="learning-journal-cell header">Date</div>
          <div className="learning-journal-cell header">Skills/Module</div>
          <div className="learning-journal-cell header">
            My lesson - What did I learn today?
          </div>
          <div className="learning-journal-cell header">Time allocation</div>
          <div className="learning-journal-cell header">Learning resources</div>
          <div className="learning-journal-cell header">
            Learning activities
          </div>
          <div className="learning-journal-cell header">Concentration</div>
          <div className="learning-journal-cell header">Plan & follow plan</div>
          <div className="learning-journal-cell header">
            Evaluation of my work
          </div>
          <div className="learning-journal-cell header">
            Reinforcing learning
          </div>
          <div className="learning-journal-cell header">Notes</div>
        </div>

        {loading ? (
          <LoadingData content="Loading ..." />
        ) : (
          <>
            {selfStudies.map((study, index) => (
              <div className="journal-form-container" key={index}>
                <SelfStudyForm
                  subjects={subjects}
                  study={study}
                  cellStyle={cellStyle}
                  selectStyle={selectStyle}
                />
              </div>
            ))}

            {extraForms.map((form) => (
              <div className="journal-form-container" key={form.id}>
                <EmptyForm
                  weekId={weekId}
                  subjects={subjects}
                  cellStyle={cellStyle}
                  selectStyle={selectStyle}
                />
              </div>
            ))}

            {selfStudies.length === 0 && extraForms.length === 0 && (
              <div>
                <EmptyForm
                  weekId={weekId}
                  subjects={subjects}
                  cellStyle={cellStyle}
                  selectStyle={selectStyle}
                />
              </div>
            )}
          </>
        )}
      </div>
      <div className="add-form-button-places" ><AddLearningJournalFormButton onClick={handleAddForm} /></div>
    </div>
  );
}

export function EmptyForm({ subjects, cellStyle, selectStyle, weekId }) {
  const [isNew, setIsNew] = useState(true)
  const [id, setId] = useState(null);
  const [isUserUpdate, setIsUserUpdate] = useState(false);
  const initialFormData = {
    id: null,
    student_id: null,
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
  };

  const [formData, setFormData] = useState(initialFormData);
  const triggerAutoSubmit = useDebouncedSubmit(handleAutoCreate, 1500);


  useEffect(() => {
    if (isUserUpdate) {
      triggerAutoSubmit();
      setIsUserUpdate(false);
    }
  }, [formData]);

  function handleOnChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setIsUserUpdate(true);
  }

  function handlePlanChange(e) {
    const isFollowPlan = e.target.value === "true";

    setFormData((prev) => ({
      ...prev,
      is_follow_plan: isFollowPlan
    }));
    setIsUserUpdate(true);
  }


  async function handleAutoCreate() {
    try {
      const response = await (isNew ? createSelfStudyJournal(formData) : updateSelfStudyJournal(id, formData));
      if (isNew) {
        setIsNew(false);
        const newId = response.data.selfStudyId;
        setId(newId);
        toast.success("New learning journal created.")
      }
    } catch (error) {
      toast.error("Please enter journal again, some error appeared!");
    }

  }


  return (
    <form className="learning-journal-row" >
      <div className="learning-journal-cell input-date">
        <input
          type="date"
          name="date"
          style={cellStyle}
          value={formData.date}
          onChange={handleOnChange}
        />
      </div>

      <div className="learning-journal-cell">
        <select
          name="subject_id"
          value={formData.subject_id}
          style={selectStyle}
          onChange={handleOnChange}
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
          onChange={handleOnChange}
        />
      </div>

      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="time_allocation"
          rows="3"
          style={cellStyle}
          value={formData.time_allocation}
          onChange={handleOnChange}
        />
      </div>

      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="learning_resources"
          rows="3"
          style={cellStyle}
          value={formData.learning_resources}
          onChange={handleOnChange}
        />
      </div>

      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="learning_activities"
          rows="3"
          style={cellStyle}
          value={formData.learning_activities}
          onChange={handleOnChange}
        />
      </div>

      <div className="learning-journal-cell">
        <select
          name="concentration"
          value={formData.concentration}
          style={selectStyle}
          onChange={handleOnChange}
        >
          <option value="1">Not sure</option>
          <option value="0">No</option>
          <option value="2">Yes</option>
        </select>
      </div>

      <div className="learning-journal-cell">
        <select
          name="is_follow_plan"
          value={formData.is_follow_plan ? "true" : "false"}
          style={selectStyle}
          onChange={handlePlanChange}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="evaluation"
          rows="3"
          style={cellStyle}
          value={formData.evaluation}
          onChange={handleOnChange}
        />
      </div>

      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="reinforcing_learning"
          rows="3"
          style={cellStyle}
          value={formData.reinforcing_learning}
          onChange={handleOnChange}
        />
      </div>

      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="notes"
          rows="3"
          style={cellStyle}
          value={formData.notes}
          onChange={handleOnChange}
        />
      </div>
    </form>

  );
}

export function SelfStudyForm({ subjects, study, cellStyle, selectStyle }) {
  const [formData, setFormData] = useState(study);
  const debounceTimer = useRef(null);
  const [isUserUpdate, setIsUserUpdate] = useState(false);

  // Debounced submit logic
  const triggerAutoSubmit = useDebouncedSubmit(handleAutoUpdate)


  // Auto submit after formData changed
  useEffect(() => {
    if (isUserUpdate) {
      triggerAutoSubmit();
      setIsUserUpdate(false);
    }
  }, [formData]);

  function handleOnChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsUserUpdate(true);
  }

  function handlePlanChange(e) {
    const isFollowPlan = e.target.value === "true";

    setFormData((prev) => ({
      ...prev,
      is_follow_plan: isFollowPlan,
    }));
    setIsUserUpdate(true);
  }


  async function handleAutoUpdate() {
    const response = await updateSelfStudyJournal(formData.id, formData);
  }

  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);

  return (
    <form className="learning-journal-row" key={study.id}>
      <div className="learning-journal-cell">
        <input
          type="date"
          name="date"
          style={cellStyle}
          value={formData.date ? formData.date.slice(0, 10) : ""}
          onChange={handleOnChange}
        />
      </div>

      <div className="learning-journal-cell">
        <select
          name="subject_id"
          value={formData.subject_id}
          style={selectStyle}
          onChange={handleOnChange}
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
          onChange={handleOnChange}
        />
      </div>

      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="time_allocation"
          rows="3"
          style={cellStyle}
          value={formData.time_allocation}
          onChange={handleOnChange}
        />
      </div>

      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="learning_resources"
          rows="3"
          style={cellStyle}
          value={formData.learning_resources}
          onChange={handleOnChange}
        />
      </div>

      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="learning_activities"
          rows="3"
          style={cellStyle}
          value={formData.learning_activities}
          onChange={handleOnChange}
        />
      </div>

      <div className="learning-journal-cell">
        <select
          name="concentration"
          value={formData.concentration}
          style={selectStyle}
          onChange={handleOnChange}
        >
          <option value="1">Not sure</option>
          <option value="0">No</option>
          <option value="2">Yes</option>
        </select>
      </div>

      <div className="learning-journal-cell">
        <select
          name="is_follow_plan"
          value={formData.is_follow_plan ? "true" : "false"}
          style={selectStyle}
          onChange={handlePlanChange}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="evaluation"
          rows="3"
          style={cellStyle}
          value={formData.evaluation}
          onChange={handleOnChange}
        />
      </div>

      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="reinforcing_learning"
          rows="3"
          style={cellStyle}
          value={formData.reinforcing_learning}
          onChange={handleOnChange}
        />
      </div>

      <div className="learning-journal-cell">
        <textarea
          onInput={(e) => autoResize(e)}
          name="notes"
          rows="3"
          style={cellStyle}
          value={formData.notes}
          onChange={handleOnChange}
        />
      </div>
    </form>
  );
}
