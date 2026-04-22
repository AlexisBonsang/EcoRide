import { GoogleLogin, googleLogout } from "@react-oauth/google"       // Composant qui rend la connexion
import { jwtDecode } from "jwt-decode"                  // Composant qui récupère les infos de l'utilisateur via le token JSON
import { useNavigate } from "react-router-dom"          // Redirection vers page d'acceuil
import GoogleLoginButton from "../button/Button"       // Composant du bouton de connexion Google

function Login() {

    const navigate = useNavigate()      // Hook reactRouter

    function handleLogout() {           // Gestion déconnexion
        googleLogout()
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
                    <form className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Identifiant
                            </label>
                            <input
                                type="text"
                                name="login"
                                placeholder="Adresse mail"
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
                                className="input w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none rounded-xl"
                            />
                        </div>

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
                </div>
            </div>

        </div>
    )
}

export default Login


