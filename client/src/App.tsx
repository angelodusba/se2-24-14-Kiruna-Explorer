import "./App.css";
import Map from "./components/Map/Map";
import { Routes, Route, Outlet, useNavigate, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/Login/LoginPage";
import { useState } from "react";
import User from "./models/User";
import UserContext from "./contexts/UserContext";
import API from "./API";

import LinkDocumentForm from "./components/LinkDocumentForm";
import AddDocumentForm from "./components/AddDocumentForm";

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const navigate = useNavigate();

  const doLogin = async (username: string, password: string) => {
    const user = await API.login(username, password);
    setUser(user);
    navigate("/map");
  };

  const doLogout = async () => {
    await API.logOut();
    setUser(undefined);
    navigate("/");
  };
  return (
    <UserContext.Provider value={user}>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/map" /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={<LoginPage login={doLogin}></LoginPage>}></Route>
        <Route
          path="/"
          element={
            <>
              <Navbar logout={doLogout}></Navbar>
              <Outlet />
            </>
          }>
          <Route
            path="/map"
            element={
              <>
                <Map></Map>
              </>
            }
          />
        </Route>
        <Route
          path="/link"
          element={
              <LinkDocumentForm></LinkDocumentForm>
          }
        />
        <Route path="/add" element={<AddDocumentForm></AddDocumentForm>} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
