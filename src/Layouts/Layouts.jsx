export default function Layout({ children }) {
    return (
            <div className="background relative min-h-screen">
                {/* Image de fond */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: "url('/logo.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat"
                    }}
                />    
                {/* Contenu */}
                <div className="relative z-10">
                    {/* votre formulaire ici */}
                    {children}
                </div>
            </div>
    );
}