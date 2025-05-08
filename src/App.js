import logo from './logo.svg';
import './App.css';
import { AppRoutes } from './routes/AppRoutes';

import { CreateStudentsForm } from './pages/admin/CreateStudentsForm';
import CreateStudentForm from './pages/admin/CreateStudentForm.css';

function App() {
  return (
    <>
      <AppRoutes/>
      <CreateStudentsForm></CreateStudentsForm>
    </>
   
  );
}

export default App;