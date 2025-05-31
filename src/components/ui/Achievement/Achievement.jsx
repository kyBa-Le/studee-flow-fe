import React, { useEffect, useRef } from "react";
import Certificate from "../../../assests/images/Certificate.png";
import "./Achievement.css";

export function Achievement({ achievements }) {
  const carouselRef = useRef(null);

  useEffect(() => {
    if (carouselRef.current && window.bootstrap) {
      new window.bootstrap.Carousel(carouselRef.current, {
        interval: false,
        ride: false,
      });
    }
  }, [achievements]);

  const chunkAchievements = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };

  const achievementChunks = chunkAchievements(achievements, 4);

  return (
    <div className="student-achievement">
      <div className="student-achievement-content">
        <div className="student-achievement-title">
          <i className="fa-solid fa-award"></i> Achievements
        </div>
        <div className="student-achievement-blog">
          <div
            id="carouselExampleControls"
            className="carousel slide"
            ref={carouselRef}
          >
            {/* Left control */}
            <button
              className="custom-carousel-control prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <i className="fa-solid fa-angle-left"></i>
            </button>
            <div className="carousel-inner">
              {achievementChunks.map((chunk, index) => (
                <div
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  key={index}
                >
                  <div className="achievement-row student-achievement-blog-content">
                    {chunk.map((achievement, idx) => (
                      <div className="achievement-blog" key={idx}>
                        <img
                          className="certificate-img"
                          src={achievement.image_link}
                          alt="certificate"
                        />
                        <div className="achievement-blog-right">
                          <div className="achievement-blog-right-top">
                            <div className="achievement-blog-right-title">
                              {achievement.title}
                            </div>
                            <div className="achievement-blog-right-text">
                              {achievement.content}
                            </div>
                            <div className="semester-subject">
                              Semester {achievement.semester}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Right control */}
            <button
              className="custom-carousel-control next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <i className="fa-solid fa-angle-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
