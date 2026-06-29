import { motion } from "motion/react";
import logoLotus from "../../../imports/logo_lotus.png";

interface SplashScreenProps {
  isLoading?: boolean;
}

export function SplashScreen({ isLoading = true }: SplashScreenProps) {
  return (
    <div
      className="w-screen h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "#1a1a1a",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      {/* Animated background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
        }}
      />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6">
        {/* Lotus Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <img
            src={logoLotus}
            alt="Lotus"
            style={{
              width: 120,
              height: 120,
              objectFit: "contain",
              filter: "brightness(1.1)",
            }}
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-center"
        >
          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: 32,
              fontWeight: 500,
              color: "#f5ede8",
              letterSpacing: "-0.02em",
              margin: 0,
              marginBottom: 8,
            }}
          >
            Lotus
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "#c9b8ac",
              fontFamily: "system-ui, sans-serif",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            App Builder
          </p>
        </motion.div>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-2 mt-8"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#c9b8ac",
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            fontSize: 11,
            color: "#8b7968",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "0.05em",
            marginTop: 24,
            margin: 0,
          }}
        >
          The future of app building
        </motion.p>
      </div>
    </div>
  );
}
