import "./App.css";
import Map from "./components/Map/Map";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/Login/LoginPage";
import { useState } from "react";
import User from "./models/User";
import UserContext from "./contexts/UserContext";

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  return (
    <UserContext.Provider value={user}>
      <Routes>
        <Route path="/auth" element={<LoginPage></LoginPage>}></Route>
        <Route
          path="/"
          element={
            <>
              <Navbar></Navbar>
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
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
