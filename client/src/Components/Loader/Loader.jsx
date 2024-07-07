import { ColorRing } from "react-loader-spinner";
import React from "react";
const LoaderComponent = () => {
  return (
    <>
      <ColorRing
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="fallinglines-loading"
        radius="1"
        wrapperStyle={{
          justifyContent: "center",
          marginTop: "20%",

          alignItems: "center",
          position: "absolute",
        }}
        visible={true}
      />
    </>
  );
};
export default LoaderComponent;
