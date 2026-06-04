import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { env } from "./utils/env";

const app = (
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 8,
          fontFamily:
            "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        },
      }}
    >
      {env.googleClientId ? (
        <GoogleOAuthProvider clientId={env.googleClientId}>{app}</GoogleOAuthProvider>
      ) : (
        app
      )}
    </ConfigProvider>
  </StrictMode>,
);
