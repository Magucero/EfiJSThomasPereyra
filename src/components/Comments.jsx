import { useEffect, useState } from "react";

export default function Comments({ postId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null; 
    // user = { id: X, role: "admin" }

    const fetchComments = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/posts/${postId}/comments`);
            const data = await res.json();
            setComments(data);
        } catch (error) {
            console.error("Error al obtener comentarios:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ contenido: newComment })
            });

            const data = await res.json();

            if (!res.ok) {
                alert("Error: " + JSON.stringify(data));
                return;
            }

            setNewComment("");
            fetchComments();
        } catch (err) {
            console.error("Error al enviar comentario:", err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    return (
        <div style={{ marginTop: "30px" }}>
            <h3 className="comment">Comentarios</h3>

            {loading ? (
                <p>Cargando comentarios...</p>
            ) : comments.length === 0 ? (
                <p>No hay comentarios aún.</p>
            ) : (
                <ul className="comment">
                    {comments.map((c) => {
                        const puedeEditar = user && (user.id === c.user_id || user.role === "admin");

                        return (
                            <li key={c.id} style={{ marginBottom: "15px" }}>
                                <strong>{c.autor}:</strong> {c.contenido}

                                {/* BOTONES DE EDITAR Y ELIMINAR */}
                                {puedeEditar && (
                                    <div style={{ marginTop: "5px" }}>
                                        <button 
                                            style={{ marginRight: "10px" }}
                                            className="form-button"
                                        >
                                            Editar
                                        </button>

                                        <button 
                                            className="form-button"
                                            style={{ backgroundColor: "red" }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            {token ? (
                <form onSubmit={handleSendComment} style={{ marginTop: "20px" }}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribí un comentario..."
                        rows="3"
                        style={{
                            width: "100%",
                            padding: "10px",
                            resize: "none",
                            borderRadius: "5px"
                        }}
                    />
                    <button type="submit" className="form-button" style={{ marginTop: "10px" }}>
                        Comentar
                    </button>
                </form>
            ) : (
                <p>Iniciá sesión para comentar.</p>
            )}
        </div>
    );
}
