"use client"

export function ContactMap() {
  // Coordenadas aproximadas de Ciudad Libertad, Marianao, La Habana, Cuba
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.8!2d-82.45!3d23.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88cd7c6d38f9a5b5%3A0x7d4a4a4a4a4a4a4a!2sCiudad%20Libertad%2C%20Marianao%2C%20La%20Habana%2C%20Cuba!5e0!3m2!1ses!2s!4v1706540000000!5m2!1ses!2s`

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
