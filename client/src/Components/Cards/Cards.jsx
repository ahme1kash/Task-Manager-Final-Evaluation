import React, { useState } from "react";
import "./Cards.css";
import CardModal from "../CardModal/CardModal.jsx";
const Cards = ({ title, showModalButton }) => {
  return (
    <div>
      <div className="cards">
        <div className="cardheader">
          <h3 className="cardtitle">{title}</h3>
          {showModalButton && <CardModal />}
        </div>
        <div className="cardbody"></div>
      </div>
    </div>
  );
};

export default Cards;
