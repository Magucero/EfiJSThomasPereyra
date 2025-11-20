import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Form.css"   // reutilizamos el mismo estilo


export default function Review() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/posts/${id}`);
                const data = await res.json();
                setPost(data);
                console.log("traedatos")
            } catch (err) {
                console.error("Error al obtener el post:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <p className="form-container">Cargando post...</p>;

    if (!post) return <p className="form-container">Post no encontrado</p>;

    return (
        <div className="form-container">
            <h2 className="form-title">Detalle del Post</h2>

            <div className="post-card">
                <h3 className="post-title">{post.title}</h3>

                <p className="post-date">
                    Publicado: {new Date(post.date).toLocaleString()}
                </p>

                <p className="post-content">{post.content}</p>

                <p className="post-author">
                    Autor: <strong>{post.author}</strong>
                </p>

                <div className="review-buttons">
                    <button
                        className="form-button"
                        onClick={() => alert("Función editar próximamente")}
                    >
                        Editar
                    </button>

                    <button
                        className="form-button delete-button"
                        onClick={() => alert("Función eliminar próximamente")}
                    >
                        Eliminar
                    </button>

                    <button
                        className="form-button secondary-button"
                        onClick={() => navigate(-1)}
                    >
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
}
