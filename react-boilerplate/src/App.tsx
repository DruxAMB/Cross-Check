import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./components/GetStarted";
import VerifyAsset from "./pages/VerifyAsset";
import Notification from "./components/Notification";
import UserDashboard from "./pages/UserDashboard";

const App: React.FC = () => {
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  return (
    <Router>
      <div className="min-h-screen pt-10 bg-teal-600 w-screen">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
          />
        )}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                account="0xYourEthereumAccount"
                contract={{}}
                setNotification={setNotification}
              />
            }
          />
          <Route path="/verify/:assetId" element={<VerifyAsset />} />

          <Route
            path="/userdashboard"
            element={
              <UserDashboard
                account="dummyAccount"
                contract={null}
                setNotification={() => {}}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
