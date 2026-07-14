import { ColorRing } from "react-loader-spinner";
import React from "react";
const LoaderComponent = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        zIndex: 9999,
      }}
    >
      <ColorRing
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="fallinglines-loading"
        radius="1"
        visible={true}
      />
    </div>
  );
};
export default LoaderComponent;
