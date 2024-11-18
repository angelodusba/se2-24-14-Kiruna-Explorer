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
import DocumentList from "./components/listDocument/DocumentList";
import { DisabledInputContext } from "./contexts/DisabledInputContext";
import DocumentCard from "./components/Map/DocumentCard";
import AttachmentsPage from "./pages/AttachmentsPage";
import GeoreferencePage from "./pages/GeoreferencePage";
import ListMunicipality from "./components/Map/ListMunicipality";
import AdvancedSearchPage from "./pages/AdvancedSearchPage";

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [disabledInput, setDisabledInput] = useState(false);
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

  const fetchDocuments = () => {
    DocumentAPI.getDocumentsLocation()
      .then((response) => {
        setDocsLocation(response);
      })
      .catch((err) => console.log(err));
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
    fetchDocuments();
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
                {!disabledInput && (
                  <Navbar
                    logout={doLogout}
                    docsLocation={docsLocation}
                    setDocsLocation={docsLocation}
                  />
                )}
                <Outlet />
              </>
            }>
            <Route
              path="/map"
              element={
                <>
                  <Map docs={docsLocation}></Map>
                </>
              }>
              <Route
                path="add"
                element={
                  user && user.role === Role.UrbanPlanner ? (
                    <AddDocumentPage fetchDocuments={fetchDocuments} />
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
              <Route path=":id" element={<DocumentCard />}>
                <Route
                  path="resources"
                  element={
                    user && user.role === Role.UrbanPlanner ? (
                      <AttachmentsPage></AttachmentsPage>
                    ) : (
                      <Navigate to="/auth" />
                    )
                  }
                />
                <Route
                  path="georeference"
                  element={
                    user && user.role === Role.UrbanPlanner ? (
                      <GeoreferencePage
                        fetchDocuments={fetchDocuments}></GeoreferencePage>
                    ) : (
                      <Navigate to="/auth" />
                    )
                  }
                />
              </Route>
              <Route
                path="documents"
                element={
                  user ? (
                    <DocumentList open={true} onClose={() => {}} />
                  ) : (
                    <Navigate to="/auth" />
                  )
                }
              />
              <Route
                path="municipality"
                element={
                  user ? (
                    <ListMunicipality
                      open={true}
                      onClose={() => navigate("/map")}
                    />
                  ) : (
                    <Navigate to="/auth" />
                  )
                }
              />
              <Route path="search" element={<AdvancedSearchPage />} />
            </Route>
          </Route>
          <Route
            path="*"
            element={user ? <Navigate to="/map" /> : <Navigate to="/auth" />}
          />
        </Routes>
      </DisabledInputContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
