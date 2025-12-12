import React from "react";
import "../style/Loader.css";

const Loader = ({ message = "Sto recuperando la tua richiesta" }) => {
    return (
        <div className="sfondo" role="status" aria-busy="true" aria-live="polite">
            <h1 className="loader__title">{message}</h1>

            <div className="hamsterContainer">
                <figure
                    aria-label="Criceto arancione e beige che corre su una ruota di metallo"
                    role="img"
                    className="wheel-and-hamster"
                >
                    <div className="wheel" />
                    <div className="hamster">
                        <div className="hamster__body">
                            <div className="hamster__head">
                                <div className="hamster__ear" />
                                <div className="hamster__eye" />
                                <div className="hamster__nose" />
                            </div>
                            <div className="hamster__limb hamster__limb--fr" />
                            <div className="hamster__limb hamster__limb--fl" />
                            <div className="hamster__limb hamster__limb--br" />
                            <div className="hamster__limb hamster__limb--bl" />
                            <div className="hamster__tail" />
                        </div>
                    </div>
                    <div className="spoke" />
                </figure>
            </div>
        </div>
    );
};

export default Loader;
