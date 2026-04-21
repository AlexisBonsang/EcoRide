import { GoogleLogin, googleLogout } from "@react-oauth/google"       // Composant qui rend la connexion
import { jwtDecode } from "jwt-decode"                  // Composant qui récupère les infos de l'utilisateur via le token JSON
import { useNavigate } from "react-router-dom"          // Redirection vers page d'acceuil

function Login() {

    const navigate = useNavigate()      // Hook reactRouter

    function handleLogout() {           // Gestion déconnexion
        googleLogout()
    }

    return (
        <>
        <h1>Page login</h1>
        <form>
            <input type="text" name="login" placeholder="Nom d'utilisateur" />
            <input type="password" name="password" placeholder="Mot de passe" />
        </form>
        <GoogleLogin 
        onSuccess={(credentialResponse) => {        // Reçoit le token JWT de l'utilisateur connecté
            console.log(jwtDecode(credentialResponse.credential))   // Affiche les infos utilisateur     
            navigate("/Landing")
        }} 
        onError={() => console.log("Connexion échouée")}
        // auto_select={true}
        /> 
        </> 
    )
}

export default Login