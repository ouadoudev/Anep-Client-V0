import { useState, useRef, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import useApiAxios from "../config/axios";
import UserContext from "../auth/user-context";
import {logoutQuery} from "../auth/user-axios" // Importer la fonction logoutQuery

function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationMenuRef = useRef(null);
  const socket = useRef(null);
  const [currentUser] = useContext(UserContext);
  const userId = currentUser._id;

  // Fonction pour basculer le menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fonction pour basculer le menu de notifications
  const toggleNotificationMenu = () => {
    setIsNotificationMenuOpen(!isNotificationMenuOpen);
  };

  // Fonction pour basculer le menu utilisateur
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Effet pour initialiser la connexion du socket
  useEffect(() => {
    // Initialize socket connection
    socket.current = io("https://anep-server.onrender.com/");

    socket.current.emit("register", userId);

    socket.current.on("notification", (notification) => {
      setNotifications((prevNotifications) => [
        { ...notification, newUser: true },
        ...prevNotifications,
      ]);
    });

    return () => {
      socket.current.off("notification");
      socket.current.disconnect();
    };
  }, []);

  // Fonction pour récupérer les notifications
  const fetchNotifications = () => {
    useApiAxios
      .get(`/users/notifications`)
      .then((response) => {
        const sortedNotifications = response.data.notifications.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedNotifications);
      })
      .catch((error) => console.error("Échec du chargement des notifications :", error));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fonction pour gérer le clic sur une notification
  const handleNotificationClick = (notificationId, courseId) => {
    useApiAxios
      .post(`/users/mark-notification-read`, {
        userId: userId,
        notificationId,
        courseId,
      })
      .then(() => {
        setNotifications(
          notifications.map((notif) =>
            notif._id === notificationId ? { ...notif, newUser: false } : notif
          )
        );
      })
      .catch((error) =>
        console.error("Échec de marquer la notification comme lue :", error)
      );
    navigate(`/CoursesDetails/${courseId}`);
  };

  // Effet pour fermer le menu de notifications en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target)
      ) {
        setIsNotificationMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calcul du nombre de nouvelles notifications
  const newNotificationsCount = notifications.filter(
    (notification) => notification.newUser
  ).length;

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    logoutQuery(); // Appeler la fonction logoutQuery pour se déconnecter
  };

  return (
    <>
      {/* navbar start */}
      <div className="top-0 z-medium dark:bg-whiteColor-dark bg-whiteColor">
        <nav>
          <div className="py-15px lg:py-0 px-15px lg:container 3xl:container-secondary-lg 4xl:container mx-auto relative">
            <div className="grid grid-cols-2 lg:grid-cols-12 items-center gap-15px">
              {/* navbar left */}
              <div className="lg:col-start-1 lg:col-span-2">
                <Link to="/" className="block">
                  <img
                    src="/assets/images/logo/logo_1.png"
                    alt="Logo"
                    className="w-logo-sm lg:w-auto py-2"
                  />
                </Link>
              </div>
              {/* Main menu */}
              <div className="hidden lg:block lg:col-start-3 lg:col-span-7">
                <ul className="nav-list flex justify-center space-x-8 lg:space-x-12">
                  <li className="nav-item">
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primaryColor font-extrabold border-b-4 border-primaryColor px-4 py-3"
                          : "nav-link text-gray-700 hover:text-blue-700 transition duration-300 px-4 py-3 rounded-lg font-semibold hover:bg-blue-100"
                      }
                    >
                      Accueil
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/MotDuDirecteur"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primaryColor font-extrabold border-b-4 border-primaryColor px-4 py-3"
                          : "nav-link text-gray-700 hover:text-blue-700 transition duration-300 px-4 py-3 rounded-lg font-semibold hover:bg-blue-100"
                      }
                    >
                      Mot de la DG
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/Courses"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primaryColor font-extrabold border-b-4 border-primaryColor px-4 py-3"
                          : "nav-link text-gray-700 hover:text-blue-700 transition duration-300 px-4 py-3 rounded-lg font-semibold hover:bg-blue-100"
                      }
                    >
                      Formations disponibles
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/MyCourses"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primaryColor font-extrabold border-b-4 border-primaryColor px-4 py-3"
                          : "nav-link text-gray-700 hover:text-blue-700 transition duration-300 px-4 py-3 rounded-lg font-semibold hover:bg-blue-100"
                      }
                    >
                      Mes Formations
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/UserNeed"
                      className={({ isActive }) =>
                        isActive
                          ? "text-primaryColor font-extrabold border-b-4 border-primaryColor px-4 py-3"
                          : "nav-link text-gray-700 hover:text-blue-700 transition duration-300 px-4 py-3 rounded-lg font-semibold hover:bg-blue-100"
                      }
                    >
                    Exprimer Un Besoin
                    </NavLink>
                  </li>
                 
                 
                  {currentUser.roles.includes('admin') &&
                  <li className="nav-item">
                    <NavLink
                      to="/Dashboard"
                      className={({ isActive }) =>
                        isActive
                      ? "text-primaryColor font-extrabold border-b-4 border-primaryColor px-4 py-3"
                      : "nav-link text-gray-700 hover:text-blue-700 transition duration-300 px-4 py-3 rounded-lg font-semibold hover:bg-blue-100"
                    }
                    >
                      Tableau de bord
                    </NavLink>
                  </li>
                    }
                
                </ul>
              </div>
              {/* navbar right */}
              <div className="lg:col-start-10 lg:col-span-3">
                <ul className="relative nav-list flex justify-end items-center">
                  <li
                    onClick={toggleNotificationMenu}
                    className="px-5 lg:px-10px 2xl:px-5 lg:py-4 2xl:py-26px 3xl:py-9 group relative"
                  >
                    <Link className="relative block cursor-pointer">
                      <i className="icofont-notification text-2xl text-blackColor group-hover:text-secondaryColor transition-all duration-300 dark:text-blackColor-dark" />
                      {newNotificationsCount > 0 && (
                        <span className="absolute -top-1 2xl:-top-[5px] -right-[10px] lg:right-3/4 2xl:-right-[10px] text-[10px] font-medium text-white dark:text-whiteColor-dark bg-secondaryColor px-1 py-[2px] leading-1 rounded-full z-50 block">
                          {newNotificationsCount}{" "}
                        </span>
                      )}
                    </Link>
                    {isNotificationMenuOpen && (
                      <ul
                        ref={notificationMenuRef}
                        className="notification-menu absolute right-0 bg-white text-gray-800 shadow-xl mt-2 rounded-md overflow-hidden z-50 w-60 border border-gray-200 max-h-60 overflow-y-auto"
                      >
                        {notifications.map((notification, index) => (
                          <li key={notification.id || index}>
                            <button
                              className="block px-6 py-3 text-sm hover:bg-gray-50 transition duration-150 ease-in-out w-full text-left"
                              onClick={() =>
                                handleNotificationClick(
                                  notification._id,
                                  notification.courseId
                                )
                              }
                            >
                              {notification.message}
                              {notification.newUser && (
                                <span className="ml-2 text-sm text-secondaryColor font-bold flash">
                                  NOUVEAU
                                </span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  <li
                    onClick={toggleUserMenu}
                    className="hidden lg:block relative"
                  >
                    <Link
                      to="/UserProfile"
                      className="text-size-12 2xl:text-size-15 px-15px py-2 text-blackColor hover:text-whiteColor bg-whiteColor block hover:bg-primaryColor border border-borderColor1 rounded-standard font-semibold mr-[7px] 2xl:mr-15px dark:text-blackColor-dark dark:bg-whiteColor-dark dark:hover:bg-primaryColor dark:hover:text-whiteColor dark:hover:border-primaryColor cursor-pointer"
                    >
                      <i className="icofont-user-alt-5" />
                    </Link>
                  </li>
                  <li className="hidden lg:block">
                    <button
                      className="text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor border-primaryColor border hover:text-primaryColor hover:bg-white px-15px py-2 rounded-standard dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                      onClick={handleLogout}
                    >
                      Déconnexion
                    </button>
                  </li>
                  <li className="block lg:hidden">
                    <button
                      className="open-mobile-menu text-3xl text-darkdeep1 hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor lg:hidden"
                      onClick={toggleMobileMenu}
                    >
                      <i className="icofont-navigation-menu" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {/* navbar end */}
      {/* mobile menu */}
      <div
        className={`mobile-menu w-mobile-menu-sm md:w-mobile-menu-lg fixed top-0 ${
          isMobileMenuOpen ? "right-0" : "-right-full"
        } transition-all duration-500 h-full shadow-dropdown bg-white dark:bg-whiteColor-dark z-high lg:hidden`}
      >
        <button
          className="close-mobile-menu text-lg bg-darkdeep1 hover:bg-secondaryColor text-white px-[11px] py-[6px] absolute top-0 right-full"
          onClick={toggleMobileMenu}
        >
          <i className="icofont-close-line" />
        </button>
        {/* mobile menu wrapper */}
        <div className="px-5 md:px-30px pt-5 md:pt-10 pb-50px h-full overflow-y-auto">
          <ul className="space-y-4">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-primaryColor font-extrabold"
                    : "text-darkdeep1 hover:text-secondaryColor"
                }
                onClick={toggleMobileMenu} // Fermer le menu mobile en cliquant sur le lien
              >
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Courses"
                className={({ isActive }) =>
                  isActive
                    ? "text-primaryColor font-extrabold"
                    : "text-darkdeep1 hover:text-secondaryColor"
                }
                onClick={toggleMobileMenu} // Fermer le menu mobile en cliquant sur le lien
              >
                Cours
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-primaryColor font-extrabold"
                    : "text-darkdeep1 hover:text-secondaryColor"
                }
                onClick={toggleMobileMenu} // Fermer le menu mobile en cliquant sur le lien
              >
                Tableau de bord
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/UserProfile`}
                className={({ isActive }) =>
                  isActive
                    ? "text-primaryColor font-extrabold"
                    : "text-darkdeep1 hover:text-secondaryColor"
                }
                onClick={toggleMobileMenu} // Fermer le menu mobile en cliquant sur le lien
              >
                Profil
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/logout"
                className={({ isActive }) =>
                  isActive
                    ? "text-primaryColor font-extrabold"
                    : "text-darkdeep1 hover:text-secondaryColor"
                }
                onClick={handleLogout} // Fermer le menu mobile en cliquant sur le lien
              >
                Déconnexion
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
