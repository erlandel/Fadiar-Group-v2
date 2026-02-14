import type { CartItem } from "@/store/cartStore";
import useAuthStore from "@/store/authStore";

export function payWithZelle(params: {
  orderId?: string | number;
  items: CartItem[];
  formData: {
    firstName: string;
    lastName1: string;
    lastName2: string;
    phone: string;
    province: string;
    municipality: string;
    delivery: boolean;
    deliveryPrice?: number;
    address?: string;
    note?: string;
  };
  supportNumber?: string;
}) {
  const { orderId, items, formData, supportNumber = "50230233" } = params;
  const orderLabel = orderId
    ? String(orderId).startsWith("#")
      ? String(orderId)
      : `#${orderId}`
    : "";
  const productsTotal = items.reduce((acc, it) => {
    const priceNum = parseFloat(String(it.price).replace(/[^0-9.]/g, ""));
    return acc + priceNum * it.quantity;
  }, 0);

  const deliveryPrice = formData.deliveryPrice || 0;
  const total = productsTotal + deliveryPrice;

  const { auth } = useAuthStore.getState();
  const person = auth?.person;
  const isDelivery = formData.delivery;

  const fullName = isDelivery
    ? `${formData.firstName} ${formData.lastName1} ${formData.lastName2}`.trim()
    : `${person?.name || ""} ${person?.lastname1 || ""} ${person?.lastname2 || ""}`.trim();

  const phone = isDelivery ? formData.phone : (person?.cellphone1 || "");

  const productLines = items
    .map((it, idx) => {
      return [
        `${idx + 1}. Nombre de la tienda: ${it.tiendaName || "No especificada"}`,
        `   nombre del producto: ${it.title}`,
        `   marca: ${it.brand}`,
        `   cantidad: ${it.quantity}`,
      ].join("\n");
    })
    .join("\n");
  const deliveryMethod = formData.delivery ? "Domicilio" : "Recogida en tienda";
  const deliveryLine = formData.delivery && formData.address ? `Dirección: ${formData.address}` : "";
  const noteLine = formData.note ? `Nota: ${formData.note}` : "";

  const lines = [
    `Hola, deseo pagar por Zelle.`,
    orderLabel ? `Pedido ${orderLabel}` : `Pedido`,
    `*DATOS DE ENTREGA*`,
    `Cliente: ${fullName}`,
    `Teléfono: ${phone}`,
    `Provincia: ${formData.province}`,
    `Municipio: ${formData.municipality}`,
    `Método de entrega: ${deliveryMethod}`,
    deliveryLine,
    deliveryPrice > 0 ? `Costo de envío: ${deliveryPrice.toFixed(2)}` : "",
    `Producto(s):`,
    productLines || `Sin productos`,
    `Precio Total a pagar: ${total.toFixed(2)}`,
    noteLine
  ].filter(line => line !== "").join("\n");
  const phoneDigits = supportNumber.replace(/[^\d]/g, "");
  const url = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(lines)}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
}
