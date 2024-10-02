import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import "./utils/cssLoader.css";
import Aos from "aos";
import "aos/dist/aos";
import LoadingComponent from "./components/LoadingComponent";
import PrivateRoute from "./config/PrivateRoute";
import UserProvider from "./auth/user-provider";

// Lazy loaded components
const HomePage = lazy(() => import("./pages/HomePage"));
const Course = lazy(() => import("./pages/CoursePage"));
const CoursesDetails = lazy(() => import("./pages/CoursesDetailsPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const Dashboard = lazy(() => import("./pages/admin/DashboardPage"));
const CourseManagmentPage = lazy(() =>
  import("./pages/admin/CourseManagmentPage")
);
const CreateCourse = lazy(() =>
  import("./components/courses/CreateCoursePage")
);
const EditCourse = lazy(() => import("./components/courses/EditCoursePage"));
const CreateUser = lazy(() => import("./components/users/CreateUserPage"));
const EditUser = lazy(() => import("./components/users/EditUserPage"));
const UserManagmentPage = lazy(() => import("./pages/admin/UserManagmentPage"));
const Auth = lazy(() => import("./pages/AuthPage"));
const UserNeedPage = lazy(() => import("./pages/UserNeedPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage")); // Add this line
const ResetPassword = lazy(()=>import("./pages/resetPassword"))
const ForgetPassword = lazy(()=>import("./pages/ForgetPassword"))
const UserNeedAdmin = lazy(() => import("./pages/admin/UserNeedPage"));
const MyCoursePage = lazy(()=>import("./pages/MyCoursePage"))
const MotDuDirecteur = lazy(()=>import("./pages/MotDuDirecteur"))


function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    Aos.init();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Simulate fetching data
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Router>
          <Suspense fallback={<LoadingComponent />}>
            {isDataLoaded ? (
              <Routes>
                <Route path="/Auth" element={<Auth />} />
                <Route path="Auth/ForgetPassword" element={<ForgetPassword />} />
                <Route path="/resetPassword/:id" element={<ResetPassword/>}/>
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <HomePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/Courses"
                  element={
                    <PrivateRoute>
                      <Course />
                    </PrivateRoute>
                  }
                />
                 <Route
                  path="/MyCourses"
                  element={
                    <PrivateRoute>
                      <MyCoursePage />
                    </PrivateRoute>
                  }
                />
                 <Route
                  path="/MotDuDirecteur"
                  element={
                    <PrivateRoute>
                      <MotDuDirecteur />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/CoursesDetails/:id"
                  element={
                    <PrivateRoute>
                      <CoursesDetails />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/Dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/CoursesManagement"
                  element={
                    <PrivateRoute>
                      <CourseManagmentPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/CreateCourse"
                  element={
                    <PrivateRoute>
                      <CreateCourse />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/EditCourse/:id"
                  element={
                    <PrivateRoute>
                      <EditCourse />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/UsersManagement"
                  element={
                    <PrivateRoute>
                      <UserManagmentPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/CreateUser"
                  element={
                    <PrivateRoute>
                      <CreateUser />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/EditUser/:id"
                  element={
                    <PrivateRoute>
                      <EditUser />
                    </PrivateRoute>
                  }
                />
                          <Route
                  path="/UserNeed"
                  element={
                    <PrivateRoute>
                      <UserNeedPage />
                    </PrivateRoute>
                  }
                />
                          <Route
                  path="/UserNeedAdmin"
                  element={
                    <PrivateRoute>
                      <UserNeedAdmin />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/UserProfile"
                  element={
                    <PrivateRoute>
                      <UserProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/user-needs"
                  element={
                    <PrivateRoute>
                      <UserNeedPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="*"
                  element={<NotFoundPage isDataLoaded={isDataLoaded} />}
                />
              </Routes>
            ) : (
              <LoadingComponent />
            )}
          </Suspense>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;