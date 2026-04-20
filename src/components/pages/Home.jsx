function Home() {
    return (
        <div className="relative min-h-screen">
          <h1>Page Home</h1>
          <div className="badge badge-outline text-emerald-300 border-emerald-300 p-3">
            BCo-voiturage
          </div>
          <div className="badge badge-xl badge-success badge-outline rounded-full glass">Covoiturage</div>
          <div className="badge badge-xl badge-success badge-outline rounded-full glass">Micromobilité</div>

          <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">

    {/* Badge accroche */}
    <span className="badge badge-xl badge-success badge-outline rounded-full glass mb-6">
        Covoiturage & Micromobilité
    </span>

    {/* Titre principal */}
    <h1 className="text-6xl font-bold text-white leading-tight mb-4 color-neutral-100">
        Bougez autrement,<br />bougez ensemble.
    </h1>

    {/* Sous-titre */}
    <p className="text-gray-200 text-xl leading-relaxed max-w-xl">
        Trouvez un trajet partagé ou un vélo en libre-service
        près de chez vous en quelques secondes.
    </p>

</div>
        </div> 
    );
}

export default Home;