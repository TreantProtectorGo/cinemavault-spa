import { UserAddOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";

export function RegisterPage() {
  return (
    <section className="page-stack">
      <div className="page-heading">
        <h1>Register</h1>
        <p>Placeholder form for creating a CinemaVault user account.</p>
      </div>

      <Card>
        <Form layout="vertical" disabled>
          <Form.Item label="Email">
            <Input placeholder="member@example.com" />
          </Form.Item>
          <Form.Item label="Username">
            <Input placeholder="member" />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password placeholder="StrongPassword123!" />
          </Form.Item>
          <Button type="primary" icon={<UserAddOutlined />}>
            Registration wiring pending
          </Button>
        </Form>
      </Card>
    </section>
  );
}
