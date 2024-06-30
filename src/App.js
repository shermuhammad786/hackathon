import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Quiz from "./pages/quiz/quiz";
import { Route, Routes } from "react-router-dom";
import Aos from "aos";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </div>
  );
}

export default App;
