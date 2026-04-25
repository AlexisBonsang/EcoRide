const GoogleLoginButton = () => {

    function handleGoogleLogin() {
        window.location.href = "http://localhost:8000/auth/social/google"
    }

    return (
        <div className="flex justify-center">
            <button
                onClick={handleGoogleLogin}
                className="flex items-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-full px-6 py-2 hover:shadow-md transition"
            >
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                />
                <span className="text-sm font-medium">Continuer avec Google</span>
            </button>
        </div>
    )
}

export default GoogleLoginButton
