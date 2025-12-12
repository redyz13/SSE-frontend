import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { addUser } from "../services/utenti";
import logoNonDaltonici from "../image/Logo.png";
import logoDaltonici from "../image/RentlyFinaleDaltonici.png";
import image1 from "../image/ondina1.svg";
import image2 from "../image/onda3.svg";
import image3 from "../image/onda4.svg";
import "../style/Signup.css";
import { Alert, Box, Snackbar } from "@mui/material";

const Signup = () => {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [logo, setLogo] = useState(logoNonDaltonici);
  const { login, daltonico } = useAuth();
  const navigate = useNavigate();

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
    setAlertMessage(message);
    handleClick();
  };

  useEffect(() => {
    setLogo(daltonico ? logoDaltonici : logoNonDaltonici);
  }, [daltonico]);

  const handleSignup = async (e) => {
    e?.preventDefault();

    const _nome = nome.trim();
    const _cognome = cognome.trim();
    const _email = email.trim();
    const _username = username.trim();
    const _password = password.trim();
    const _confPassword = confPassword.trim();

    if (
      !_nome ||
      !_cognome ||
      !_email ||
      !_username ||
      !_password ||
      !_confPassword
    ) {
      handleAlert("error", "Inserire tutti i campi");
      return;
    }
    if (_password !== _confPassword) {
      handleAlert("error", "Password non coincidenti");
      return;
    }

    const newUser = {
      nome: _nome,
      cognome: _cognome,
      email: _email,
      username: _username,
      password: _password,
      premium: false,
    };

    try {
      setLoading(true);
      const response = await addUser(newUser);
      if (response.ok) {
        const created = await response.json();
        if (created) {
          login(created);
          navigate("/");
        } else {
          handleAlert("error", "Credenziali non valide");
        }
      } else {
        let msg = "";
        try {
          const data = await response.json();
          msg = data?.message;
        } catch {
          msg = await response.text();
        }
        handleAlert("error", msg || "Errore durante la registrazione");
      }
    } catch {
      handleAlert("error", "Errore di rete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Page signup-centered">
      <Box className="signup-box">
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
            className="signup-alert"
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>

      <img className="topr" src={image3} alt="Immagine decorativa" />

      <form className="box1" onSubmit={handleSignup} noValidate>
        <div className="image-box1">
          <img src={image1} alt="Immagine decorativa" />
          <div className="titolo">Registrati a </div>
          <div className="Logo-box">
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>
            <div className="brand-name">ently</div>
          </div>
          <img className="mirror-x" src={image1} alt="Immagine decorativa" />
        </div>

        <div className="par">
          <p>
            Inizia subito a dare valore agli oggetti, risparmia e sii
            sostenibile con Rently:
          </p>
          <p>noleggio intelligente, guadagno costante.</p>
        </div>

        <div className="params">
          <div className="param">
            <p>Nome</p>
            <input
              type="text"
              value={nome}
              placeholder="Inserisci il tuo nome"
              onChange={(e) => setNome(e.target.value)}
              required
              autoComplete="given-name"
            />
          </div>

          <div className="param">
            <p>Cognome</p>
            <input
              type="text"
              value={cognome}
              placeholder="Inserisci il tuo cognome"
              onChange={(e) => setCognome(e.target.value)}
              required
              autoComplete="family-name"
            />
          </div>

          <div className="param">
            <p>Username</p>
            <input
              type="text"
              value={username}
              placeholder="Inserisci il tuo username"
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="param">
            <p>Email</p>
            <input
              type="email"
              value={email}
              placeholder="Inserisci la tua email"
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="param">
            <p>Password</p>
            <input
              type="password"
              value={password}
              placeholder="Inserisci la tua password"
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="param">
            <p>Conferma Password</p>
            <input
              type="password"
              value={confPassword}
              placeholder="Conferma la tua password"
              onChange={(e) => setConfPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        <button className="pulsante" type="submit" disabled={loading}>
          {loading ? "Registrazione..." : "Registrati"}
        </button>

        <div className="opzioni">
          <p>
            Hai già un account? <Link to="/login">Accedi</Link>
          </p>
          <p>
            Torna alla <Link to="/">home</Link>
          </p>
        </div>
      </form>

      <img className="bottoml" src={image2} alt="Immagine decorativa" />
    </div>
  );
};

export default Signup;
