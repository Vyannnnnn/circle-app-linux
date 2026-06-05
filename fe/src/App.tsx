import { Routes, Route } from "react-router";
import Login from "./page/Login";
import Register from "./page/Register";
import Home from "./page/Home";
import PrivateRoute from "./components/PrivateRoute";
import Tes from "./components/tes/Tes";

function App() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="/tes" element={<Tes />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<Login />} />
    </Routes>
  );
}

export default App;
