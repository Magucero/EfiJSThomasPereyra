// src/components/RoleCircle.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/roleCircule.css";

export default function RoleCircle() {
    const { user } = useContext(AuthContext);

    if (!user) return null; // no hay usuario logueado

    const roleColors = {
        admin: "red",
        user: "blue",
        moderador: "green"
    };

    return (
        <div 
            className="role-circle" 
            style={{ backgroundColor: roleColors[user.role] || "gray" }}
            title={`Rol: ${user.role}`}
        />
    );
}
