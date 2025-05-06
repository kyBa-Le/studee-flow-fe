import React from 'react'
import StudentHeader from '../Header/StudentHeader'
import Footer from '../Footer/Footer'
function StudentLayout({children}) {
  return (
    <div style={{boxSizing:'border-box'}} className='student-layout'>
      <StudentHeader/>
      {children}
      <Footer/>
    </div>
  )
}

export default StudentLayout
