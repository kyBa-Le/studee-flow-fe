import { useState } from "react"
import { addMonths, format, parseISO } from "date-fns"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./CreateClassroomForm.css"

export function CreateClassroomForm({
  handleShowCreateForm,
  handleCreate,
  handleUpdate,
  editData = null,
}) {
  const [className, setClassName] = useState(editData?.class_name || "")
  const [totalSemesters, setTotalSemesters] = useState(editData?.semesters?.length || 0)

  const [semesterDuration, setSemesterDuration] = useState(() => {
    if (
      editData?.semesters?.length > 0 &&
      editData.semesters[0].start_date &&
      editData.semesters[0].end_date
    ) {
      return Math.round(
        (parseISO(editData.semesters[0].end_date) - parseISO(editData.semesters[0].start_date)) /
          (1000 * 60 * 60 * 24 * 30)
      )
    }
    return 1
  })

  const [startDate, setStartDate] = useState(editData?.semesters?.[0]?.start_date || "")
  const [semesters, setSemesters] = useState(
    editData?.semesters?.map((sem) => ({
      name: sem.semester_name,
      start: sem.start_date,
      end: sem.end_date,
      isEditing: false,
    })) || []
  )

  const [isCreating, setIsCreating] = useState(false)

  const generateSemesters = () => {
    if (!className?.trim()) {
      toast.error("Please enter the classroom name before generating semesters.")
      return
    }

    if (!startDate) {
      toast.error("Please select a start date before generating semesters.")
      return
    }

    if (!totalSemesters || totalSemesters <= 0) {
      toast.error("Total semesters must be greater than 0.")
      return
    }

    if (!semesterDuration || semesterDuration <= 0) {
      toast.error("Semester duration must be greater than 0.")
      return
    }

    const newSemesters = []
    let currentStart = parseISO(startDate)

    for (let i = 0; i < totalSemesters; i++) {
      const end = addMonths(currentStart, semesterDuration)
      newSemesters.push({
        name: `Semester ${i + 1}`,
        start: format(currentStart, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
        isEditing: false,
      })
      currentStart = end
    }

    setSemesters(newSemesters)
    toast.success("Semesters generated successfully!")
  }

  const toggleEdit = (index) => {
    const updated = [...semesters]
    updated[index].isEditing = !updated[index].isEditing
    setSemesters(updated)
  }

  const handleChangeDate = (index, field, value) => {
    const updated = [...semesters]
    if (field === "start") {
      updated[index].start = value
      let newStart = parseISO(value)
      for (let i = index; i < updated.length; i++) {
        const newEnd = addMonths(newStart, semesterDuration)
        updated[i].start = format(newStart, "yyyy-MM-dd")
        updated[i].end = format(newEnd, "yyyy-MM-dd")
        newStart = newEnd
      }
    } else if (field === "end") {
      updated[index].end = value
      let nextStart = parseISO(value)
      for (let i = index + 1; i < updated.length; i++) {
        updated[i].start = format(nextStart, "yyyy-MM-dd")
        const nextEnd = addMonths(nextStart, semesterDuration)
        updated[i].end = format(nextEnd, "yyyy-MM-dd")
        nextStart = nextEnd
      }
    }
    setSemesters(updated)
  }

  const deleteSemester = (index) => {
    const updated = semesters.filter((_, i) => i !== index)
    setSemesters(updated)
    toast.info("Semester deleted.")
  }

  const handleSubmit = async () => {
    if (semesters.length === 0) {
      toast.error("Please generate semesters before submitting.")
      return
    }

    setIsCreating(true)

    const newFormData = {
      classroom: {
        class_name: className,
      },
      semesters: semesters.map((sem) => ({
        name: sem.name,
        started_at: sem.start,
        ended_at: sem.end,
      })),
    }

    try {
      if (editData?.id) {
        await handleUpdate(editData.id, newFormData)
      } else {
        await handleCreate(newFormData)
      }
    } catch (error) {
      toast.error("An error occurred while submitting.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="create-classroom-container">
      <div className="create-classroom-content">
        <h2 className="title">{handleUpdate ? "Edit classroom" : "Create classroom"}</h2>
        <div className="grid">
          <div className="input-group">
            <label>Classroom name</label>
            <p className="helper-text">Please enter the classroom's name</p>
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Start date</label>
            <p className="helper-text">Please enter start date of the first semester for the class</p>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Total semesters</label>
            <p className="helper-text">Please enter the total semesters for the class</p>
            <input
              type="number"
              min={1}
              max={12}
              value={totalSemesters}
              onChange={(e) => setTotalSemesters(Number(e.target.value))}
            />
          </div>
          <div className="input-group">
            <label>Semester duration (months)</label>
            <p className="helper-text">Please enter the semester duration in months</p>
            <select value={semesterDuration} onChange={(e) => setSemesterDuration(Number(e.target.value))}>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="generate-btn" onClick={generateSemesters}>
          Generate
        </button>

        {semesters.length > 0 && (
          <div className="table-container">
            <table className="semester-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start date</th>
                  <th>End date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {semesters.map((sem, index) => (
                  <tr key={index}>
                    <td>{sem.name}</td>
                    <td>
                      {sem.isEditing ? (
                        <input
                          type="date"
                          value={sem.start}
                          onChange={(e) => handleChangeDate(index, "start", e.target.value)}
                        />
                      ) : (
                        sem.start
                      )}
                    </td>
                    <td>
                      {sem.isEditing ? (
                        <input
                          type="date"
                          value={sem.end}
                          onChange={(e) => handleChangeDate(index, "end", e.target.value)}
                        />
                      ) : (
                        sem.end
                      )}
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => toggleEdit(index)}
                        title={sem.isEditing ? "Save" : "Edit"}
                      >
                        <i className={`fa-solid ${sem.isEditing ? "fa-circle-check" : "fa-pen-to-square"}`}></i>
                      </button>
                      <button className="delete-btn" onClick={() => deleteSemester(index)} title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="buttons-container">
          <button className="cancel-btn" onClick={handleShowCreateForm}>
            Cancel
          </button>
          <button className="create-btn" onClick={handleSubmit} disabled={isCreating}>
            {isCreating ? (handleUpdate ? "Updating..." : "Creating...") : handleUpdate ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}
