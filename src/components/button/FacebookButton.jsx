const FacebookButton = ({ label = "Continuer avec Facebook" }) => {

    function handleFacebookLogin() {
        window.location.href = "http://localhost:8000/auth/social/facebook"
    }

    return (
        <div className="flex justify-center">
            <button
                onClick={handleFacebookLogin}
                className="flex items-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-full px-6 py-2 hover:shadow-md transition"
            >
                <img
                    src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                    alt="Facebook"
                    className="w-5 h-5"
                />
                <span className="text-sm font-medium">{label}</span>
            </button>
        </div>
    )
}

export default FacebookButton
