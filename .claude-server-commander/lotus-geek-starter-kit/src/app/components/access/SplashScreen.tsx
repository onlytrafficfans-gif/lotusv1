import { motion } from "motion/react";
import logoLotus from "../../../imports/logo_lotus.png";

export function SplashScreen() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        margin: 0,
        padding: 0,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={logoLotus}
          alt="Lotus Logo"
          style={{
            maxWidth: "70%",
            maxHeight: "70%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 0 30px rgba(212, 165, 116, 0.4))",
          }}
        />
      </motion.div>
    </div>
  );
}
