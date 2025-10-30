import { Navigate } from 'react-router-dom'
import { useState, useEffect, use } from 'react'
// import { useAuth } from '../hooks/useAuth'
import { jwtDecode } from 'jwt-decode'
import api from '../api'
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants'

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(() => {
        auth().catch(() => {
            setIsAuthenticated(false)
        })
    }, [])
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const response = await api.post('/api/token/refresh/', { refresh: refreshToken })
            if (response.status !== 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access)
                setIsAuthenticated(true)
            } else {
                // localStorage.removeItem(ACCESS_TOKEN)
                // localStorage.removeItem(REFRESH_TOKEN)
                setIsAuthenticated(false)
            }


        } catch (error) {
            console.log(error)
            setIsAuthenticated(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthenticated(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Math.floor(Date.now() / 1000)
        if (tokenExpiration < now) {
            await refreshToken()
        } else {
            setIsAuthenticated(true)
        }

    }

    if (isAuthenticated === null) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-600 to-green-400 text-white text-center px-6">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mb-6"></div>
                <h1 className="text-2xl font-bold mb-2">Démarrage du serveur...</h1>
                <p className="text-lg max-w-md">
                    Le backend est hébergé sur un compte <strong>Render gratuit</strong>.
                    Il peut falloir <strong>30 à 60 secondes</strong> avant qu’il se réveille.
                </p>
                <p className="mt-4 text-sm opacity-80">
                    Merci de patienter, la magie du cinéma arrive 🎬
                </p>
            </div>
        );
    }
    return isAuthenticated ? children : <Navigate to="/login" />
}

export default ProtectedRoute