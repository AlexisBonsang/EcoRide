import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import GoogleLoginButton from "../button/Button"
import FacebookButton from "../button/FacebookButton"

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[^a-zA-Z0-9]).{7,}$/

function Register() {
    const navigate = useNavigate()
    const { setAuth } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [rgpd, setRgpd] = useState(false)
    const [errors, setErrors] = useState({})
    const [globalError, setGlobalError] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        setErrors({})
        setGlobalError("")

        const localErrors = {}

        if (!PASSWORD_REGEX.test(password)) {
            localErrors.password = ["Le mot de passe doit contenir au moins 7 caractères, 1 chiffre et 1 caractère spécial."]
        }
        if (password !== passwordConfirm) {
            localErrors.passwordConfirm = ["Les mots de passe ne correspondent pas."]
        }
        if (Object.keys(localErrors).length > 0) {
            setErrors(localErrors)
            return
        }

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

        const { token, refresh_token } = data

        const userRes = await fetch("http://localhost:8000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
        const user = await userRes.json()

        setAuth(user, token, refresh_token)
        navigate("/profile")
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
                                required
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
                                required
                                className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
                            />
                            <p className="text-gray-500 text-xs">
                                Minimum 7 caractères, dont 1 chiffre et 1 caractère spécial.
                            </p>
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
                                required
                                className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
                            />
                            {errors.passwordConfirm && (
                                <p className="text-red-400 text-xs">{errors.passwordConfirm.join(" ")}</p>
                            )}
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rgpd}
                                onChange={e => setRgpd(e.target.checked)}
                                required
                                className="checkbox checkbox-sm mt-0.5 border-white/30"
                            />
                            <span className="text-xs text-gray-400 leading-relaxed">
                                J'accepte le traitement de mes données personnelles conformément à la{" "}
                                <span className="text-emerald-400">politique de confidentialité</span>{" "}
                                d'EcoRide (RGPD).
                            </span>
                        </label>

                        {globalError && (
                            <p className="text-red-400 text-sm text-center">{globalError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={!rgpd}
                            className="btn w-full bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl shadow-lg shadow-emerald-500/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Créer mon compte
                        </button>
                    </form>

                    <div className="divider text-gray-600 text-xs">OU</div>

                    <div className="space-y-3">
                        <GoogleLoginButton label="S'inscrire avec Google" />
                        <FacebookButton label="S'inscrire avec Facebook" />
                    </div>

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
