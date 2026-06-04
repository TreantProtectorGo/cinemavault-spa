import { HeartOutlined, LockOutlined, MessageOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Input, message } from "antd";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import type { LoginRequest } from "../types";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export function LoginPage() {
  const [form] = Form.useForm<LoginRequest>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const state = location.state as LocationState | null;
  const redirectedFrom = state?.from?.pathname;

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/films"} replace />;
  }

  async function handleSubmit(values: LoginRequest) {
    setIsSubmitting(true);

    try {
      const response = await login(values);
      message.success("Login successful.");
      navigate(
        redirectedFrom && redirectedFrom !== "/login"
          ? redirectedFrom
          : response.user.role === "ADMIN"
            ? "/admin"
            : "/films",
        { replace: true },
      );
    } catch (error) {
      message.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <div className="auth-copy">
          <span className="auth-kicker">Member access</span>
          <h1>Welcome back</h1>
          <p>Sign in to continue your saved film lists, messages, and catalogue tools.</p>
          <div className="auth-benefits">
            <span><HeartOutlined /> Favourites and watchlist</span>
            <span><VideoCameraOutlined /> Watched history</span>
            <span><MessageOutlined /> Admin messages</span>
          </div>
        </div>

        <Card className="auth-card">
          {redirectedFrom ? (
            <Alert
              type="warning"
              showIcon
              title="Login required"
              description="Please sign in before continuing to that page."
            />
          ) : null}
          <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit}>
            <Form.Item
              label="Email or username"
              name="emailOrUsername"
              rules={[
                {
                  required: true,
                  message: "Enter your email or username.",
                },
              ]}
            >
              <Input autoComplete="username" placeholder="member@cinemavault.local" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Enter your password.",
                },
              ]}
            >
              <Input.Password autoComplete="current-password" placeholder="Password" />
            </Form.Item>
            <Form.Item shouldUpdate>
              {() => {
                const hasErrors = form
                  .getFieldsError()
                  .some(({ errors }) => errors.length > 0);

                return (
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    icon={<LockOutlined />}
                    loading={isSubmitting}
                    disabled={hasErrors}
                  >
                    Login
                  </Button>
                );
              }}
            </Form.Item>
          </Form>
        </Card>
      </div>
    </section>
  );
}
