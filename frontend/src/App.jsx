import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import ResumeForm from "./components/ResumeForm";
import LoginForm from "./components/LoginForm";
import { getTokenData } from "./utils/jwtUtils";
import { ModalProvider } from "./contexts/ModalContext";
const baseURL = import.meta.env.VITE_API_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  const validateToken = async (token) => {
    try {
      const res = await fetch(
        "https://resume-builder-2-2gbq.onrender.com/verify-token",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Token check failed", err);
      return false;
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const { expiryTime, user_name } = getTokenData(token);
        const currentTime = Date.now();
        const isValid = await validateToken(token);
        if (expiryTime && expiryTime > currentTime && isValid) {
          setIsAuthenticated(true);
          setUserName(user_name);

          const timeout = expiryTime - currentTime;
          const logoutTimer = setTimeout(() => {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
          }, timeout);

          return () => clearTimeout(logoutTimer);
        } else {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      }
    };

    checkToken();
  }, []);

  const handleAuthSuccess = () => {
    const token = localStorage.getItem("token");

    if (token) {
      const { _, user_name } = getTokenData(token);
      setUserName(user_name);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserName(""); // optional, if you're using it
  };

  return (
    <>
      <div className="main-content">
        {isAuthenticated ? (
          <>
            <ModalProvider>
              <Header userName={userName} onLogout={handleLogout} />
              <ResumeForm />
            </ModalProvider>
          </>
        ) : (
          <LoginForm onAuthSuccess={handleAuthSuccess} />
        )}
      </div>
    </>
  );
}

export default App;
