import NotFound from "./pages/notFound.jsx";
import SignUpPage from "./pages/signUpPage.jsx";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage.jsx";
import AvatarUpdatePage from "./pages/avatarUpdatePage.jsx";
import ProtectedRoute from "./components/auth/protectedRoute.jsx";
import HomeRoute from "./components/auth/homeRoute.jsx";
import DashboardPage from "./pages/dashboardPage.jsx";
import AllNotesPage from "./pages/allNotesPage.jsx";
import CreateNotePage from "./pages/createNotePage.jsx";
import EditNotePage from "./pages/editNotePage.jsx";
import ViewNotePage from "./pages/viewNotePage.jsx";
import AllTasksPage from "./pages/allTasksPage.jsx";
import AllSubtasksPage from "./pages/allSubtasksPage.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { refreshToken, fetchCurrentUser } from "./store/authSlice.js";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const rehydrateAuth = async () => {
      try {
        await dispatch(refreshToken()).unwrap;
        dispatch(fetchCurrentUser());
      } catch (err) {
        console.log("Auto Login failed: ", err);
      }
    };

    rehydrateAuth();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />

      <Route path="/register" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/avatar" element={<AvatarUpdatePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/notes" element={<AllNotesPage />} />
        <Route path="/notes/new" element={<CreateNotePage />} />
        <Route path="/notes/edit/:id" element={<EditNotePage />} />
        <Route path="/notes/:id" element={<ViewNotePage />} />
        <Route path="/tasks" element={<AllTasksPage />} />
        <Route path="/tasks/:taskId/subtasks" element={<AllSubtasksPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
