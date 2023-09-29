import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { TextField, Button, Paper, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const authToken = localStorage.getItem('authToken');

const MapPage = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userPlacemarkerLocation, setUserPlacemarkerLocation] = useState(null);
  const [trips, setTrips] = useState([]);
  const [latestTrip, setLatestTrip] = useState(null); // Aquí almacenaremos el último viaje
  const [error, setError] = useState(null);

  const user_id = parseInt(localStorage.getItem('user_id'));

  useEffect(() => {
    if (selectedLocation) {
      // Center the map on the selected location when it changes
      setSelectedLocation(selectedLocation);
    }
  }, [selectedLocation]);
  useEffect(() => {
    fetchData(); // Llamar a fetchData al montar el componente o cuando sea necesario
  }, []); // Asegura que solo se llama una vez al montar el componente

  async function fetchData() {
    try {
      const response = await fetch('http://localhost:3000/api/v1/trips', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Filtrar los viajes en los que el autor sea igual a user_id
        const filteredTrips = data.filter((trip) => trip.author === user_id);
        setTrips(filteredTrips); // Almacena los datos filtrados en el estado

        // Obtener el último viaje de la lista (si hay al menos uno)
        if (filteredTrips.length > 0) {
          const lastTrip = filteredTrips[filteredTrips.length - 1];
          setLatestTrip(lastTrip);
        } else {
          setLatestTrip(null); // No hay viajes
        }
      } else {
        setError('Autenticación fallida'); // Manejar errores
      }
    } catch (error) {
      setError('Autenticación fallida'); // Manejar errores de red u otros
    }
  }

  const createDestinationAndAssociateToTrip = async (destinationData, tripId) => {
    // try {
      // Paso 1: Crear el destino
      const authToken = localStorage.getItem('authToken');
      
      const destinationResponse = await axios.post('http://127.0.0.1:3000/api/v1/destinations', { destination: destinationData }, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Agregar encabezado de autenticación Bearer
        },
      });
      const createdDestination = destinationResponse.data;
  
      // Paso 2: Asociar el destino al viaje a través de la tabla de unión
      await axios.post('http://127.0.0.1:3000/api/v1/trip_destinations', {
        trip_id: tripId,
        destination_id: createdDestination.id,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Agregar encabezado de autenticación Bearer
        },
      });
  
      // La asociación se ha completado correctamente
      console.log(`Destino "${createdDestination.name}" asociado al viaje ID ${tripId}.`);
    //} catch (error) {
      // Manejar errores
      //console.error('Error al crear el destino o asociarlo al viaje:', error);
    //}
  };

  const handleSearchChange = (e) => {
    setSearchLocation(e.target.value);
  };

  const handleSearch = async () => {
    try {
      setUserLocation(null);
      // Specify the number of results you want (e.g., 10)
      const numResults = 10;

      // Fetch geocode data from Google Maps API without a specific country filter
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${searchLocation}&key=${apiKey}&result_type=street_address&limit=${numResults}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching geocode data', error);
    }
  };

  const handleResultClick = async (result) => {
    setSelectedLocation({
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    });
    setSearchLocation(result.formatted_address);
    setSearchResults([]);
  
    const confirmCreateDestination = window.confirm(
      `¿Deseas crear un destino en ${result.formatted_address}?`
    );
  
    if (confirmCreateDestination) {
      try {
        // Hacer una solicitud para obtener la dirección inversa (geocodificación inversa)
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${result.geometry.location.lat},${result.geometry.location.lng}&key=${apiKey}`
        );
        const data = await response.json();
  
        if (data.status === 'OK' && data.results.length > 0) {
          const result = data.results[0];
          // Filtrar los componentes de la dirección para encontrar ciudad y país
          const cityComponent = result.address_components.find(
            (component) => component.types.includes('locality')
          );
          const countryComponent = result.address_components.find(
            (component) => component.types.includes('country')
          );
          let city, country;
  
          if (cityComponent && countryComponent) {
            city = cityComponent.long_name;
            country = countryComponent.long_name;
            console.log(`Ciudad: ${city}, País: ${country}`);
          } else {
            city = "Ciudad desconocida";
            country = "País desconocido";
          }
  
          // Crear el destino y asociarlo al último viaje
          if (latestTrip) {
            createDestinationAndAssociateToTrip(
              {
                name: result.formatted_address,
                latitude: result.geometry.location.lat,
                longitude: result.geometry.location.lng,
                city: city,
                country: country,
              },
              latestTrip.id
            );
            window.alert(`Destino creado con éxito en ${result.formatted_address}.`);
          }
        }
      } catch (error) {
        console.error('Error fetching reverse geocode data', error);
      }
    }
  };
  

  // Dentro de la función getCurrentLocation
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location); // Set the user's location
          setUserPlacemarkerLocation(location); // Set the placemarker location

          try {
            // Hacer una solicitud para obtener la dirección inversa (geocodificación inversa)
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${apiKey}`
            );
            const data = await response.json();

            if (data.status === 'OK' && data.results.length > 0) {
              const result = data.results[0];
              // Filtrar los componentes de la dirección para encontrar ciudad y país
              const cityComponent = result.address_components.find(
                (component) => component.types.includes('locality')
              );
              const countryComponent = result.address_components.find(
                (component) => component.types.includes('country')
              );
              let city, country;

              if (cityComponent && countryComponent) {
                city = cityComponent.long_name;
                country = countryComponent.long_name;
                console.log(`Ciudad: ${city}, País: ${country}`);
              }
              else {
                city = "Ciudad desconocida";
                country = "País desconocido";
              }
              const confirmCreateDestination = window.confirm(
                `¿Deseas crear un destino en ${result.formatted_address}?`
              );
  
              if (confirmCreateDestination) {
              // Crear el destino y asociarlo al último viaje
                if (latestTrip) {
                  createDestinationAndAssociateToTrip(
                    {
                      name: result.formatted_address,
                      latitude: location.lat,
                      longitude: location.lng,
                      city: city,
                      country: country,
                    },
                    latestTrip.id
                  );
                  window.alert(`Destino creado con éxito en ${result.formatted_address}.`);
                }
              }
            }
          } catch (error) {
            console.error('Error fetching reverse geocode data', error);
          }
        },
        (error) => {
          console.error('Error getting user location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };


  

  return (
    <div style={{ padding: '20px', width: '850px', marginTop: '85px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <TextField
          label="Search for a place"
          variant="outlined"
          fullWidth
          value={searchLocation}
          onChange={handleSearchChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter key press
        />
        <Button
          onClick={handleSearch}
          variant="contained"
          color="primary"
          style={{ marginLeft: '10px' }}
        >
          Search
        </Button>
        <Button
          onClick={getCurrentLocation}
          variant="contained"
          color="primary"
          className="location-button" // Add this class
          style={{ marginLeft: '10px',width: '30%' }}
        >
          Get My Location
        </Button>
        
      </div>
      {searchResults.length > 0 && (
        <Paper elevation={3} style={{ padding: '10px', marginBottom: '10px', backgroundColor: 'white' }}>
          <List>
            {searchResults.map((result) => (
              <ListItem
                key={result.place_id}
                button
                onClick={() => handleResultClick(result)}
                style={{
                  cursor: 'pointer',
                  marginBottom: '8px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid black',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#eee';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <ListItemText primary={result.formatted_address} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      <div
        style={{
          height: '500px',
          width: '100%',
          marginTop: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey }}
          defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
          defaultZoom={10}
          center={userLocation || selectedLocation || { lat: 37.7749, lng: -122.4194 }}
        >
          {userPlacemarkerLocation && (
            <div
              lat={userPlacemarkerLocation.lat}
              lng={userPlacemarkerLocation.lng}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: 'red', // Cusize the placemarker color
                borderRadius: '50%',
              }}
            ></div>
          )}
          {selectedLocation && (
            <div
              lat={selectedLocation.lat}
              lng={selectedLocation.lng}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: 'red',
                borderRadius: '50%',
              }}
            ></div>
          )}
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default MapPage;
