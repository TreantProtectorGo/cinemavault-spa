import type { ReactNode } from "react";
import {
  DashboardOutlined,
  EyeOutlined,
  HeartOutlined,
  HomeOutlined,
  LoginOutlined,
  MessageOutlined,
  PlaySquareOutlined,
  UserAddOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

export type AppRouteMeta = {
  path: string;
  label: string;
  icon: ReactNode;
  showInNav: boolean;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
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
    path: "/favourites",
    label: "Favourites",
    icon: <HeartOutlined />,
    showInNav: true,
    requiresAuth: true,
  },
  {
    path: "/watchlist",
    label: "Watchlist",
    icon: <PlaySquareOutlined />,
    showInNav: true,
    requiresAuth: true,
  },
  {
    path: "/watched",
    label: "Watched",
    icon: <EyeOutlined />,
    showInNav: true,
    requiresAuth: true,
  },
  {
    path: "/messages",
    label: "Messages",
    icon: <MessageOutlined />,
    showInNav: true,
    requiresAuth: true,
  },
  {
    path: "/profile",
    label: "Profile",
    icon: <UserOutlined />,
    showInNav: true,
    requiresAuth: true,
  },
  {
    path: "/admin",
    label: "Admin",
    icon: <DashboardOutlined />,
    showInNav: true,
    requiresAdmin: true,
  },
  {
    path: "/admin/messages",
    label: "Admin Messages",
    icon: <MessageOutlined />,
    showInNav: true,
    requiresAdmin: true,
  },
];
