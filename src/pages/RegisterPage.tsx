import { HeartOutlined, MessageOutlined, UserAddOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import type { RegisterRequest } from "../types";

type RegisterFormValues = RegisterRequest & {
  confirmPassword: string;
};

export function RegisterPage() {
  const [form] = Form.useForm<RegisterFormValues>();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/films"} replace />;
  }

  async function handleSubmit(values: RegisterFormValues) {
    const { confirmPassword: _confirmPassword, ...requestBody } = values;
    void _confirmPassword;
    setIsSubmitting(true);

    try {
      const response = await register(requestBody);
      message.success("Account created.");
      navigate(response.user.role === "ADMIN" ? "/admin" : "/films", {
        replace: true,
      });
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
          <span className="auth-kicker">Create your vault</span>
          <h1>Start saving films</h1>
          <p>Create an account to organise films, contact the admin team, and keep your profile up to date.</p>
          <div className="auth-benefits">
            <span><HeartOutlined /> Personal favourites</span>
            <span><VideoCameraOutlined /> Watchlist tracking</span>
            <span><MessageOutlined /> Film questions</span>
          </div>
        </div>

        <Card className="auth-card">
          <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Enter your email.",
                },
                {
                  type: "email",
                  message: "Enter a valid email address.",
                },
              ]}
            >
              <Input autoComplete="email" placeholder="member@example.com" />
            </Form.Item>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Choose a username.",
                },
                {
                  min: 3,
                  message: "Username should be at least 3 characters.",
                },
              ]}
            >
              <Input autoComplete="username" placeholder="member" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Enter a password.",
                },
                {
                  min: 8,
                  message: "Password should be at least 8 characters.",
                },
              ]}
            >
              <Input.Password autoComplete="new-password" placeholder="StrongPassword123!" />
            </Form.Item>
            <Form.Item
              label="Confirm password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Confirm your password.",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error("Passwords do not match."));
                  },
                }),
              ]}
            >
              <Input.Password autoComplete="new-password" placeholder="Repeat password" />
            </Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              icon={<UserAddOutlined />}
              loading={isSubmitting}
            >
              Create account
            </Button>
          </Form>
        </Card>
      </div>
    </section>
  );
}
