import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Form.css";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        content: "",
        author: ""
    });

    const [loading, setLoading] = useState(true);

    // Obtener datos del post a editar
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/posts/${id}`);
                const data = await res.json();

                setForm({
                    title: data.title,
                    content: data.content,
                    author: data.author
                });
            } catch (error) {
                console.error("Error al cargar post:", error);
                alert("No se pudo cargar el post");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    // Manejar inputs
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Enviar cambios a la API (PUT)
    const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Error al actualizar");
        }

        alert("Post actualizado correctamente");
        navigate(`/review/${id}`);
    } catch (error) {
        alert(error.message);
    }
};


    if (loading) return <p className="form-container">Cargando...</p>;

    return (
        <div className="form-container">
            <h2 className="form-title">Editar Post</h2>

            <form className="form" onSubmit={handleSubmit}>
                <label>Título</label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <label>Contenido</label>
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows="5"
                    required
                ></textarea>

                <label>Autor</label>
                <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    required
                />

                <button className="form-button" type="submit">
                    Guardar cambios
                </button>

                <button
                    type="button"
                    className="form-button secondary-button"
                    onClick={() => navigate(-1)}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
}
