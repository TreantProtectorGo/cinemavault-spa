import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { env } from "../utils/env";

type GoogleAuthButtonProps = {
  redirectedFrom?: string;
  mode: "login" | "register";
};

export function GoogleAuthButton({ redirectedFrom, mode }: GoogleAuthButtonProps) {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  if (!env.googleClientId) {
    return null;
  }

  async function handleGoogleSuccess(response: CredentialResponse) {
    if (!response.credential) {
      message.error("Google did not return a credential.");
      return;
    }

    try {
      const authResponse = await loginWithGoogle({ credential: response.credential });
      message.success("Google sign-in successful.");
      navigate(
        redirectedFrom && redirectedFrom !== "/login" && redirectedFrom !== "/register"
          ? redirectedFrom
          : authResponse.user.role === "ADMIN"
            ? "/admin"
            : "/films",
        { replace: true },
      );
    } catch (error) {
      message.error(getApiErrorMessage(error));
    }
  }

  return (
    <div className="google-auth-button">
      <GoogleLogin
        shape="rectangular"
        size="large"
        text={mode === "register" ? "signup_with" : "signin_with"}
        theme="outline"
        width="100%"
        onError={() => message.error("Google sign-in failed.")}
        onSuccess={(response) => void handleGoogleSuccess(response)}
      />
    </div>
  );
}
