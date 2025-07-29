import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ServiceMap = ({ services }) => {
  const mapRef = useRef();

  // Sample coordinates for Colombian cities (you would get these from your API)
  const cityCoordinates = {
    'Bogotá': [4.7110, -74.0721],
    'Medellín': [6.2442, -75.5812],
    'Cali': [3.4516, -76.5320],
    'Barranquilla': [10.9685, -74.7813],
    'Cartagena': [10.3910, -75.4794],
    'Bucaramanga': [7.1253, -73.1198],
    'Pereira': [4.8133, -75.6961],
    'Santa Marta': [11.2408, -74.2099],
    'Manizales': [5.0703, -75.5138],
    'Pasto': [1.2136, -77.2811]
  };

  // Group services by city
  const servicesByCity = services.reduce((acc, service) => {
    const city = service.ciudad;
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(service);
    return acc;
  }, {});

  // Create custom icon based on service type
  const getServiceIcon = (serviceType) => {
    const colors = {
      'alojamiento': '#263DBF',
      'restaurante': '#F2785C',
      'Transporte': '#D9779B',
      'Experiencia': '#10b981'
    };

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${colors[serviceType] || '#6b7280'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={[4.7110, -74.0721]} // Bogotá as default center
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {Object.entries(servicesByCity).map(([city, cityServices]) => {
          const coordinates = cityCoordinates[city];
          if (!coordinates) return null;

          return (
            <Marker
              key={city}
              position={coordinates}
              icon={getServiceIcon(cityServices[0]?.tipo_servicio)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{city}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {cityServices.length} servicio{cityServices.length !== 1 ? 's' : ''} disponible{cityServices.length !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-1">
                    {cityServices.slice(0, 3).map((service) => (
                      <div key={service.id_servicio} className="text-xs">
                        <span className="font-medium">{service.nombre}</span>
                        <span className="text-gray-500 ml-2">
                          ${service.precio?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {cityServices.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{cityServices.length - 3} más...
                      </p>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ServiceMap;
