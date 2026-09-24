import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";

const COUNTDOWN_SECONDS = 7;

export default function SosGatePage() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const [counting, setCounting] = useState(false);
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef(null);

  const getLocation = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        reject
      );
    });

  const startCountdown = () => {
    setCounting(true);
    setRemaining(COUNTDOWN_SECONDS);
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timerRef.current);
          fireSos();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    clearInterval(timerRef.current);
    setCounting(false);
  };

  const fireSos = async () => {
    clearInterval(timerRef.current);
    try {
      const { lat, lng } = await getLocation();
      await api.post("/sos-events", { lat, lng, triggerType: "button" });
    } catch (err) {
      console.error("Failed to trigger SOS:", err);
    }
    // TODO: navigate to an active-SOS tracking screen
  };

  if (dismissed) {
    navigate("/map");
    return null;
  }

  return (
    <div style={styles.gate}>
      {!counting ? (
        <>
          <button style={styles.sosBtn} onClick={startCountdown}>SOS</button>
          <p style={styles.hint}>Press to alert your contacts and share your location.</p>
          <button style={styles.cancelBar} onClick={() => setDismissed(true)}>
            Slide to cancel &amp; open app →
          </button>
        </>
      ) : (
        <>
          <h2>Sending SOS in {remaining}s</h2>
          <button style={styles.cancelBar} onClick={cancelCountdown}>Cancel</button>
          <button style={styles.sendNowBtn} onClick={fireSos}>Send now — don't wait</button>
        </>
      )}
    </div>
  );
}

const styles = {
  gate: { height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, background: "rgba(8,9,12,0.9)", color: "#fff", textAlign: "center", padding: 24 },
  sosBtn: { width: 150, height: 150, borderRadius: "50%", background: "#ff3b30", color: "#fff", fontSize: 26, fontWeight: 700, border: "none" },
  hint: { color: "#9aa0ac", maxWidth: 260 },
  cancelBar: { padding: "14px 24px", borderRadius: 999, border: "none", background: "#1e2230", color: "#fff" },
  sendNowBtn: { padding: "10px 22px", borderRadius: 999, border: "none", background: "#fff", color: "#ff3b30", fontWeight: 700 },
};
