import { TeacherHeader } from "../Header/TeacherHeader"

export function TeacherLayout({ children }) {
      return (
    <div style={{boxSizing:'border-box'}} className='teacher-layout'>
      <TeacherHeader/>
      {children}
    </div>
  )
}