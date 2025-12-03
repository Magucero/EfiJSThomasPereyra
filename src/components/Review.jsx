import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Form.css";
import Comments from "../components/Comments";


// ------------------------------------------------------------
// 🔓 Función para decodificar el token JWT
// ------------------------------------------------------------
function decodeToken(token) {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    } catch (e) {
        return null;
    }
}

export default function Review() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    // Errores de validación
    const [errors, setErrors] = useState({
        title: "",
        content: ""
    });

    const token = localStorage.getItem("token");
    const user = token ? decodeToken(token) : null;

    // Obtener POST
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/posts/${id}`);
                const data = await res.json();
                setPost(data);
            } catch (err) {
                console.error("Error al obtener el post:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    // Permisos → ¿Puede editar o eliminar?
    const canEditOrDelete =
        user &&
        (user.role === "admin" || user.id === post?.author_id); // <--- usa el author_id del backend

    // Validación
    const validate = () => {
        let newErrors = { title: "", content: "" };
        let valid = true;

        if (!post.title.trim()) {
            newErrors.title = "El título no puede estar vacío";
            valid = false;
        }

        if (!post.content.trim()) {
            newErrors.content = "El contenido no puede estar vacío";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleEdit = async () => {
        if (!validate()) return;

        try {
            const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: post.title,
                    content: post.content
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "No autorizado para editar");
                return;
            }

            alert("Post actualizado correctamente");
            setEditing(false);
            setErrors({ title: "", content: "" });

        } catch (err) {
            console.error(err);
            alert("Error al conectar con la API");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("¿Seguro que querés eliminar este post?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "Error al eliminar");
                return;
            }

            alert("Post eliminado");
            navigate("/");

        } catch (error) {
            console.error(error);
            alert("Error al conectar con la API");
        }
    };


    // Vista de carga / error
    if (loading) return <p className="form-container">Cargando post...</p>;
    if (!post) return <p className="form-container">Post no encontrado</p>;

    return (
        <div className="form-container">
            <h2 className="form-title">Detalle del Post</h2>

            <div className="post-card">

                {/* --------------------------------
                      MODO EDICIÓN
                -------------------------------- */}
                {editing ? (
                    <>
                        <input
                            className="form-input"
                            value={post.title}
                            onChange={(e) =>
                                setPost({ ...post, title: e.target.value })
                            }
                        />
                        {errors.title && (
                            <small className="error">{errors.title}</small>
                        )}

                        <textarea
                            className="form-textarea"
                            value={post.content}
                            onChange={(e) =>
                                setPost({ ...post, content: e.target.value })
                            }
                        />
                        {errors.content && (
                            <small className="error">{errors.content}</small>
                        )}

                        <div className="review-buttons">
                            <button className="form-button" onClick={handleEdit}>
                                Guardar
                            </button>

                            <button
                                className="form-button secondary-button"
                                onClick={() => {
                                    setEditing(false);
                                    setErrors({ title: "", content: "" });
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* --------------------------------
                              MODO LECTURA
                        -------------------------------- */}
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-date">
                            Publicado: {new Date(post.date).toLocaleString()}
                        </p>
                        <p className="post-content">{post.content}</p>
                        <p className="post-author">
                            Autor: <strong>{post.author}</strong>
                        </p>

                        <div className="review-buttons">
                            {canEditOrDelete && (
                                <>
                                    <button
                                        className="form-button"
                                        onClick={() => setEditing(true)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="form-button delete-button"
                                        onClick={handleDelete}
                                    >
                                        Eliminar
                                    </button>
                                </>
                            )}

                            <button
                                className="form-button secondary-button"
                                onClick={() => navigate(-1)}
                            >
                                Volver
                            </button>
                        </div>
                    </>
                )}

                {/* --------------------------------------------------
                        COMPONENTE DE COMENTARIOS (AUTOMÁTICO)
                -------------------------------------------------- */}
                <Comments postId={id} />


            </div>
        </div>
    );
}
