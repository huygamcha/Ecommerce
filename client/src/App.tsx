import React, { Children, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import numeral from "numeral";
import "numeral/locales/vi";

import Category from "./pages/admin/category";
import Supplier from "./pages/admin/supplier";
import Product from "./pages/admin/product";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Outlet,
} from "react-router-dom";

import {
  ProductOutlined,
  TagOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import ProductScreen from "./pages/user/product";
import CartScreen from "./pages/user/cart";
import MainLayOut from "./pages/layout/mainLayout";
import HomeScreen from "./pages/user/home";
import ProfileScreen from "./pages/user/profile";
import ProductDetail from "./pages/user/product/productDetail";
import LoginLayout from "./pages/layout/loginLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotPermit from "./pages/auth/NotPermit";
import Payment from "./pages/user/payment";
import FooterAdmin from "./pages/admin/footer";
import Tag from "./pages/admin/tag";
import Timkiem from "./pages/user/timkiem";
const { Sider, Content } = Layout;
numeral.locale("vi");

const router = createBrowserRouter([
  {
    path: "/notPermit",
    element: <NotPermit />,
  },

  {
    path: "/auth",
    element: <LoginLayout />,
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/register",
        element: <Register />,
      },
    ],
  },

  {
    path: "/",
    element: <MainLayOut />,
    children: [
      {
        path: "/payment",
        element: <Payment />,
      },
      {
        path: "/home",
        element: <HomeScreen />,
      },
      {
        path: "/",
        element: <ProductScreen />,
        children: [
          {
            path: "/product/search/:id",
            element: <ProductScreen />,
          },
          {
            path: "/product&page=/:id",
            element: <ProductScreen />,
          },
        ],
      },
      {
        path: "/profile",
        element: <ProfileScreen />,
      },
      {
        path: "/cart",
        element: <CartScreen />,
      },
      {
        path: "/sanpham/:id",
        element: <ProductDetail />,
      },
      {
        path: "/timkiem",
        element: <Timkiem />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminRouter />,
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
        path: "/admin/tags",
        element: <Tag />,
        children: [
          {
            path: "/admin/tags/:id",
            element: <Tag />,
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
      {
        path: "/admin/footers",
        element: <FooterAdmin />,
        children: [
          {
            path: "/admin/footers/:id",
            element: <Supplier />,
          },
        ],
      },
    ],
  },
]);

function AdminRouter() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const currentUser = JSON.parse(localStorage.getItem("userInfor")!);

  // useEffect(() => {
  //   if (!currentUser?.isAdmin) {
  //     navigate("/notPermit");
  //   }
  // });

  return (
    <Layout>
      <Sider
        style={{ height: "auto" }}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="demo-logo-vertical" />
        <Menu
          onClick={(items) => {
            navigate(items.key);
          }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "/admin/products",
              icon: <ProductOutlined />,
              label: "Sản phẩm",
            },
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
              key: "/admin/tags",
              icon: <TagOutlined />,
              label: "Tags",
            },

            {
              key: "/admin/footers",
              icon: <UploadOutlined />,
              label: "Footer",
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
function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
