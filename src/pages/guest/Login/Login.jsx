import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import { login } from '../../../services/AuthService';
import { toast } from 'react-toastify';
import { useState } from 'react';
import {LoadingData} from "../../../components/ui/Loading/LoadingData";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  async function handleLogin(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    
    try {
      setIsLoading(true);
      const response = await login(email, password);
      console.log('Login successful:', response);
      let token = response.data.access_token;
      localStorage.setItem('token', token);
      window.location.href = '/';
    } catch (error) {
      setIsLoading(false);
      console.error('Login failed:', error);
      toast.error("Email or password is incorrect!");
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        {/* LEFT SIDE */}
        <div className="login-left">
          <h5 className="login-title">Login Account</h5>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="form-control login-input"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="form-control login-input"
              />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4 login-options">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="remember"
                />
                <label htmlFor="remember" className="form-check-label text-white">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-white text-decoration-underline login-forgot">
                Forgot Password?
              </a>
            </div>

            <div className="text-center login-submit">
              { isLoading ? 
                <LoadingData/> :
                <button
                  type="submit"
                  className="btn btn-light fw-bold px-4"
                >
                  LOGIN
                </button>
              }
            </div>

          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <h2 className="login-welcome-title">Welcome to StudeeFlow !</h2>
          <p className="login-description">
            A platform that helps students track their learning journey, set clear
            goals, and visualize progress every step of the way.
          </p>

          {/* Dots */}
          <div className="login-dot login-dot--blue-small"></div>
          <div className="login-dot login-dot--orange-medium"></div>
          <div className="login-dot login-dot--blue-tiny"></div>
          <div className="login-dot login-dot--orange-tiny"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
