import { useEffect, useState } from "react";
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

export function InClass({ weekId }) {
  const [subjects, setSubjects] = useState([]);
  const [inClassJournal, setInClassJournal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extraForms, setExtraForms] = useState([]);
  const {studentId} = useParams();
  const isReadOnly = !!studentId;

  const cellStyle = { width: "100%", outline: "none", height: "100%" };
  const selectStyle = { width: "100%", outline: "none" };

  useEffect(() => {
    console.log(weekId);
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = (await (studentId ? getStudentById(studentId) : getUser())).data;
        const classroomId = user.student_classroom_id;

        const subjectRes = await getAllSubjects(classroomId);
        setSubjects(subjectRes.data);
        if (weekId) {
          const journalRes = await getInClassJournal(user.id, weekId);
          const data = journalRes.data;
          setInClassJournal(data.length > 0 ? data : []);
        }
      } catch (error) {
        toast.error("Fail to load data.")
        console.log(error);
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
        <div className="learning-journal-row in-class header-row">
          <div className="learning-journal-cell header">Date</div>
          <div className="learning-journal-cell header">Skill/Module</div>
          <div className="learning-journal-cell header">
            My lesson <br /> What did I learn today?
          </div>
          <div className="learning-journal-cell header">
            Self-assessment
            <br />
            1: I need more practice <br />
            2: I sometimes find this difficult <br />
            3: No problem!
          </div>
          <div className="learning-journal-cell header">My difficulties</div>
          <div className="learning-journal-cell header">My plan</div>
          <div className="learning-journal-cell header">Problem solved</div>
        </div>

        {loading ? (
          <LoadingData content="Loading ..." />
        ) : (
          <>
            {
              inClassJournal.map((journal) => (
                <InClassForm
                  key={journal.id}
                  initialData={journal}
                  subjects={subjects}
                  cellStyle={cellStyle}
                  selectStyle={selectStyle}
                  isReadOnly={isReadOnly}
                />
              ))
            }

            {
              extraForms.map((form) => (
                <EmptyInClassForm
                  key={form.id}
                  subjects={subjects}
                  cellStyle={cellStyle}
                  selectStyle={selectStyle}
                  weekId={weekId}
                  isReadOnly={isReadOnly}
                />
              ))
            }

            {inClassJournal.length === 0 && (
              <EmptyInClassForm
                subjects={subjects}
                cellStyle={cellStyle}
                selectStyle={selectStyle}
                weekId={weekId}
                isReadOnly={isReadOnly}
              />
            )}
          </>
        )}
      </div>
      <div className="add-form-button-places" >{!isReadOnly && <AddLearningJournalFormButton onClick={handleAddForm} />}</div>
    </div>
  );
}

function EmptyInClassForm({ subjects, cellStyle, selectStyle, weekId, isReadOnly }) {
  const [isUserUpdate, setIsUserUpdate] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    date: null,
    subject_id: subjects?.[0]?.id || "",
    lesson: "",
    self_assessment: "1",
    difficulties: "",
    plan: "",
    is_problem_solved: 0,
    week_id: weekId,
  });

  const [isNew, setIsNew] = useState(true);
  const [id, setId] = useState(null);

  const triggerAutoSubmit = useDebouncedSubmit(handleAutoCreate, 1500);

  useUpdateEffect(() => {
    if (isUserUpdate) {
      triggerAutoSubmit();
      setIsUserUpdate(false);
    }
  }, [formData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "is_problem_solved" ? parseInt(value) : value,
    }));
    setIsUserUpdate(true)
  }

  async function handleAutoCreate() {
    try {
      const response = await (isNew ? createInClassJournal(formData) : updateInClassJournal(id, formData));
      if (isNew) {
        const newId = response.data.inClassId;
        setId(newId);
        setIsNew(false);
        toast.success("New in-class journal created.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating in-class journal.");
    }
  }

  return (
    <form className="learning-journal-row in-class">
      <div className="learning-journal-cell">
        <input
          type="date"
          name="date"
          style={cellStyle}
          value={formData.date}
          onChange={handleChange}
          readOnly={isReadOnly}
        />
      </div>
      <div className="learning-journal-cell">
        <select
          name="subject_id"
          value={formData.subject_id}
          style={selectStyle}
          onChange={handleChange}
          disabled={isReadOnly}
        >
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.subject_name}
            </option>
          ))}
        </select>
      </div>
      <div className="learning-journal-cell">
        <textarea onInput={(e) => autoResize(e)}
          name="lesson"
          rows="3"
          style={cellStyle}
          value={formData.lesson}
          onChange={handleChange}
          readOnly={isReadOnly}
        />
      </div>
      <div className="learning-journal-cell">
        <select
          name="self_assessment"
          value={formData.self_assessment}
          onChange={handleChange}
          style={selectStyle}
          disabled={isReadOnly}
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
          readOnly={isReadOnly}
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
          readOnly={isReadOnly}
        />
      </div>
      <div className="learning-journal-cell">
        <select
          name="is_problem_solved"
          value={formData.is_problem_solved}
          onChange={handleChange}
          style={selectStyle}
          disabled={isReadOnly}
        >
          <option value={1}>Yes</option>
          <option value={0}>No</option>
        </select>
      </div>
    </form>
  );
}


function InClassForm({ initialData, subjects, cellStyle, selectStyle, isReadOnly }) {
  const [formData, setFormData] = useState(initialData);
  const triggerAutoSubmit = useDebouncedSubmit(handleAutoUpdate, 1500);
  const [isUserUpdate, setIsUserUpdate] = useState(false);

  useUpdateEffect(
    () => {
      if (isUserUpdate) {
        triggerAutoSubmit();
        setIsUserUpdate(false);
      }
    }, [formData]
  )

  function handleChange(e) {
    setIsUserUpdate(true);
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "is_problem_solved" ? parseInt(value) : value,
    }));
  }

  async function handleAutoUpdate() {
    try {
      await updateInClassJournal(formData.id, formData);
    } catch (error) {
      console.error(error);
      toast.error("Update failed. Please wait and try again.");
    }
  }

  return (
    <form className="learning-journal-row in-class">
      <div className="learning-journal-cell">
        <input
          type="date"
          name="date"
          style={cellStyle}
          value={formData?.date ? formData.date.slice(0, 10) : ""}
          onChange={handleChange}
          readOnly={isReadOnly}
        />
      </div>
      <div className="learning-journal-cell">
        <select
          name="subject_id"
          value={formData.subject_id}
          style={selectStyle}
          onChange={handleChange}
          disabled={isReadOnly}
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
          readOnly={isReadOnly}
        />
      </div>
      <div className="learning-journal-cell">
        <select
          name="self_assessment"
          value={formData.self_assessment}
          onChange={handleChange}
          style={selectStyle}
          disabled={isReadOnly}
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
          readOnly={isReadOnly}
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
          readOnly={isReadOnly}
        />
      </div>
      <div className="learning-journal-cell">
        <select
          name="is_problem_solved"
          value={formData.is_problem_solved}
          onChange={handleChange}
          style={selectStyle}
          disabled={isReadOnly}
        >
          <option value={1}>Yes</option>
          <option value={0}>No</option>
        </select>
      </div>
    </form>
  );
}
