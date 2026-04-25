import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function Register() {
    const navigate = useNavigate()
    const { setAuth } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [errors, setErrors] = useState({})
    const [globalError, setGlobalError] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        setErrors({})
        setGlobalError("")

        const res = await fetch("http://localhost:8000/auth/register/standard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, passwordConfirm }),
        })

        const data = await res.json()

        if (res.status === 422) {
            setErrors(data.errors ?? {})
            return
        }

        if (!res.ok) {
            setGlobalError(data.message ?? data.error ?? "Une erreur est survenue.")
            return
        }

        const { token } = data

        const userRes = await fetch("http://localhost:8000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
        const user = await userRes.json()

        setAuth(user, token)
        navigate("/landing")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white-950 p-4">
            <div className="card w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl">
                <div className="card-body p-8 space-y-6">

                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-bold text-white tracking-tight">Inscription</h1>
                        <p className="text-sm text-gray-400">Créez votre compte EcoRide</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Adresse email
                            </label>
                            <input
                                type="email"
                                placeholder="exemple@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-xs">{errors.email.join(" ")}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
                            />
                            {errors.password && (
                                <p className="text-red-400 text-xs">{errors.password.join(" ")}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
                            />
                            {errors.passwordConfirm && (
                                <p className="text-red-400 text-xs">{errors.passwordConfirm.join(" ")}</p>
                            )}
                        </div>

                        {globalError && (
                            <p className="text-red-400 text-sm text-center">{globalError}</p>
                        )}

                        <button
                            type="submit"
                            className="btn w-full bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl shadow-lg shadow-emerald-500/20 mt-2"
                        >
                            Créer mon compte
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400">
                        Déjà un compte ?{" "}
                        <Link to="/login" className="text-emerald-400 hover:underline">
                            Se connecter
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default Register
