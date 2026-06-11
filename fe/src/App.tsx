import { Routes, Route } from "react-router";
import Login from "./page/Login";
import Register from "./page/Register";
import Home from "./page/Home";
import PrivateRoute from "./components/PrivateRoute";
import Tes from "./components/tes/Tes";
import { Toaster } from "sonner";
import DetailThread from "./page/DetailThread";
import Profile from "./page/Profile";

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
          <Route path="/tes" element={<Tes />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/forgot-password" element={<Login />} />
        </Route>
      </Routes>
    </>
  );
} 

export default App;
