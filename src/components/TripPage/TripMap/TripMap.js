import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
//import { useHistory } from 'react-router-dom'; // Importa useHistory

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const TripMap = ({ tripId }) => {
  const [destinations, setDestinations] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
    const [mapZoom, setMapZoom] = useState(1);
  //const history = useHistory(); // Obtiene el objeto history

  useEffect(() => {
    async function fetchData() {
      let url;
        if (process.env.REACT_APP_VERCEL_URL) {
          url = 'https://' + process.env.REACT_APP_VERCEL_URL;
        }
        else {
          url = 'http://localhost:3000';
        }
      try {
        // Hacer una solicitud para obtener los destinos asociados al viaje
        const response = await fetch(`${url}/api/v1/trip_destinations?trip_id=${tripId}`, {
          method: 'GET',
          mode: 'no-cors',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Calcular el centro del mapa en función de los destinos (por ejemplo, el promedio de las coordenadas)
          if (data.length > 0) {
            const latSum = data.reduce((sum, destination) => sum + destination.latitude, 0);
            const lngSum = data.reduce((sum, destination) => sum + destination.longitude, 0);
            const avgLat = latSum / data.length;
            const avgLng = lngSum / data.length;
            setMapCenter({ lat: avgLat, lng: avgLng });
            setMapZoom(6); // Ajusta este valor según tu preferencia
          }
          setDestinations(data);
        } else {
          console.error('Error al obtener destinos');
        }
      } catch (error) {
        console.error('Error al obtener destinos', error);
      }
    }

    fetchData();
  }, [tripId]);

  // Función para manejar el clic en un marcador
  const handleMarkerClick = (destinationId) => {
    // Redirige al usuario a la página del destino
    window.location.href = `#/destination/${destinationId}`;
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        center={mapCenter}
        zoom={mapZoom}
      >
        {/* Agregar marcadores para cada destino */}
        {destinations.map((destination) => (
          <div
            key={destination.id}
            lat={destination.latitude}
            lng={destination.longitude}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'red',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => handleMarkerClick(destination.id)} // Manejador de clic para cada marcador
          >
            {destination.name}
          </div>
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default TripMap;

