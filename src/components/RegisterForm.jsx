import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import "../styles/RegisterForm.css"

const validationSchema = Yup.object({
    username: Yup.string().required("El nombre es obligatorio"),
    email: Yup.string().email("Email invalido").required("El email es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria"),
    role: Yup.string().required("La contraseña es obligatoria")
})

export default function RegisterForm() {

    const navigate = useNavigate()

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            })

            if (response.ok) {
                toast.success("Usuario registrado con éxito")
                resetForm()
                setTimeout(() => navigate('/'), 2000)
            } else {
                toast.error("Hubo un error al registrar el usuario")
                console.log(values)

            }
        } catch (error) {
            toast.error("Hubo un error con el servidor")
        }
    }

    return (
        <div className='register-container'>
            <h2>Crear cuenta</h2>
            <Formik
                initialValues={{ username: '', email: '', password: '',role:''}}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className='register-form'>
                        <div className='form-field'>
                            <label>Nombre</label>
                            <Field as={InputText} id='username' name='username' />
                            <ErrorMessage name='username' component='small' className='error' />
                        </div>

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
                        
                        <div className='form-field'>
                            <label>Role</label>
                            <Field as="select" id="role" name="role" className="input-select">
                                <option value="">Seleccionar un rol</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>

                            </Field>
                            <ErrorMessage name='role' component='small' className='error' />
                        </div>



                        <Button type='submit' label={isSubmitting ? "Registrando..." : "Registrarse"}    />
                        <Button
                            type="button"
                            label="Cancelar"
                            className="p-button-secondary"
                            onClick={() => navigate("/")}
                        />
                        
                    </Form>
                )}
            </Formik>
        </div>
    )
}
