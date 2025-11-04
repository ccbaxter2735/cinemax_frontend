import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../style/Form.css";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(method === "login");
  const navigate = useNavigate();

  const name = isLogin ? "Connexion" : "Inscription";
  const currentRoute = isLogin ? "/api/token/" : "/api/user/register/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post(currentRoute, { username, password });

      if (isLogin) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        localStorage.setItem("username", username);
        navigate("/");
      } else {
        alert("Compte créé avec succès ! Connecte-toi maintenant.");
        setIsLogin(true);
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.detail ||
          (isLogin
            ? "Erreur de connexion. Vérifie tes identifiants."
            : "Erreur lors de l'inscription.")
      );
      if (isLogin) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h1 className="auth-title">{name}</h1>

        <div className="auth-fields">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-input"
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="auth-button"
        >
          {loading ? "Chargement..." : name}
        </button>
        {/* Bloc d’avertissement Render */}
        <div className="mt-6 text-center px-4">
          <p className="text-sm text-gray-700 bg-gray-100 rounded-lg p-3 shadow-sm inline-block max-w-md">
            Le backend est hébergé sur un compte <strong>Render gratuit</strong>.<br />
            Merci de votre patience 🙏 : le premier chargement peut prendre <strong>30 à 60 secondes </strong> 
            avant que l’inscription ou la connexion soit pleinement active.
          </p>
        </div>

        <div className="auth-toggle">
          {isLogin ? (
            <>
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="auth-link"
              >
                S’inscrire
              </button>
            </>
          ) : (
            <>
              Déjà un compte ?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="auth-link"
              >
                Se connecter
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default Form;
