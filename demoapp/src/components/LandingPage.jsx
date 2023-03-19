import React, { useEffect } from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function LandingPage() {
  const navigate = useNavigate();
  const [{}, dispatch] = useStateProvider();

  const handleShowAuthPromt = () => {
    const start = true;

    dispatch({ type: reducerCases.SET_START, start });
    navigate("/authorization");

    // const socket = io("http://localhost:4000");
  };
  return (
    <div className="landing_page">
      <div className="header">Migo Messenger</div>

      <button className="connect_with_migo" onClick={handleShowAuthPromt}>
        Connect with migo
      </button>
    </div>
  );
}
