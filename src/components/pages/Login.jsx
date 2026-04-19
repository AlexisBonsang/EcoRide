import { GoogleLogin, googleLogout } from "@react-oauth/google"       // Composant qui rend la connexion
import { jwtDecode } from "jwt-decode"                  // Composant qui récupère les infos de l'utilisateur via le token JSON
import { useNavigate } from "react-router-dom"          // Redirection vers page d'acceuil

function Login() {

    const navigate = useNavigate()      // Hook reactRouter

    function handleLogout() {           // Gestion déconnexion
        googleLogout()
    }

    return (
        <h1>Page d'acceuil connecté</h1>,
        <GoogleLogin 
        onSuccess={(credentialResponse) => {        // Reçoit le token JWT de l'utilisateur connecté
            console.log(jwtDecode(credentialResponse.credential))   // Affiche les infos utilisateur     
            navigate("/Landing")
        }} 
        onError={() => console.log("Connexion échouée")}
        // auto_select={true}
        />  
    )
}

export default Login