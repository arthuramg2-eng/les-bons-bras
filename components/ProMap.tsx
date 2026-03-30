interface ProMapProps {
  latitude: number
  longitude: number
  proName: string
}

export default function ProMap({ latitude, longitude, proName }: ProMapProps) {
  const query = encodeURIComponent(`${latitude},${longitude}`)

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 h-full min-h-[220px]">
      <iframe
        title={`Carte — ${proName}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${query}&z=14&output=embed`}
      />
    </div>
  )
}
