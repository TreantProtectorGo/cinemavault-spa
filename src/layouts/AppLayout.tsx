import type { ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button, Layout, Menu, Space, Tag, Typography } from "antd";
import {
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { appRoutes } from "../utils/routes";

const { Header, Content } = Layout;

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const activeKey =
    appRoutes.find((route) => location.pathname === route.path)?.path ?? "/";

  const visibleRoutes = appRoutes.filter((route) => {
    if (!route.showInNav) {
      return false;
    }

    if (route.requiresAdmin) {
      return isAdmin;
    }

    return true;
  });

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <Link className="brand-mark" to="/">
          <span className="brand-icon">
            <VideoCameraOutlined />
          </span>
          <span>CinemaVault</span>
        </Link>

        <Menu
          className="app-menu"
          mode="horizontal"
          selectedKeys={[activeKey]}
          items={visibleRoutes.map((route) => ({
            key: route.path,
            icon: route.icon,
            label: <NavLink to={route.path}>{route.label}</NavLink>,
          }))}
        />

        {isAuthenticated && user ? (
          <Space className="auth-cluster">
            <span className="user-pill">
              <Typography.Text strong>{user.username}</Typography.Text>
              <Tag color={isAdmin ? "red" : "blue"}>{user.role}</Tag>
            </span>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Button>
          </Space>
        ) : (
          <Space className="auth-cluster">
            <Button icon={<LoginOutlined />} href="/login">
              Login
            </Button>
            <Button type="primary" icon={<UserAddOutlined />} href="/register">
              Register
            </Button>
          </Space>
        )}
      </Header>

      <Content className="app-content">{children}</Content>
    </Layout>
  );
}
