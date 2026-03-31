import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; // 🔹 AuthContext import
import {useState} from "react";
import toast from "react-hot-toast";

import { useTranslation } from "../context/TranslationContext";
import { UI_TEXT } from "../config/uiText";

function ProductDetail() {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext); // 🔹 user al
  const { t } = useTranslation();

  // 🔐 Güvenlik: products gelmeden işlem yapma
  if (!products || products.length === 0) {
    return <div className="p-8">{t(UI_TEXT.loading)}</div>;
  }

  const product = products.find((p) => p._id === id);

  if (!product) {
    return <div className="p-8">{t(UI_TEXT.productNotFound)}</div>;
  }

  return (
    <div className="mt-24 max-w-6xl mx-auto p-5 pt-16 grid md:grid-cols-2 gap-10 bg-slate-200 rounded-3xl shadow">
      <div className="relative w-full max-w-96 mx-14 h-[550px] flex items-center justify-center bg-slate-200 rounded-xl hover:scale-110">
        <img
          src={
            product.images && product.images.length > 0
              ? `http://localhost:5000${product.images[currentImage]}`
              : "/no-image.png"
          }
          alt={product.name}
          className="max-w-full max-h-full object-contain rounded-3xl"
        />

          <button
  onClick={() => {
    if (product.images && product.images.length > 0) {
      setCurrentImage((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  }}
  className="absolute left-2 top-1/2 -translate-y-1/2 
    bg-white/30 backdrop-blur-md 
    text-white text-2xl 
    w-10 h-10 flex items-center justify-center 
    rounded-full shadow-lg 
    hover:scale-110 hover:bg-white/50 
    transition"
>
  ‹
</button>
  
  <button
  onClick={() => {
    if (product.images && product.images.length > 0) {
      setCurrentImage((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  }}
  className="absolute right-2 top-1/2 -translate-y-1/2 
    bg-white/30 backdrop-blur-md 
    text-white text-2xl 
    w-10 h-10 flex items-center justify-center 
    rounded-full shadow-lg 
    hover:scale-110 hover:bg-white/50 
    transition"
>
  ›
</button>

      </div>

      <div>
        <h1 className="text-3xl font-bold mt-24 max-w-60  text-slate-800 bg-slate-50 rounded-3xl px-4 py-2 shadow">
          {product.name}
        </h1>

        <p className="mt-6 text-gray-600 leading-relaxed bg-slate-50 rounded-3xl shadow py-3 px-10">
          {product.description}
        </p>

        <p className="text-3xl font-bold text-slate-700 mt-6 mb-10 max-w-56 py-2 px-5 bg-slate-50 rounded-3xl shadow">
          {product.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          ₺
        </p>

        <button
          onClick={() => {
            if (!user) {
              toast.error(t(UI_TEXT.mustLogin));
              return;
            }

            addToCart(product);
            toast.success(`${product.name} ${t(UI_TEXT.addedToCart)}`);
          }}
          className="mt-auto bg-lime-400 text-white  font-bold px-4 py-2 rounded-3xl shadow hover:bg-lime-500 transition"
        >
          {t(UI_TEXT.addToCart)}
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
