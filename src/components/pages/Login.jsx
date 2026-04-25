import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import GoogleLoginButton from "../button/Button"
import { useAuth } from "../contexts/AuthContext"

function Login() {

    const navigate = useNavigate()
    const { setAuth } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")

        const loginResponse = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        if (!loginResponse.ok) {
            setError("Email ou mot de passe incorrect.")
            return
        }

        const { token } = await loginResponse.json()

        const userResponse = await fetch("http://localhost:8000/api/users/me", {
            headers: { "Authorization": `Bearer ${token}` }
        })

        const user = await userResponse.json()
        setAuth(user, token)
        navigate("/landing")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white-950 p-4">

            {/* Cadre principal */}
            <div className="card w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl">

                {/* En-tête */}
                <div className="card-body p-8 space-y-6">
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-bold text-white tracking-tight">Connexion</h1>
                        <p className="text-sm text-gray-400">Bienvenue sur EcoRide</p>
                    </div>

                    {/* Champs du formulaire */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Identifiant
                            </label>
                            <input
                                type="text"
                                name="login"
                                placeholder="Adresse mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="btn w-full bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl shadow-lg shadow-emerald-500/20 mt-2">
                            Se connecter
                        </button>
                    </form>

                    {/* Séparateur */}
                    <div className="divider text-gray-600 text-xs">OU</div>

                    {/* Bouton Google */}
                    <div><GoogleLoginButton /></div>

                    <p className="text-center text-sm text-gray-400">
                        Pas encore de compte ?{" "}
                        <Link to="/register" className="text-emerald-400 hover:underline">
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </div>

        </div>
    )
}

export default Login


