import "./App.css";
import Map from "./components/Map/Map";
import { Routes, Route, Outlet, useNavigate, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/Login/LoginPage";
import { useEffect, useState } from "react";
import User from "./models/User";
import UserContext from "./contexts/UserContext";
import AccessAPI from "./API/AccessAPI";
import Dial from "./components/Dial";
import FormModal from "./components/Forms/FormModal";
import AddDocumentForm from "./components/Forms/AddDocumentForm";
import DocumentAPI from "./API/DocumentAPI";
import LinkDocumentForm from "./components/Forms/LinkDocumentForm";

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [selectedOperation, setSelectedOperation] = useState(undefined); //Manages the forms modal
  const [docsLocation, setDocsLocation] = useState([]);

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const u = await AccessAPI.getUserInfo();
        setUser(u);
      } catch {
        setUser(undefined);
      }
    };
    DocumentAPI.getDocumentsLocation()
      .then((response) => {
        setDocsLocation(response);
      })
      .catch((err) => console.log(err));
    checkAuth();
  }, []);
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
              {user && user.role == "Urban Planner" && (
                <Dial setOperation={setSelectedOperation}></Dial>
              )}
              <FormModal
                operation={selectedOperation}
                setOperation={setSelectedOperation}>
                {selectedOperation === 1 ? (
                  <AddDocumentForm></AddDocumentForm>
                ) : (
                  selectedOperation === 2 && (
                    <LinkDocumentForm></LinkDocumentForm>
                  )
                )}
              </FormModal>
            </>
          }>
          <Route
            path="/map"
            element={
              <>
                <Map docs={docsLocation}></Map>
              </>
            }
          />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
