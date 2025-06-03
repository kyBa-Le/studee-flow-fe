import React, { useEffect, useState } from 'react';
import Page404 from "../../assests/images/Page404.png";
import "./NotFound.css";
import { Link } from "react-router-dom";
import { getUser } from "../../services/UserService";

export default function NotFound() {
  const [homePath, setHomePath] = useState("/");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        const user = response.data;
        if (!user) {
          setHomePath("/login");
        } else {
          switch (user.role) {
            case "admin":
              setHomePath("/admin/teacher-management");
              break;
            case "teacher":
              setHomePath("/teacher/home");
              break;
            case "student":
              setHomePath("/student/home");
              break;
            default:
              setHomePath("/login");
              break;
          }
        }
      } catch (error) {
        setHomePath("/login");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className='not-found-container'>
      <h1>Oops!</h1>
      <img className='not-found-image' src={Page404} alt="not found" />
      <p className='back-home-text-not-found'>
        The page you are looking for can't be found. Go home by{" "}
        <Link to={homePath}>clicking here!</Link>
      </p>
    </div>
  );
}
