import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import onda1 from "../image/onda1.svg";
import onda2 from "../image/onda2.svg";
import persone from "../image/persone1.svg";
import citta from "../image/citta1.svg";
import frecce from "../image/frecce1.svg";
import "../style/ChiSiamo.css";

const ChiSiamo = () => {
    return (
        <div className="Page">
            <Navbar />

            <main className="sezionec">

                <img
                    className="wave-decoration top-right"
                    src={onda2}
                    alt=""
                    aria-hidden="true"
                />

                <div className="container">
                    <h1 className="titolo">Chi Siamo</h1>

                    <section className="divisione1">
                        <div className="container-pinfo">
                            <div className="pinfo">
                                <p>
                                    L'attenzione all' <span className="text-highlight">ambiente</span> e
                                    l'opportunità di <span className="text-highlight">risparmio</span> (e
                                    guadagno) sono i principi su cui si fonda Rently.
                                </p>
                            </div>
                        </div>
                        <img src={persone} alt="Persone che collaborano" loading="lazy" />
                    </section>

                    <section className="divisione2">
                        <img src={frecce} alt="Scambio oggetti" loading="lazy" />
                        <div className="container-pinfo2">
                            <div className="pinfo2">
                                <p>Su Rently:</p>
                                <ul className="features-list">
                                    <li>Metti a noleggio oggetti che non usi e guadagni con essi.</li>
                                    <li>Noleggi ciò di cui hai bisogno, risparmiando notevolmente.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="divisione3">
                        <div className="container-pinfo3">
                            <div className="pinfo3">
                                <p>
                                    In un mondo sensibile all'ecologia, questa è un'opportunità
                                    concreta per valorizzare gli oggetti poco usati, evitare
                                    acquisti inutili e ridurre le emissioni nocive dovute alla
                                    produzione di nuovi oggetti.
                                </p>
                            </div>
                        </div>
                        <img src={citta} alt="Città sostenibile" loading="lazy" />
                    </section>
                </div>

                <img
                    className="wave-decoration bottom-left"
                    src={onda1}
                    alt=""
                    aria-hidden="true"
                />
            </main>

            <Footer />
        </div>
    );
};

export default ChiSiamo;