import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import "../styles/RegisterForm.css"   // reutilizamos el mismo estilo

const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required("El email es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria")
})

export default function LoginForm() {

    const navigate = useNavigate()

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            })

            if (response.ok) {
                const data = await response.json()

                toast.success("Inicio de sesión exitoso")
                resetForm()

                // Guardás el token si lo mandás desde el backend
                if (data.access_token) {
                    localStorage.setItem("token", data.access_token)
                }

                setTimeout(() => navigate("/"), 1500)
            } else {
                const error = await response.json()
                toast.error(error?.error || "Credenciales incorrectas")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error al conectar con el servidor")
        }
    }

    return (
        <div className='register-container'>
            <h2>Iniciar Sesión</h2>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className='register-form'>
                        <div className='form-field'>
                            <label>Email</label>
                            <Field as={InputText} id='email' name='email' />
                            <ErrorMessage name='email' component='small' className='error' />
                        </div>

                        <div className='form-field'>
                            <label>Contraseña</label>
                            <Field
                                as={InputText}
                                type='password'
                                id='password'
                                name='password'
                            />
                            <ErrorMessage name='password' component='small' className='error' />
                        </div>

                        <Button 
                            type='submit'
                            label={isSubmitting ? "Ingresando..." : "Iniciar Sesión"} 
                        />
                    </Form>
                )}
            </Formik>
        </div>
    )
}
