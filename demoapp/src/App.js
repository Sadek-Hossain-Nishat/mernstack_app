import logo from "./logo.svg";
import "./App.css";
import LandingPage from "./components/LandingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Authentication from "./components/Authentication";
import AccountPage from "./components/AccountPage";

import { useStateProvider } from "./utils/StateProvider";
import Home from "./components/Home";
import OtherUsers from "./components/OtherUsers";
import ChatPage from "./components/ChatPage";

function App() {
  const [{}, dispatch] = useStateProvider();
  return (
    <Router>
      {/* <LandingPage /> */}

      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        {/* <Route exact path="/" element={<Home />} /> */}

        <Route path={"/account/:id"} element={<AccountPage />} />

        <Route path="/authorization" element={<Authentication />} />
        <Route path="/otherusers" element={<OtherUsers />} />
        <Route path="/chatpage/:name" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
