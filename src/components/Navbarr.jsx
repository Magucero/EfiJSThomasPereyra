import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import "../styles/navbar.css";

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">

                <ul className="navbar-links">
                    {/* Home */}
                    <li>
                        <button
                            className="nav-link nav-button"
                            onClick={() => navigate("/")}
                        >
                            Home
                        </button>
                    </li>
                    <li>
                        <button
                            className="nav-link nav-button"
                            onClick={() => navigate("/posts")}
                        >
                            Posts
                        </button>
                    </li>    
                    

                    {/* Volver */}
                    <li>
                        <button
                            className="nav-link nav-button"
                            onClick={() => navigate(-1)}
                        >
                            Volver
                        </button>
                    </li>

                    <li>
                        <button
                            className="nav-link nav-button"
                            onClick={handleLogout}
                        >
                            Salir
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}


