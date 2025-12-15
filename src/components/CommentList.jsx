import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/comentList.css"



export default function CommentList({ postId, refresh }) {
    const { id } = useParams(); // id del POST
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    // edición
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [error, setError] = useState("");

    // -----------------------------
    //   GET comentarios del post
    // -----------------------------
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/posts/${postId}/comments`
                );
                const data = await res.json();
                setComments(data);
            } catch (err) {
                console.error("Error al obtener comentarios:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId, refresh]);

    // -----------------------------
    //   PUT comentario
    // -----------------------------
    const handleEdit = async (commentId) => {
        if (!editContent.trim()) {
            setError("El comentario no puede estar vacío");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(
                `http://localhost:5000/api/comments/${commentId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        contenido: editContent
                    })
                }
            );

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "No autorizado para editar");
                return;
            }

            // actualizar comentario local
            setComments((prev) =>
                prev.map((c) =>
                    c.id === commentId
                        ? { ...c, contenido: editContent }
                        : c
                )
            );

            setEditingId(null);
            setEditContent("");
            setError("");
        } catch (err) {
            console.error(err);
            alert("Error al conectar con la API");
        }
    };

    // -----------------------------
    //   DELETE comentario
    // -----------------------------
    const handleDelete = async (commentId) => {
        if (!window.confirm("¿Eliminar este comentario?")) return;

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(
                `http://localhost:5000/api/comments/${commentId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "Error al eliminar");
                return;
            }

            setComments((prev) =>
                prev.filter((c) => c.id !== commentId)
            );
        } catch (err) {
            console.error(err);
            alert("Error al conectar con la API");
        }
    };

    if (loading) return <p className="form-container">Cargando comentarios...</p>;

    return (
        <div className="form-container-comentarios">
            <h3 className="comentarios">Comentarios</h3>

            {comments.length === 0 && (
                <p>No hay comentarios aún</p>
            )}

            {comments.map((comment) => (
                <div key={comment.id} className="post-card">

                    {editingId === comment.id ? (
                        <>
                            <textarea
                                className="form-textarea"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />

                            {error && <small className="error">{error}</small>}

                            <div className="review-buttons">
                                <button
                                    className="form-button"
                                    onClick={() => handleEdit(comment.id)}
                                >
                                    Guardar
                                </button>

                                <button
                                    className="form-button secondary-button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setError("");
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="post-content">
                                {comment.contenido}
                            </p>

                            <p className="post-title">
                                Autor: <strong>{comment.autor}</strong>
                            </p>

                            <p className="post-date">
                                {new Date(comment.date).toLocaleString()}
                            </p>

                            <div className="review-buttons">
                                <button
                                    className="form-button"
                                    onClick={() => {
                                        setEditingId(comment.id);
                                        setEditContent(comment.contenido);
                                    }}
                                >
                                    Editar
                                </button>

                                <button
                                    className="form-button delete-button"
                                    onClick={() => handleDelete(comment.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
