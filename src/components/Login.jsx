import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { getUserByEmailAndPassword } from "../services/utenti";
import logoNonDaltonici from "../image/Logo.png";
import logoDaltonici from "../image/RentlyFinaleDaltonici.png";
import "../style/Login.css";
import image1 from "../image/ondinaprova1.svg";
import image2 from "../image/ondinaprova2.svg";
import image3 from "../image/ondadoppia1.svg";
import image4 from "../image/ondadoppia2.svg";
import { Alert, Box, Snackbar } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, daltonico } = useAuth();
  const navigate = useNavigate();
  const [logo, setLogo] = useState(logoNonDaltonici);

  const [alertState, setAlertState] = useState("error");
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => setOpen(true);
  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleAlert = (state, message) => {
    setAlertState(state);
    setAlertMessage(message || "");
    handleClick();
  };

  useEffect(() => {
    setLogo(daltonico ? logoDaltonici : logoNonDaltonici);
  }, [daltonico]);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!username.trim() || !password.trim()) {
      handleAlert("error", "Inserisci sia email che password");
      return;
    }

    try {
      setLoading(true);
      const response = await getUserByEmailAndPassword(username, password);
      if (response.ok) {
        const newUser = await response.json();
        if (newUser) {
          login(newUser);
          navigate("/");
        } else {
          handleAlert("error", "Errore durante il login");
        }
      } else {
        let msg = "";
        try {
          const data = await response.json();
          msg = data?.message;
        } catch {
          msg = await response.text();
        }
        handleAlert("error", msg || "Credenziali non valide");
      }
    } catch {
      handleAlert("error", "Errore di rete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Page login-centered">
      <Box className="login-box">
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={alertState}
            variant="filled"
            className="login-alert"
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>

      <img className="top" src={image4} alt="Immagine decorativa" />

      <form className="box" onSubmit={handleLogin}>
        <div className="image-box">
          <img className="right" src={image1} alt="Immagine decorativa" />
          <img className="left" src={image2} alt="Immagine decorativa" />
          <div className="Logo-box">
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>
            <div className="brand-name">ently</div>
          </div>
        </div>

        <div className="titolo">Accedi</div>

        <div className="parametro">
          <p>Email</p>
          <input
            type="email"
            value={username}
            placeholder="Inserisci la tua email"
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="parametro">
          <p>Password</p>
          <input
            type="password"
            value={password}
            placeholder="Inserisci la tua password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button className="pulsante" type="submit" disabled={loading}>
          {loading ? "Accesso..." : "Accedi"}
        </button>

        <div className="opzioni">
          <p>
            Non hai ancora un account? <Link to="/signup">Registrati</Link>
          </p>
          <p>
            Torna alla <Link to="/">home</Link>
          </p>
        </div>
      </form>

      <img className="bottom" src={image3} alt="Immagine decorativa" />
    </div>
  );
};

export default Login;
