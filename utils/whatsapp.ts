export function openWhatsAppHelp(
  orderId: string | number,
  supportNumber = "50230233",
) {
  const label =
    String(orderId).startsWith("#") ? String(orderId) : `#${orderId}`;
  const message = encodeURIComponent(
    `Hola, necesito ayuda con el pedido ${label}.`,
  );
  const phoneDigits = supportNumber.replace(/[^\d]/g, "");
  const url = `https://wa.me/${phoneDigits}?text=${message}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
}
