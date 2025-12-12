import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Box, Snackbar } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getPremiumAds } from "../services/annunciNoleggio";
import ondina1 from "../image/ondinaprova1.svg";
import ondina2 from "../image/ondinaprova2.svg";
import ondaBassa from "../image/onda2nuovo1.svg";
import ondaAlta from "../image/onda2nuovo2.svg";
import "../style/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [annunci, setAnnunci] = useState([]);
  const [activeIndex, setActiveIndex] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [feedback, setFeedback] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const triggerAlert = (severity, message) => {
    setFeedback({ open: true, severity, message });
  };

  const handleCloseFeedback = (event, reason) => {
    if (reason === "clickaway") return;
    setFeedback((prev) => ({ ...prev, open: false }));
  };

  const handleSearch = () => {
    navigate(`/catalogo/${searchTerm}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const nextSlide = () => {
    if (annunci.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % annunci.length);
  };

  const prevSlide = () => {
    if (annunci.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + annunci.length) % annunci.length);
  };

  const getSlideClass = useCallback(
    (index) => {
      const len = annunci.length;
      if (len === 0) return "inactive";

      if (len < 3) return "secondo";

      const prevIndex = (activeIndex - 1 + len) % len;
      const nextIndex = (activeIndex + 1) % len;

      if (index === prevIndex) return "primo";
      if (index === activeIndex) return "secondo";
      if (index === nextIndex) return "terzo";

      return "inactive";
    },
    [activeIndex, annunci.length]
  );

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await getPremiumAds();
        if (response.ok) {
          const data = await response.json();
          setAnnunci(Array.isArray(data) ? data : []);
        } else {
          let msg = "Errore nel caricamento degli annunci";
          try {
            const json = await response.json();
            msg = json.message || msg;
          } catch {}
          triggerAlert("error", msg);
        }
      } catch (error) {
        triggerAlert("error", "Errore di connessione al server");
      }
    };

    fetchAds();
  }, []);

  const isLoaded = annunci.length > 0;

  return (
    <div className="Page">
      <Navbar />

      <Box className="home-box">
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={feedback.open}
          autoHideDuration={4000}
          onClose={handleCloseFeedback}
        >
          <Alert
            onClose={handleCloseFeedback}
            severity={feedback.severity}
            variant="filled"
            className="home-alert"
          >
            {feedback.message}
          </Alert>
        </Snackbar>
      </Box>

      <main className="sezioneh">
        <img className="imaget" src={ondaAlta} alt="" aria-hidden="true" />

        <div className="intestazione">
          <h2>Home</h2>

          <div className="descrizione">
            <p>Rently apre le porte al futuro dell'economia sostenibile:</p>
            <p>
              <span className="bold">risparmi</span> denaro evitando acquisti
              occasionali e <span className="bold">guadagni</span> su ciò che
              non usi
            </p>
            <p>
              mettendolo a <span className="bold">noleggio</span>.
            </p>
          </div>

          <div className="ricerca">
            <h4>Cerca il tuo prossimo noleggio</h4>
            <input
              type="text"
              placeholder="Cerca un articolo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="imagebox">
              <img className="imager" src={ondina1} alt="" aria-hidden="true" />
              <img className="imagel" src={ondina2} alt="" aria-hidden="true" />
              <button onClick={handleSearch} className="cerca-button">
                Cerca
              </button>
            </div>
          </div>
        </div>

        <div className="annunciHome">
          <p>Annunci in evidenza</p>

          <div className="slider">
            <button
              onClick={prevSlide}
              disabled={!isLoaded}
              aria-label="Annuncio precedente"
              className="nav-arrow"
            >
              <ArrowBackIosIcon />
            </button>

            {isLoaded && (
              <div className="listaAnnunciHome">
                {annunci.map((ad, index) => (
                  <Link
                    className={getSlideClass(index)}
                    to={`/dettagli/${ad.id}`}
                    key={ad.id}
                  >
                    <div className="card">
                      <img
                        src={ad.immagine}
                        alt={`Immagine di ${ad.nome}`}
                        loading="lazy"
                      />
                      <div className="card-description">
                        <p>{ad.nome}</p>
                        <h6>€ {ad.prezzo}/giorno</h6>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <button
              onClick={nextSlide}
              disabled={!isLoaded}
              aria-label="Annuncio successivo"
              className="nav-arrow"
            >
              <ArrowForwardIosIcon />
            </button>
          </div>

          <Link className="scopri" to="/catalogo">
            Scopri altri annunci
          </Link>
        </div>

        <img className="imageb" src={ondaBassa} alt="" aria-hidden="true" />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
