import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

function Home() {

    const [count, setCount] = useState(0);  
    useEffect(() => {                       
        const interval = setInterval(() => {
            setCount(prevCount => prevCount + 1);
        }, 1000);
          return () => clearInterval(0);
    }, []);
    return (      
        <div className="relative min-h-screen">
            <div className="flex fixed top-4 right-4">
                <Link
                to="/login"
                className="mt-6 btn btn-success btn-ghost btn-lg rounded-full px-8 text-white font-semibold">
                Se connecter / S'inscrire
                </Link>

            </div>
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">

                {/* Badge accroche */}
                <span className="badge badge-xl badge-success badge-outline rounded-full glass mb-6">
                    Covoiturage & Micromobilité
                </span>

                {/* Titre principal */}
                <h1 className="text-6xl font-bold text-white leading-tight mb-4 ">
                    Nous plantons 1 arbre par trajet !<br />Contribue à un monde meilleur.
                </h1>

                {/* Sous-titre */}
                <p className="text-gray-200 text-xl leading-relaxed max-w-xl">
                    Trouvez un trajet partagé ou un vélo en libre-service
                    près de chez vous en quelques secondes.
                </p>

                {/* Compteur */ }
                <div className="badge badge-xl badge-success badge-outline rounded-full glass mb-6">
                    <h1>Arbre planté depuis le début de ta visite : {count}</h1> 
                </div>                
            </div>
        </div> 
    );
}

export default Home;