import Lenis from "lenis";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import "./index.css";
import App from "./App.tsx";

// Initialize Lenis smooth scrolling
const lenis = new Lenis({
  lerp: 0.12, // easing strength
  smoothWheel: true, // enable for global smooth scrolling
});

// Expose lenis globally for control
window.__lenis = lenis;

// Extend Lenis with stop/start methods for full-page scroll
const originalStop = lenis.stop.bind(lenis);
const originalStart = lenis.start.bind(lenis);

interface LenisGlobal extends Window {
  __lenis_stop: () => void;
  __lenis_start: () => void;
}

(window as unknown as LenisGlobal).__lenis_stop = () => {
  originalStop();
};

(window as unknown as LenisGlobal).__lenis_start = () => {
  originalStart();
};

const raf = (time: number) => {
  lenis.raf(time);
  requestAnimationFrame(raf);
};

requestAnimationFrame(raf);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
