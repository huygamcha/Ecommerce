import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Category from "./pages/category";
import Supplier from "./pages/supplier";
import Product from "./pages/product";
import {
  Routes,
  Route,
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Outlet,
} from "react-router-dom";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";

const { Header, Sider, Content } = Layout;
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/admin/categories",
        element: <Category />,
        children: [
          {
            path: "/admin/categories/:id",
            element: <Category />,
          },
        ],
      },
      {
        path: "/admin/products",
        element: <Product />,
        children: [
          {
            path: "/admin/products/:id",
            element: <Product />,
          },
        ],
      },
      {
        path: "/admin/suppliers",
        element: <Supplier />,
        children: [
          {
            path: "/admin/suppliers/:id",
            element: <Supplier />,
          },
        ],
      },
    ],
  },
]);
function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
function Root() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          onClick={(items) => {
            console.log("««««« item »»»»»", items.key);
            navigate(items.key);
          }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "/admin/categories",
              icon: <UserOutlined />,
              label: "Danh mục",
            },
            {
              key: "/admin/suppliers",
              icon: <VideoCameraOutlined />,
              label: "Nhà cung cấp",
            },
            {
              key: "/admin/products",
              icon: <UploadOutlined />,
              label: "Sản phẩm",
            },
          ]}
        />
      </Sider>
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header> */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
