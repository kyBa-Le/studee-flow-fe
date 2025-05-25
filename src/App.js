import logo from './logo.svg';
import './App.css';
import { AppRoutes } from './routes/AppRoutes';
import './assests/global.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <AppRoutes/>
      <ToastContainer style={{zIndex: "9999999"}} position="top-right" autoClose={3000} />
    </>
   
  );
}

export default App;