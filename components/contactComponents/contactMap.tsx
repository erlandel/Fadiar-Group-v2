"use client"

export function ContactMap() {
  const lat = 23.08525
  const lng = -82.434639
  const zoom = 15
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: "400px" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación de Grupo Fadiar - Ciudad Libertad, Marianao, La Habana, Cuba"
        className="w-full h-full min-h-[400px] lg:min-h-[500px]"
      />
    </div>
  )
}
