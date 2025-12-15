import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import PostForm from "./components/PostForm";
import Review from "./components/Review";
import EditPost from "./components/EditPost";
import ThemeToggle from "./components/toggle";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registrarse" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm/>} />
      <Route path="/posts" element={<PostForm/>} />
      <Route path="/review/:id" element={<Review/>} />
      <Route path="/edit/:id" element={<EditPost/>} />
      
      
    </Routes>
  );
}
