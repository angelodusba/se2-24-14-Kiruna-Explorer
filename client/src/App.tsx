import "./App.css";
import Map from "./components/Map/Map";
import { Routes, Route, Outlet, useNavigate, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/Login/LoginPage";
import { useEffect, useState } from "react";
import User, { Role } from "./models/User";
import UserContext from "./contexts/UserContext";
import AccessAPI from "./API/AccessAPI";
import DocumentAPI from "./API/DocumentAPI";
import AddDocumentPage from "./pages/AddDocumentPage";
import LinkDocumentsPage from "./pages/LinkDocumentsPage";
import { DisabledInputContext } from "./contexts/DisabledInputContext";
import ListMunicipality from "./components/Map/ListMunicipality";

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [disabledInput, setDisabledInput] = useState<boolean>(false);
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
        const user = await AccessAPI.getUserInfo();
        setUser(user);
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
      <DisabledInputContext.Provider
        value={{ disabledInput, setDisabledInput }}>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/map" /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={
              user ? <Navigate to={"/map"} /> : <LoginPage login={doLogin} />
            }
          />
          <Route
            path="/"
            element={
              <>
                {!disabledInput && <Navbar logout={doLogout} />}
                <Outlet />
              </>
            }>
            <Route
              path="/map"
              element={
                <>
                  <Map docs={docsLocation} />
                  <Outlet />
                </>
              }>
              <Route
                path="add"
                element={
                  user && user.role === Role.UrbanPlanner ? (
                    <AddDocumentPage />
                  ) : (
                    <Navigate to="/auth" />
                  )
                }
              />
              <Route
                path="link"
                element={
                  user && user.role === Role.UrbanPlanner ? (
                    <LinkDocumentsPage />
                  ) : (
                    <Navigate to="/auth" />
                  )
                }
              />
              <Route 
            path = "municipality"
              element= {
                user && user.role === Role.UrbanPlanner ? (
                  <ListMunicipality />
                ) : (
                  <Navigate to="/auth" />
                )
              }/>
          </Route>
          </Route>
          <Route
            path="*"
            element={user ? <Navigate to="/map" /> : <Navigate to="/auth" />}
          />
        </Routes>
      </DisabledInputContext.Provider>{" "}
    </UserContext.Provider>
  );
}

export default App;
