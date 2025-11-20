import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { toast } from "react-toastify";
import "../styles/postForm.css"; // estilos unificados
import PostList from "./PostList";

const validationSchema = Yup.object({
    title: Yup.string()
        .required("El título es obligatorio")
        .min(3, "Debe tener al menos 3 caracteres")
        .max(100, "Máximo 100 caracteres"),
    content: Yup.string()
        .required("El contenido es obligatorio")
        .min(5, "Debe tener al menos 5 caracteres"),
});

export default function PostForm() {
    const handleSubmit = async (values, { resetForm }) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                toast.success("Post creado con éxito");
                resetForm();
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Error al crear el post");
            }
        } catch (error) {
            toast.error("Error de conexión con el servidor");
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Crear nuevo post</h2>

            <Formik
                initialValues={{ title: "", content: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="form-content">
                        <div className="form-field">
                            <label>Título</label>
                            <Field
                                as={InputText}
                                id="title"
                                name="title"
                                placeholder="Título del post"
                            />
                            <ErrorMessage name="title" component="small" className="error" />
                        </div>

                        <div className="form-field">
                            <label>Contenido</label>
                            <Field
                                as={InputTextarea}
                                id="content"
                                name="content"
                                rows={5}
                                autoResize
                                placeholder="Escribe tu contenido aquí..."
                            />
                            <ErrorMessage name="content" component="small" className="error" />
                        </div>

                        <Button
                            type="submit"
                            label={isSubmitting ? "Publicando..." : "Publicar"}
                            className="form-button"
                        />
                    </Form>
                )}
            </Formik>
            <PostList></PostList>
        </div>
    );
}

