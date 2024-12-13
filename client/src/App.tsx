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
import DocumentCard from "./components/Map/DocumentCard";
import AttachmentsPage from "./pages/AttachmentsPage";
import GeoreferencePage from "./pages/GeoreferencePage";
import ListMunicipality from "./components/Map/ListMunicipality";
import { SearchFilter } from "./models/SearchFilter";
import { ErrorContext } from "./contexts/ErrorContext";
import { Snackbar, Alert } from "@mui/material";
import DocumentsListPage from "./pages/DocumentsListPage";
import Diagram from "./components/Diagram/Diagram";
import MapPicker from "./components/Map/MapPicker";
import { LandingPage } from "./pages/LandingPage";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [disabledInput, setDisabledInput] = useState(undefined);
  const [error, setError] = useState("");
  const [docsLocation, setDocsLocation] = useState([]);
  const [currentFilter, setCurrentFilter] = useState<SearchFilter>({});
  const [filterNumber, setFilterNumber] = useState<number>(0);

  const doLogin = async (email: string, password: string) => {
    try {
      const user = await AccessAPI.login(email, password);
      setUser(user);
      navigate("/map");
    } catch (err) {
      setError(err.message);
    }
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
      .catch((err) => {
        setError(err.message);
      });
  };

  const filterDocuments = async (filter: SearchFilter) => {
    try {
      const result = await DocumentAPI.getFilteredDocuments(filter);
      setCurrentFilter({ ...filter });
      // Format as the documents returned by getDocumentsLocation
      const filteredDocs = result.docs.map((doc) => {
        return {
          id: doc.id,
          title: doc.title,
          type: doc.type,
          location: doc.location,
          stakeholders: doc.stakeholders,
        };
      });
      setDocsLocation(filteredDocs);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetFilters = () => {
    setCurrentFilter({});
    setFilterNumber(0);
    filterDocuments({});
  };

  const handleCardShow = (id) => {
    navigate(`/map/${id}`);
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

  useEffect(() => {
    // Update filters count
    const nonEmptyFilters = Object.fromEntries(
      Object.entries(currentFilter).filter(([, value]) => {
        if (Array.isArray(value)) {
          // Keep arrays only if they have at least one element
          return value.length > 0;
        } else if (typeof value === "boolean") {
          // Include boolean values unless they are undefined
          return value !== undefined && value !== false;
        } else {
          // Keep strings only if they are not empty
          return value !== "";
        }
      })
    );
    const filterNum = Object.keys(nonEmptyFilters).length;
    setFilterNumber(filterNum);
  }, [currentFilter]);

  return (
    <UserContext.Provider value={user}>
      <DisabledInputContext.Provider value={{ disabledInput, setDisabledInput }}>
        <ErrorContext.Provider value={{ error, setError }}>
          <Routes>
            <Route
              path="/"
              element={<LandingPage />} // Show LandingPage as the default route
            />
            <Route
              path="/auth"
              element={user ? <Navigate to={"/map"} /> : <LoginPage login={doLogin} />}
            />
            <Route
              path="/"
              element={
                <>
                  {!disabledInput && (
                    <Navbar
                      handleLogout={doLogout}
                      onSearch={filterDocuments}
                      filterNumber={filterNumber}
                      handleResetFilters={handleResetFilters}
                    />
                  )}
                  <Outlet />
                </>
              }
            >
              <Route path="/map" element={<Map docs={docsLocation} />}>
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
                      <LinkDocumentsPage fetchDocuments={fetchDocuments} />
                    ) : (
                      <Navigate to="/auth" />
                    )
                  }
                />
                <Route
                  path="area"
                  element={
                    user && user.role === Role.UrbanPlanner ? (
                      <MapPicker />
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
                        <AttachmentsPage />
                      ) : (
                        <Navigate to="/auth" />
                      )
                    }
                  />
                  <Route
                    path="georeference"
                    element={
                      user && user.role === Role.UrbanPlanner ? (
                        <GeoreferencePage fetchDocuments={fetchDocuments} />
                      ) : (
                        <Navigate to="/auth" />
                      )
                    }
                  />
                </Route>
                <Route
                  path="municipality"
                  element={
                    user ? (
                      <ListMunicipality
                        open={true}
                        onClose={() => navigate("/map")}
                        currentFilter={currentFilter}
                        docs={docsLocation}
                        handleCardShow={handleCardShow}
                      />
                    ) : (
                      <Navigate to="/auth" />
                    )
                  }
                />
              </Route>
              <Route
                path="/list"
                element={
                  <DocumentsListPage
                    currentFilter={currentFilter}
                    handleCardShow={handleCardShow}
                  />
                }
              />
              <Route path="/diagram" element={<Diagram currentFilter={currentFilter} />}>
                <Route path=":id" element={<DocumentCard returnHere={"/diagram"} />}></Route>
              </Route>
            </Route>
            <Route path="*" element={user ? <Navigate to="/map" /> : <Navigate to="/auth" />} />
          </Routes>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={!!error}
            autoHideDuration={3500}
            onClose={() => setError("")}
          >
            <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
              {error}
            </Alert>
          </Snackbar>
        </ErrorContext.Provider>
      </DisabledInputContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
