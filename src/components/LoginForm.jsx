import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import "../styles/loginForm.css"

const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required("El email es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria")
})

export default function LoginForm() {

    const navigate = useNavigate()
    const { login } = useContext(AuthContext)

    const handleSubmit = async (values, { resetForm }) => {
        const success = await login(values.email, values.password)

        if (success) {
            resetForm()
            setTimeout(() => navigate("/"), 1200)
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
                        <Button
                            type="button"
                            label="Cancelar"
                            className="navbar-links"
                            onClick={() => navigate("/")}
                        />
                    </Form>
                )}
            </Formik>
        </div>
    )
}
