import React, { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const { products, searchTerm } = useContext(ProductContext);

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Bu ürünü silmek istediğinize emin misiniz?"
  );

  if (!confirmDelete) return;

  try {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    });

    // UI'dan da kaldır
    setProducts((prev) => prev.filter((p) => p._id !== id));
  } catch (err) {
    console.error("Silme hatası:", err);
    alert("Silme işlemi başarısız");
  }
};




  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((p) => (
          <ProductCard key={p._id} product={p}/>
          
          
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          Aradığınız ürün bulunamadı.
        </p>
      )}
    </div>
  );
}
