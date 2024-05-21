import React, { useEffect, useState } from "react";
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
import { HelmetProvider } from "react-helmet-async";

import {
  ProductOutlined,
  SafetyOutlined,
  TagOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { LiaProductHunt } from "react-icons/lia";
import { Layout, Menu, theme, message } from "antd";
import ProductScreen from "./pages/user/product";
import CartScreen from "./pages/user/cart";
import MainLayOut from "./pages/layout/mainLayout";
import HomeScreen from "./pages/user/home";
import ProfileScreen from "./pages/user/profile";
import ProductDetail from "./pages/user/product/productDetail";
import LoginLayout from "./pages/layout/loginLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Payment from "./pages/user/payment";
import FooterAdmin from "./pages/admin/footer";
import Tag from "./pages/admin/tag";
import Timkiem from "./pages/user/timkiem";
import Brand from "./pages/admin/brand";
import BannerAdmin from "./pages/admin/banner";
import Order from "./pages/admin/order";
import OrderSuccess from "./components/orderSuccess";
import SearchMobile from "./pages/layout/searchMobile";
import MobileResultSearch from "./pages/user/mobile/resultSearch";
import LocationAdmin from "./pages/admin/location";
import PolicyAdmin from "./pages/admin/policy";
import PolicyScreen from "./pages/user/policy";
import PageLocation from "./components/pageLocation";
const { Sider, Content } = Layout;
numeral.locale("vi");

const router = createBrowserRouter([
  {
    path: "/notPermit",
    element: <Login />,
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
        path: "/:search",
        element: <PolicyScreen />,
      },
      {
        path: "/payment",
        element: <Payment />,
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
        path: "/hethongcuahang",
        element: <PageLocation />,
      },
      {
        path: "/cart",
        element: <CartScreen />,
      },
      {
        path: "/cart/thanhcong",
        element: <OrderSuccess />,
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

  // search theo mobile
  {
    path: "/mobile",
    element: <SearchMobile />,
    children: [
      {
        // path: "search", or
        path: "/mobile",
        element: <MobileResultSearch />,
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
        path: "/admin/brands",
        element: <Brand />,
        children: [
          {
            path: "/admin/brands/:id",
            element: <Brand />,
          },
        ],
      },
      {
        path: "/admin/banners",
        element: <BannerAdmin />,
        children: [
          {
            path: "/admin/banners/:id",
            element: <BannerAdmin />,
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
            element: <FooterAdmin />,
          },
        ],
      },
      // {
      //   path: "/admin/footersContact",
      //   element: <FooterContact />,
      //   children: [
      //     {
      //       path: "/admin/footersContact/:id",
      //       element: <FooterContact />,
      //     },
      //   ],
      // },
      {
        path: "/admin/orders",
        element: <Order />,
        children: [
          {
            path: "/admin/orders/:id",
            element: <Order />,
          },
        ],
      },
      {
        path: "/admin/locations",
        element: <LocationAdmin />,
        children: [
          {
            path: "/admin/locations/:id",
            element: <LocationAdmin />,
          },
        ],
      },
      {
        path: "/admin/policies",
        element: <PolicyAdmin />,
        children: [
          {
            path: "/admin/policies/:id",
            element: <PolicyAdmin />,
          },
        ],
      },
    ],
  },
]);

// If you are using react-helmet-async on server side
const helmetContext = {};

function AdminRouter() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const currentUser = JSON.parse(localStorage.getItem("userInfor")!);
  const [messageApi, contextHolder] = message.useMessage();

  const MESSAGE_TYPE = {
    SUCCESS: "success",
    INFO: "info",
    WARNING: "warning",
    ERROR: "error",
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/notPermit");
    } else if (!currentUser?.isAdmin) {
      navigate("/");
    }
  });

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
              key: "/admin/brands",
              icon: <SafetyOutlined />,
              label: "Thương hiệu",
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

            // {
            //   key: "/admin/footersContact",
            //   icon: <UploadOutlined />,
            //   label: "Contact",
            // },

            {
              key: "/admin/banners",
              icon: <UploadOutlined />,
              label: "Banner",
            },
            {
              key: "/admin/orders",
              icon: <LiaProductHunt />,
              label: "Order",
            },
            {
              key: "/admin/locations",
              icon: <LiaProductHunt />,
              label: "Địa chỉ",
            },
            {
              key: "/admin/policies",
              icon: <LiaProductHunt />,
              label: "Chính sách",
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
    // <HelmetProvider context={helmetContext}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
    // </HelmetProvider>
  );
}

export default App;
