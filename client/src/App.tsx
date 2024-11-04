import "./App.css";
import Map from "./components/Map/Map";
import { Routes, Route, Outlet, useNavigate, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/Login/LoginPage";
import { useState } from "react";
import User from "./models/User";
import UserContext from "./contexts/UserContext";
import AccessAPI from "./API/AccessAPI";
import Dial from "./components/Dial";
import FormModal from "./components/Forms/FormModal";
import AddDocumentForm from "./components/Forms/AddDocumentForm";

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [selectedOperation, setSelectedOperation] = useState(undefined); //Manages the forms modal

  const navigate = useNavigate();

  const doLogin = async (email: string, password: string) => {
    const user = await AccessAPI.login(email, password);
    setUser(user);
    navigate("/map");
  };

  const doLogout = async () => {
    await AccessAPI.logOut();
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
              <Dial setOperation={setSelectedOperation}></Dial>
              <FormModal
                operation={selectedOperation}
                setOperation={setSelectedOperation}>
                {<AddDocumentForm></AddDocumentForm>}
              </FormModal>
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
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
