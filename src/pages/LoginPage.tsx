import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";

export function LoginPage() {
  return (
    <section className="page-stack">
      <div className="page-heading">
        <h1>Login</h1>
        <p>Placeholder form for JWT authentication.</p>
      </div>

      <Card>
        <Form layout="vertical" disabled>
          <Form.Item label="Email or username">
            <Input placeholder="member@example.com" />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Button type="primary" icon={<LockOutlined />}>
            Login wiring pending
          </Button>
        </Form>
      </Card>
    </section>
  );
}
