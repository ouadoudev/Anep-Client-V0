import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import useApiAxios from "../config/axios";
import UserContext from "../auth/user-context";
import "bootstrap/dist/css/bootstrap.min.css";
import { baseURL } from "../config/constants";


function MyCourses() {
  const [activeTab, setActiveTab] = useState("enCours");
  const [currentUser] = useContext(UserContext);
  const [courses, setCourses] = useState({ enCours: [], terminés: [], today: [] });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await useApiAxios.get(`/courses/user/${currentUser._id}`);
        const fetchedCourses = response.data;
        const currentDate = new Date();
        const ongoingCourses = [];
        const finishedCourses = [];
        const todayCourses = [];

        fetchedCourses.forEach((course) => {
          if (course.times && course.times.length > 0) {
            const startDate = new Date(course.times[0].startTime);
            const endDate = new Date(course.times[0].endTime);

            if (currentDate >= startDate && currentDate <= endDate) {
              ongoingCourses.push(course);
            } else if (currentDate > endDate) {
              finishedCourses.push(course);
            }

            // Check if course is scheduled for today
            if ((startDate.getDate() === currentDate.getDate() && startDate.getMonth() === currentDate.getMonth() && startDate.getFullYear() === currentDate.getFullYear())||(endDate.getDate() === currentDate.getDate() && endDate.getMonth() === currentDate.getMonth() && endDate.getFullYear() === currentDate.getFullYear())) {
              todayCourses.push(course);
            }
          }
        });

        setCourses({ enCours: ongoingCourses, terminés: finishedCourses, today: todayCourses });
      } catch (error) {
        console.error("Erreur lors de la récupération des cours:", error);
      }
    };

    fetchCourses();
  }, [currentUser]);

  return (
    <MainLayout>
      <section >
        <div className="container-fluid-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px pt-30px pb-100px">
            <div className="lg:col-start-12 lg:col-span-9">
              <div  style={{ minHeight: "60vh", maxHeight: "fit-content" }} className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
                <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
                  <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
                    Statut des cours
                  </h2>
                </div>
                <div className="tab"  style={{ padding: "18px" }}>
                  <div className="tab-links flex flex-wrap mb-10px lg:mb-50px rounded gap-10px">
                    <button
                      className={`relative py-10px px-5 md:py-15px lg:px-10 font-bold uppercase text-sm lg:text-base text-blackColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark before:w-0 before:h-0.5 before:absolute before:-bottom-0.5 lg:before:bottom-0 before:left-0 before:bg-primaryColor hover:before:w-full before:transition-all before:duration-300 whitespace-nowrap ${
                        activeTab === "enCours" ? "bg-primaryColor text-white" : ""
                      }`}
                      onClick={() => setActiveTab("enCours")}
                    >
                      Formations en cours ({courses.enCours.length})
                    </button>
                    <button
                      className={`relative py-10px px-5 md:py-15px lg:px-10 font-bold uppercase text-sm lg:text-base text-blackColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark before:w-0 before:h-0.5 before:absolute before:-bottom-0.5 lg:before:bottom-0 before:left-0 before:bg-primaryColor hover:before:w-full before:transition-all before:duration-300 whitespace-nowrap ${
                        activeTab === "terminés" ? "bg-primaryColor text-white" : ""
                      }`}
                      onClick={() => setActiveTab("terminés")}
                    >
                      Formations terminés ({courses.terminés.length})
                    </button>
                  </div>
                  <div className="tab-content">
                    {activeTab === "enCours" && (
                      <div className="course-table table-responsive">
                         {courses.enCours.length > 0 ? (
                            <>
                        
                          <div className="md:col-start-5 md:col-span-8 lg:col-start-4 lg:col-span-9 space-y-[30px]">
                    <div className="tab-contents">
                      {/* grille de cartes ordonnées */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-30px">
                        {courses.enCours.map((course, index) => (
                          <div key={index} className="group">
                            <div className="tab-content-wrapper" data-aos="fade-up">
                              <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark">
                                {/* image de la carte */}
                                <div className="relative mb-4">
                                  <Link to={`/CoursesDetails/${course._id}`}>
                                    <img
                                      src={`${baseURL}${course.imageUrl}`}
                                      alt={course.title}
                                      className="w-full transition-all duration-300 group-hover:scale-110"
                                    />
                                  </Link>
                                </div>
                                {/* contenu de la carte */}
                                <div>
                                  <Link to={`/CoursesDetails/${course._id}`}>
                                  
                                    {course.title}
                                  </Link>
                                    <div
                                      className="text-md font-inter mb-4 description-clamp "
                                      dangerouslySetInnerHTML={{
                                        __html: course.description,
                                      }}
                                    />
                                  <div className="text-xs text-gray-500">
                                    Créé le:{" "}
                                    <span className="font-semibold">
                                      {course.createdAt}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                            </>
                          
                        ) : (
                          <p>Aucune formation prévue pour aujourd'hui</p>
                        )}
                      </div>
                    )}
                    {activeTab === "terminés" && (
                      <div className="course-table table-responsive">
                        {courses.terminés.length > 0 ? (
                            <>
                        
                          <div className="md:col-start-5 md:col-span-8 lg:col-start-4 lg:col-span-9 space-y-[30px]">
                    <div className="tab-contents">
                      {/* grille de cartes ordonnées */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-30px">
                        {courses.terminés.map((course, index) => (
                          <div key={index} className="group">
                            <div className="tab-content-wrapper" data-aos="fade-up">
                              <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark">
                                {/* image de la carte */}
                                <div className="relative mb-4">
                                  <Link to={`/CoursesDetails/${course._id}`}>
                                    <img
                                      src={`${baseURL}${course.imageUrl}`}
                                      alt={course.title}
                                      className="w-full transition-all duration-300 group-hover:scale-110"
                                    />
                                  </Link>
                                </div>
                                {/* contenu de la carte */}
                                <div>
                                  <Link to={`/CoursesDetails/${course._id}`}>
                                  
                                    {course.title}
                                  </Link>
                                    <div
                                      className="text-md font-inter mb-4 description-clamp "
                                      dangerouslySetInnerHTML={{
                                        __html: course.description,
                                      }}
                                    />
                                  <div className="text-xs text-gray-500">
                                    Créé le:{" "}
                                    <span className="font-semibold">
                                      {course.createdAt}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                            </>
                          
                        ) : (
                          <p>Aucun Formation terminé.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar for Today's Courses */}
            <div className="lg:col-span-3">
              <div className="p-10px md:px```jsx
-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
                <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
                  <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
                  Formations d'aujourd'hui
                  </h2>
                </div>
                <div className="today-courses">
                  {courses.today.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {courses.today.map((course) => (
                        <li key={course._id} className="text-blackColor dark:text-blackColor-dark mb-2">
                          <Link to={`/CoursesDetails/${course._id}`} className="underline text-primaryColor">
                            {course.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucun Formation prévu pour aujourd'hui.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default MyCourses;
