import { createContext, useState, useContext } from "react";

const AuthContext = createContext();        // Crée un nouvel objet context
export const AuthProvider = ({ children }) => {    // Gère l'état de l'utilisateur et les méthodes pour le mettre à jour
  const [user, setUser] = useState(null);   // Etat qui stock l'utilisateur, null par défaut
  const setAuth = (authUser) => {           // Récupère et sotck le nouveau utilisateur
    setUser(authUser);
  };
  const setUserData = (data) => {
    setUser({ ...data });
  };
  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
// Custom hook for accessing the AuthContext
export const useAuth = () => useContext(AuthContext); 

