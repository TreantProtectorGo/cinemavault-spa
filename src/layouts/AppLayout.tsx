import type { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button, Layout, Menu, Space } from "antd";
import {
  HomeOutlined,
  LoginOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { appRoutes } from "../utils/routes";

const { Header, Content } = Layout;

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const activeKey =
    appRoutes.find((route) => location.pathname === route.path)?.path ?? "/";

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
          items={appRoutes
            .filter((route) => route.showInNav)
            .map((route) => ({
              key: route.path,
              icon: route.icon,
              label: <NavLink to={route.path}>{route.label}</NavLink>,
            }))}
        />

        <Space>
          <Button icon={<LoginOutlined />} href="/login">
            Login
          </Button>
          <Button type="primary" icon={<HomeOutlined />} href="/register">
            Register
          </Button>
        </Space>
      </Header>

      <Content className="app-content">{children}</Content>
    </Layout>
  );
}
