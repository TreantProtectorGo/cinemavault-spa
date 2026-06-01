import { Link } from "react-router-dom";
import { Button, Result } from "antd";

export function NotFoundPage() {
  return (
    <Result
      status="404"
      title="Page not found"
      subTitle="The requested CinemaVault page is not part of this scaffold."
      extra={
        <Link to="/">
          <Button type="primary">Back to home</Button>
        </Link>
      }
    />
  );
}
