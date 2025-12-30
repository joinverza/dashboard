/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App.tsx";
import { InitialLoader } from "./components/shared/loaders/InitialLoader";

function Root() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <StrictMode>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN || ""}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || ""}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        {!loadingComplete && (
          <InitialLoader onLoadComplete={() => setLoadingComplete(true)} />
        )}
        {loadingComplete && <App />}
      </Auth0Provider>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
