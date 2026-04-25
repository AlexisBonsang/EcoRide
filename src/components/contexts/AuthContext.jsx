import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

function decodeJwt(token) {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}

function isTokenExpired(token) {
    const payload = decodeJwt(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function restoreSession() {
            const storedToken = localStorage.getItem("token");
            const storedRefresh = localStorage.getItem("refresh_token");
            const storedUser = localStorage.getItem("user");

            if (!storedToken) {
                setLoading(false);
                return;
            }

            if (!isTokenExpired(storedToken)) {
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

                    if (res.ok) {
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

    function persistAuth(authUser, authToken, refreshToken) {
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(authUser));
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
        setToken(authToken);
        setUser(authUser);
    }

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

    const setUserData = (data) => {
        const updated = { ...data };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
    };

    const logout = () => clearAuth();

    return (
        <AuthContext.Provider value={{ user, token, loading, setAuth, setUserData, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

