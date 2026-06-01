import type { ReactNode } from "react";
import {
  DashboardOutlined,
  HomeOutlined,
  LoginOutlined,
  UserAddOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

export type AppRouteMeta = {
  path: string;
  label: string;
  icon: ReactNode;
  showInNav: boolean;
};

export const appRoutes: AppRouteMeta[] = [
  {
    path: "/",
    label: "Home",
    icon: <HomeOutlined />,
    showInNav: true,
  },
  {
    path: "/films",
    label: "Films",
    icon: <VideoCameraOutlined />,
    showInNav: true,
  },
  {
    path: "/login",
    label: "Login",
    icon: <LoginOutlined />,
    showInNav: false,
  },
  {
    path: "/register",
    label: "Register",
    icon: <UserAddOutlined />,
    showInNav: false,
  },
  {
    path: "/admin",
    label: "Admin",
    icon: <DashboardOutlined />,
    showInNav: true,
  },
];
