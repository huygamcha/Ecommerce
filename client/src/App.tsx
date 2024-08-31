import React, { useEffect, useState } from "react";
import "./App.css";
import numeral from "numeral";
import "numeral/locales/vi";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Outlet,
} from "react-router-dom";
import {
  ProductOutlined,
  SafetyOutlined,
  TagOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { LiaProductHunt } from "react-icons/lia";
import { Layout, Menu, theme, message } from "antd";
import { IoHomeOutline } from "react-icons/io5";
import Fallback from "./components/fallback/Fallback";

// Admin components
const Category = React.lazy(() => import("./pages/admin/category"));
const Product = React.lazy(() => import("./pages/admin/product"));
const FooterAdmin = React.lazy(() => import("./pages/admin/footer"));
const Tag = React.lazy(() => import("./pages/admin/tag"));
const Brand = React.lazy(() => import("./pages/admin/brand"));
const BannerAdmin = React.lazy(() => import("./pages/admin/banner"));
const Order = React.lazy(() => import("./pages/admin/order"));
const LocationAdmin = React.lazy(() => import("./pages/admin/location"));
const PolicyAdmin = React.lazy(() => import("./pages/admin/policy"));

// User components
const ProductScreen = React.lazy(() => import("./pages/user/product"));
const CartScreen = React.lazy(() => import("./pages/user/cart"));
const ProfileScreen = React.lazy(() => import("./pages/user/profile"));
const ProductDetail = React.lazy(
  () => import("./pages/user/product/productDetail")
);
const Payment = React.lazy(() => import("./pages/user/payment"));
const PolicyScreen = React.lazy(() => import("./pages/user/policy"));
const TestCloudfare = React.lazy(() => import("./pages/user/image"));

// Layout components
const MainLayOut = React.lazy(() => import("./pages/layout/mainLayout"));
const LoginLayout = React.lazy(() => import("./pages/layout/loginLayout"));
const SearchMobile = React.lazy(() => import("./pages/layout/searchMobile"));

// Auth components
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));

// Other components
const OrderSuccess = React.lazy(() => import("./components/orderSuccess"));
const MobileResultSearch = React.lazy(
  () => import("./pages/user/mobile/resultSearch")
);
const PageLocation = React.lazy(() => import("./components/pageLocation"));

const Timkiem = React.lazy(() => import("./pages/user/timkiem"));
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
    path: "/upload",
    element: <TestCloudfare />,
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
        // lazy: () => import("./pages/user/timkiem"),
        element: <Timkiem />,
        // async lazy() {
        //   let  Timkiem  = await import("./pages/user/timkiem");
        //   return { Component: Timkiem };
        // }
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

function AdminRouter() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const currentUser = JSON.parse(localStorage.getItem("userInfor")!);

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
              key: "/",
              icon: <IoHomeOutline />,
              label: "Trang chủ",
            },
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
            // {
            //   key: "/admin/suppliers",
            //   icon: <VideoCameraOutlined />,
            //   label: "Nhà cung cấp",
            // },
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
    // <React.StrictMode>
    <>
      <React.Suspense fallback={<Fallback />}>
        <RouterProvider router={router} />
      </React.Suspense>
    </>
    // </React.StrictMode>
    // </HelmetProvider>
  );
}

export default App;
