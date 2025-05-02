import React from 'react'
import { BrowserRouter, Router,Routes,  Link } from "react-router-dom";
function StudentLayout({children}) {
  return (
    <div style={{boxSizing:'border-box'}} className='student-layout'>
      {children}
    </div>
  )
}

export default StudentLayout
