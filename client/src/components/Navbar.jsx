import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ProductContext } from "../context/ProductContext";
import { useTranslation } from "../context/TranslationContext";


export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { t, lang, toggleLanguage } = useTranslation();

  const { cart } = useContext(CartContext);
  const { searchTerm, setSearchTerm } = useContext(ProductContext);

  // 🔽 kullanıcı menüsü state
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // 🔽 dışarı tıklayınca kapat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Tüm nav itemları
  const navItems = [
    { path: "/", label: "Home", show: true },
    { path: "/cart", label: "Cart", show: true },
    { path: "/admin/products", label: "Admin", show: user?.email === "fawaddilawar24@gmail.com" },
    { path: "/login", label: "Login", show: !user },
    { path: "/signup", label: "Signup", show: !user },
  ];

  return (
    <nav className="bg-slate-100 shadow-md py-4 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
  <h1 className="text-lg  px-2 py-1 sm:text-xl font-semibold tracking-widest text-slate-800 rounded-2xl shadow bg-slate-50">
    D I L A W A R <span className="text-blue-500">C A R P E T</span>
  </h1>

  <input
    type="text"
    placeholder="Search..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="rounded-2xl px-3 py-1 w-1/3 focus:outline-none focus:ring-blue-400 shadow bg-slate-50 hover:bg-white"
  />

  <ul className="flex space-x-6 items-center">
    {/* Kullanıcı menüsü */}
    {user && (
      <li className="relative" ref={menuRef}>
        <span
          onClick={() => setOpen(!open)}
          className="py-1 px-2 cursor-pointer font-semibold text-gray-800 hover:bg-white rounded-2xl shadow bg-slate-50 "
        >
          {t("Hi")} {user.firstName}
        </span>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
            <button
              onClick={() => { navigate("/bilgilerim"); setOpen(false); }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {t("myInfo")}
            </button>
            <button
              onClick={() => { navigate("/orders"); setOpen(false); }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {t("myOrders")}
            </button>
            <button
              onClick={() => { logout(); window.location.href = "/"; }}
              className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
            >
              {t("logout")}
            </button>
          </div>
        )}
      </li>
    )}

    {navItems
      .filter((item) => item.show)
      .map((item) => (
        <li key={item.path}>
          <Link
            to={item.path}
            className={`${
              location.pathname === item.path ||
              location.pathname.startsWith(item.path)
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            } hover:bg-white shadow py-1 px-3 rounded-2xl bg-slate-50 font-semibold` }
          >
            {t(item.label.toLowerCase())} {/* t() ile çeviri */}
            {item.path === "/cart" && cart.length > 0 && (
              <span className="ml-1 bg-red-500 text-white rounded-full px-2 text-sm">
                {cart.length}
              </span>
            )}
          </Link>
        </li>
      ))}

    {/* Dil değiştirici button */}
    <li>
      <button
        onClick={toggleLanguage}
        className="ml-4 px-3 py-1 shadow rounded-2xl bg-slate-50 hover:bg-white font-semibold"
      >
        {lang === "tr" ? "EN" : "TR"}
      </button>
    </li>
  </ul>
</div>

    </nav>
  );
}
