import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { isAuthenticated } from "../utils/auth";
import PostList from "./PostList";
import RoleCircle from "../components/RoleCircle";

export default function Home() {
    const navigate = useNavigate();
    const logged = isAuthenticated();

    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("Sesión cerrada");
        navigate("/"); 
    };

    return (
        <div className="home-container">
            <h1>Bienvenido</h1>
            <RoleCircle></RoleCircle>

            {/* Si NO está logueado → mostrar botones normales */}
            {!logged && (
                <div className="home-buttons">
                    <Button label="Registrarse" onClick={() => navigate("/registrarse")} />
                    <Button
                        label="Iniciar sesión"
                        className="p-button-secondary"
                        onClick={() => navigate("/login")}
                    />
                </div>
            )}

            {/* Zona privada SOLO para usuarios logueados */}
            {logged && (
                <div className="private-section">
   
                    <div>
                        <div>
                            <h2>Zona exclusiva de usuarios logueados</h2>
                            <p>Bienvenido, tienes acceso a contenido especial.</p>

                                <Button
                                    label="Salir"
                                    className="p-button-danger"
                                    onClick={handleLogout}
                                />
                                <Button label="Posts" onClick={() => navigate("/posts")} />
                                     
                        </div> 
                                    
                    </div>
                </div>
                
            )}
        </div>
    );
}
