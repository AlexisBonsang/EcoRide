import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'



// Bouton google
const GoogleLoginButton = () => {
    const navigate = useNavigate()

    function handleSuccess(credentialResponse) {
        console.log(jwtDecode(credentialResponse.credential))
        navigate("/Landing")
    }

    function handleError() {
        console.log("Connexion échouée")
    }

    return (
        <div className="flex justify-center overflow-hidden rounded-full">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="filled_blue"
                shape="pill"
            />
        </div>
    )
}

export default GoogleLoginButton