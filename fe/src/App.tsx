import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "sonner";
import DetailThread from "./pages/DetailThread";
import Profile from "./pages/Profile";
import FollowList from "./pages/FollowList";
import Notifications from "./pages/Notifications";
import ProfilePeople from "./pages/ProfilePeople";
import MidContentProfilePeople from "./components/MidContentProfilePeople";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/threads/:threadId" element={<DetailThread />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/follow-list" element={<FollowList />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/threads/user/:id" element={<ProfilePeople />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
