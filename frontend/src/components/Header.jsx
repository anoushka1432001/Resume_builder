import "./Header.css";
import React, { useState, useRef, useEffect } from "react";
import { HiDocumentText, HiUser } from "react-icons/hi";
import { useModal } from "../contexts/ModalContext";

function Header({ userName = "User", onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const { setShowJsonModal } = useModal();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <span className="welcome-text">Welcome, {userName}</span>
      </div>

      <div className="header-center">
        <div className="header-content">
          <HiDocumentText className="header-icon" />
          <div className="header-texts">
            <h1 className="animated-heading">Resume Builder</h1>
          </div>
        </div>
      </div>

      <div className="header-right" ref={dropdownRef}>
        <button onClick={() => setShowJsonModal(true)} className="json-button">
          JSON Input
        </button>
        <div className="user-icon-wrapper" onClick={toggleDropdown}>
          <HiUser className="user-icon" />
        </div>
        {dropdownOpen && (
          <div className="user-dropdown">
            <button className="dropdown-item">Settings</button>
            <button className="dropdown-item" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
