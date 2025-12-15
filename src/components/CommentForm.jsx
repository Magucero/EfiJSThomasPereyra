import { useState } from "react";
import "../styles/comentario.css"

export default function CommentForm({ postId, onCommentCreated }) {
    const [contenido, setContenido] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // -----------------------------
    //   CREAR COMENTARIO (POST)
    // -----------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!contenido.trim()) {
            setError("El comentario no puede estar vacío");
            return;
        }

        const token = localStorage.getItem("token");
        setLoading(true);

        try {
            const res = await fetch(
                `http://localhost:5000/api/posts/${postId}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        contenido
                    })
                }
            );

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "Error al crear comentario");
                return;
            }

            const newComment = await res.json();

            setContenido("");
            setError("");

            // avisar al padre (opcional)
            if (onCommentCreated) {
                onCommentCreated(newComment);
            }

        } catch (err) {
            console.error(err);
            alert("Error al conectar con la API");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="post-card" onSubmit={handleSubmit}>
            <h4>Agregar comentario</h4>

            <textarea
                className="form-textarea"
                placeholder="Escribí tu comentario..."
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
            />

            {error && <small className="error">{error}</small>}

            <button
                className="form-button"
                type="submit"
                disabled={loading}
            >
                {loading ? "Enviando..." : "Comentar"}
            </button>
        </form>
    );
}
