import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useAuth } from "../AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Loader from "./Loader";
import RichiestaNoleggio from "./RichiestaNoleggio";
import Chat from "./Chat";
import { Alert, Box, Snackbar } from "@mui/material";
import Rating from "@mui/material/Rating";
import Slider from "@mui/material/Slider";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getAdById } from "../services/annunciNoleggio";
import { getUserById } from "../services/utenti";
import { getObjectValutationsByAnnuncioId } from "../services/valutazioneOggetto";
import { getMessagesByUsersId } from "../services/messaggi";

import "../style/Dettagli.css";

const Dettagli = () => {
  const { id } = useParams();
  const idAnnuncio = parseInt(id, 10);
  const { isLoggedIn } = useAuth();
  const currentUserId = Cookies.get("id");

  const [data, setData] = useState({
    annuncio: null,
    owner: null,
    ratings: [],
    usernames: {},
  });

  const [isLoading, setIsLoading] = useState(true);

  const [popupVisible, setPopupVisible] = useState(false);
  const [chatVisibility, setChatVisibility] = useState(false);
  const [chatParams, setChatParams] = useState({
    messages: [],
    idEmittente: null,
    idRicevente: null,
  });

  const [feedback, setFeedback] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const showFeedback = (severity, message) => {
    setFeedback({ open: true, severity, message });
  };

  const handleCloseFeedback = (event, reason) => {
    if (reason === "clickaway") return;
    setFeedback((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const adRes = await getAdById(idAnnuncio);
        if (!adRes.ok) throw new Error("Annuncio non trovato");
        const annuncioData = await adRes.json();

        const [ownerRes, ratingsRes] = await Promise.all([
          getUserById(annuncioData.idUtente),
          getObjectValutationsByAnnuncioId(annuncioData.id),
        ]);

        const ownerData = ownerRes.ok ? await ownerRes.json() : null;
        const ratingsData = ratingsRes.ok ? await ratingsRes.json() : [];

        const userPromises = ratingsData.map((r) => getUserById(r.valutatore));
        const usersResponses = await Promise.all(userPromises);

        const usernamesMap = {};
        for (const res of usersResponses) {
          if (res.ok) {
            const u = await res.json();
            usernamesMap[u.id] = u.username;
          }
        }

        setData({
          annuncio: annuncioData,
          owner: ownerData,
          ratings: ratingsData,
          usernames: usernamesMap,
        });
      } catch (error) {
        console.error(error);
        showFeedback("error", "Errore durante il caricamento della pagina");
      } finally {
        setIsLoading(false);
      }
    };

    if (idAnnuncio) fetchAllData();
  }, [idAnnuncio]);

  const stats = useMemo(() => {
    const { ratings } = data;
    if (!ratings || ratings.length === 0)
      return { average: 0, counts: [0, 0, 0, 0, 0] };

    const sum = ratings.reduce((acc, r) => acc + r.voto, 0);
    const average = sum / (ratings.length * 2);

    const counts = [0, 0, 0, 0, 0];
    ratings.forEach((r) => {
      if (r.voto >= 9) counts[4]++;
      else if (r.voto >= 7) counts[3]++;
      else if (r.voto >= 5) counts[2]++;
      else if (r.voto >= 3) counts[1]++;
      else counts[0]++;
    });

    return { average, counts };
  }, [data.ratings]);

  const handleRentRequest = () => {
    if (!isLoggedIn) {
      showFeedback(
        "error",
        "Devi effettuare l'accesso per richiedere un noleggio"
      );
      return;
    }
    if (currentUserId === data.owner?.id.toString()) {
      showFeedback("error", "Non puoi noleggiare un tuo annuncio");
      return;
    }
    setPopupVisible(true);
  };

  const handleChatRequest = async () => {
    if (!isLoggedIn) {
      showFeedback(
        "error",
        "Devi effettuare l'accesso per contattare l'utente"
      );
      return;
    }
    if (currentUserId === data.owner?.id.toString()) {
      showFeedback("error", "Non puoi chattare con te stesso");
      return;
    }

    try {
      const response = await getMessagesByUsersId(currentUserId, data.owner.id);
      if (response.ok) {
        const messages = await response.json();
        setChatParams({
          idEmittente: currentUserId,
          idRicevente: data.owner.id,
          messages,
        });
        setChatVisibility(true);
      } else {
        showFeedback("error", "Errore nel caricamento della chat");
      }
    } catch (error) {
      showFeedback("error", "Errore di connessione");
    }
  };

  if (isLoading) {
    return (
      <div className="Page">
        <Navbar />
        <div
          style={{ display: "flex", justifyContent: "center", padding: "50px" }}
        >
          {typeof Loader !== "undefined" ? <Loader /> : <p>Caricamento...</p>}
        </div>
        <Footer />
      </div>
    );
  }

  const { annuncio, owner, ratings, usernames } = data;

  if (!annuncio || !owner) return null;

  const isExpired = dayjs().isAfter(dayjs(annuncio.dataFine), "day");

  return (
    <div className="Page">
      <Navbar />
      <Box sx={{ width: 500 }}>
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
            sx={{ width: "100%" }}
          >
            {feedback.message}
          </Alert>
        </Snackbar>
      </Box>

      <div className="container">
        <div className="title">{annuncio.nome}</div>

        <div className="detailsContainer">
          <div className="leftSection">
            <div className="adDescription">
              <p>{annuncio.descrizione}</p>
              <div className="info-box">
                <p>
                  <span className="info-label">Data fine disponibilità: </span>
                  {dayjs(annuncio.dataFine).format("DD/MM/YYYY")}
                </p>
                <p>
                  <span className="info-label">Condizioni: </span>
                  {annuncio.condizione.toLowerCase()}
                </p>
                <p>
                  <span className="info-label">Prezzo: </span>€{" "}
                  {annuncio.prezzo}/giorno
                </p>
              </div>
            </div>

            <div className="actionButtons">
              <div className="requestButton">
                <button
                  onClick={handleRentRequest}
                  disabled={isExpired}
                  style={
                    isExpired ? { opacity: 0.5, cursor: "not-allowed" } : {}
                  }
                >
                  {isExpired ? "Annuncio Scaduto" : "Richiedi il noleggio"}
                </button>
              </div>

              <div className="contact">
                <div className="contactUser">
                  <AccountCircleIcon fontSize="large" className="contactIcon" />
                  <Link to={`/utente/${owner.id}`} className="ownerLink">
                    {owner.username}
                  </Link>
                </div>
                <div className="contactButton">
                  <button
                    className="contactButton2"
                    onClick={handleChatRequest}
                  >
                    Contatta
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="imageContainer">
            <img
              src={annuncio.immagine || "https://via.placeholder.com/400"}
              alt={annuncio.nome}
              loading="lazy"
            />
          </div>
        </div>

        <div className="reviewsContainer">
          <div className="reviewsTitle">Recensioni sull'articolo</div>

          <div className="reviewsContainer1">
            <div className="reviewsStats">
              <div className="reviewsNumber">
                {ratings.length} {ratings.length === 1 ? "review" : "reviews"}
              </div>
              <div className="overallRating">Valutazione media</div>

              <div className="ratingMedium">
                {ratings.length > 0 ? (
                  <>
                    <div className="averageRating">
                      {stats.average.toFixed(2)}
                    </div>
                    <Rating value={stats.average} precision={0.5} readOnly />
                  </>
                ) : (
                  "Nessuna recensione"
                )}
              </div>

              <Box sx={{ width: "100%", marginTop: 2 }}>
                {[5, 4, 3, 2, 1].map((star) => (
                  <div className="SliderBox" key={star}>
                    <span className="RatingNumber">{star}</span>
                    <Slider
                      value={stats.counts[star - 1]}
                      max={ratings.length || 1}
                      size="small"
                      disabled
                      sx={{ color: "#282a28" }}
                    />
                    <span className="RatingNumber">
                      {stats.counts[star - 1]}
                    </span>
                  </div>
                ))}
              </Box>
            </div>

            <div className="userReviews">
              {ratings.length > 0 ? (
                ratings.map((rating) => (
                  <div key={rating.id} className="containerUserReviews">
                    <div className="usernameUserReviews">
                      {usernames[rating.valutatore] || "Utente"}
                    </div>
                    <div className="iconsUserReviews">
                      <Rating
                        value={rating.voto / 2}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                    </div>
                    <div className="review-textUserReviews">
                      {rating.descrizione}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontStyle: "italic", color: "#666" }}>
                  Non ci sono ancora recensioni per questo oggetto.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {popupVisible && (
        <RichiestaNoleggio
          idAnnuncio={annuncio.id}
          idCreatore={annuncio.idUtente}
          prezzoAnnuncio={annuncio.prezzo}
          dataFinale={annuncio.dataFine}
          onClose={() => setPopupVisible(false)}
        />
      )}

      <Chat
        trigger={chatVisibility}
        setTrigger={setChatVisibility}
        idEmittente={chatParams.idEmittente}
        idRicevente={chatParams.idRicevente}
        messages={chatParams.messages}
      />
    </div>
  );
};

export default Dettagli;
