import React, { createContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken)

                if (decoded.exp * 1000 > Date.now()) {
                    setUser(decoded)
                    setToken(storedToken)
                } 
                else {
                    localStorage.removeItem("token")
                }
            } catch (error) {
                console.error("Token inválido", error)
                localStorage.removeItem("token")
            }
        }
    }, [])

    const login = async (email, password) => {
    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        if (!response.ok) {
            toast.error("Credenciales incorrectas")
            return false
        }

        const data = await response.json()
        const jwtToken = data.access_token

        if (!jwtToken) {
            toast.error("No se recibió el token")
            return false
        }

        // Guardar token
        localStorage.setItem('token', jwtToken)

        // 🔥 Decodificar token para obtener datos del usuario
        const decoded = jwtDecode(jwtToken)

        const userData = {
            id: decoded.sub,          // viene en el claim "sub"
            email: decoded.email,     // claim agregado
            role: decoded.role        // claim agregado
        }

        // Guardar usuario
        setUser(userData)
        setToken(jwtToken)

        toast.success('Inicio de sesión exitoso')
        return true
    } catch (error) {
        console.error(error)
        toast.error("Hubo un error al iniciar sesión")
        return false
    }
}


    return (
        <AuthContext.Provider value={{ user, token, login }}>
            {children}
        </AuthContext.Provider>
    )
}
