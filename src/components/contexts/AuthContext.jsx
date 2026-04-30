import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

function decodeJwt(token) {
    try {
        return JSON.parse(atob(token.split(".")[1])); // Isole le paylod et le décode 
    } catch {
        return null;    // Renvois null si token malformé ou erreur de décodage 
    }
}

function isTokenExpired(token) {  // Evite d'envoyer un token périmé au back 
    const payload = decodeJwt(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;  // Vérif + conversion s en ms 
}

// Persistance connexion + gestion du token + rafraichissement automatique 
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);   
    const [token, setToken] = useState(null); 
    const [loading, setLoading] = useState(true); // Si loading = null ==> bypass des vérif (voir AppRoutes)

    useEffect(() => {
        async function restoreSession() {   // Vérif du localStorage pour restauration de session
            const storedToken = localStorage.getItem("token");
            const storedRefresh = localStorage.getItem("refresh_token");
            const storedUser = localStorage.getItem("user");

            if (!storedToken) { // Pas de token stocké : pas de session à restaurer
                setLoading(false);
                return;
            }

            if (!isTokenExpired(storedToken)) { // Token valide : on restaure la session
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                setLoading(false);
                return;
            }

            // Token expiré : tentative de refresh
            if (storedRefresh) {
                try {
                    const res = await fetch("http://localhost:8000/api/token/refresh", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ refresh_token: storedRefresh }),
                    });

                    if (res.ok) { // Refresshh ok : on update
                        const { token: newToken, refresh_token: newRefresh } = await res.json();
                        const userRes = await fetch("http://localhost:8000/api/users/me", {
                            headers: { Authorization: `Bearer ${newToken}` },
                        });
                        const freshUser = await userRes.json();
                        persistAuth(freshUser, newToken, newRefresh);
                        setLoading(false);
                        return;
                    }
                } catch { /* refresh échoué */ }
            }

            // Refresh impossible : on efface tout
            clearAuth();
            setLoading(false);
        }

        restoreSession();
    }, []);

    // Sauvegarde l'auth dans le localStorage
    function persistAuth(authUser, authToken, refreshToken) {
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(authUser));
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken); // Evite un refresh inutile
        setToken(authToken);
        setUser(authUser);
    }

    // Nettoyage de l'auth à la déconnexion ou refresh échoué
    function clearAuth() {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }


    const setAuth = (authUser, authToken, refreshToken = null) => {
        persistAuth(authUser, authToken, refreshToken);
    };

    // Bonne pratique (mise a jour des données utilisateur sans toucher au token)
    const setUserData = (data) => {
        const updated = { ...data };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
    };

    // Déconnexion
    const logout = async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
            try {
                await fetch("http://localhost:8000/auth/logout", {    // Déconnexion propre
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                });
            } catch { /* serveur injoignable, on déconnecte quand même */ }
        }
        clearAuth();
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, setAuth, setUserData, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

