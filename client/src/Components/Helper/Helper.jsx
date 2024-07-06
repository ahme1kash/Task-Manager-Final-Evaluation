import React, { useState, useEffect } from "react";
const Helper = () => {
  const user = localStorage.getItem("Token");
  if (user) {
    return true;
  } else {
    return false;
  }
};
export default Helper;
