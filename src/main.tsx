/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { InitialLoader } from "./components/shared/loaders/InitialLoader";

function Root() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <StrictMode>
      {!loadingComplete && (
        <InitialLoader onLoadComplete={() => setLoadingComplete(true)} />
      )}
      {loadingComplete && <App />}
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
