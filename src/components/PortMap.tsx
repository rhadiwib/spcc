import React, { useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Icon, LatLngBounds } from 'leaflet'
import { AISVesselData, VesselType } from '@types/maritime'
import 'leaflet/dist/leaflet.css'

interface PortMapProps {
  vessels: AISVesselData[]
  center: [number, number]
  zoom: number
  portBounds?: LatLngBounds
}

const getVesselIcon = (vesselType: VesselType, status: number) => {
  const iconUrl = `/icons/vessel-${vesselType}-${status}.png`
  return new Icon({
    iconUrl,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  })
}

const VesselMarker: React.FC<{ vessel: AISVesselData }> = ({ vessel }) => {
  const icon = useMemo(() => 
    getVesselIcon(vessel.vesselInfo.type, vessel.navigation.navigationStatus),
    [vessel.vesselInfo.type, vessel.navigation.navigationStatus]
  )
  
  return (
    <Marker 
      position={[vessel.position.latitude, vessel.position.longitude]}
      icon={icon}
    >
      <Popup>
        <div className="vessel-popup">
          <h3>{vessel.vesselInfo.name}</h3>
          <p><strong>MMSI:</strong> {vessel.mmsi}</p>
          <p><strong>Type:</strong> {VesselType[vessel.vesselInfo.type]}</p>
          <p><strong>Speed:</strong> {vessel.navigation.speedOverGround.toFixed(1)} knots</p>
          <p><strong>Course:</strong> {vessel.navigation.courseOverGround.toFixed(1)}°</p>
          <p><strong>Destination:</strong> {vessel.destination}</p>
          <p><strong>ETA:</strong> {vessel.eta}</p>
          <p><strong>Last Update:</strong> {new Date(vessel.timestamp).toLocaleString()}</p>
        </div>
      </Popup>
    </Marker>
  )
}

const PortMap: React.FC<PortMapProps> = ({ vessels, center, zoom, portBounds }) => {
  const visibleVessels = useMemo(() => {
    return vessels.filter(vessel => {
      if (!portBounds) return true
      return portBounds.contains([vessel.position.latitude, vessel.position.longitude])
    })
  }, [vessels, portBounds])
  
  return (
    <div className="port-map-container" style={{ height: '600px', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {visibleVessels.map(vessel => (
          <VesselMarker key={vessel.mmsi} vessel={vessel} />
        ))}
      </MapContainer>
    </div>
  )
}

export default PortMap