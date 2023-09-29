
import './TripCard.css';
import { Link } from "react-router-dom";
import {Button, Chip, Container} from "@mui/material";
import placeholder from "./placeholder.png";
import TripPage from "../../TripPage";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import { CardActionArea } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


function obtenerFechaEnFormato(fechaString) {
    const fecha = new Date(fechaString);
    const año = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;
    const dia = fecha.getDate();
  
    // Formatear la fecha en el formato "dia/mes/año"
    const fechaFormateada = `${dia}/${mes}/${año}`;
    
    return fechaFormateada;
  }

export default function TripCard({trip}) {
    let chipColor;
    let chipText;
    let today = new Date();
    let start = new Date(trip.start_date);
    let end = new Date(trip.end_date);
    

    if (end > today && end < today) {
    chipColor = "info";
    chipText = "Ongoing";
    }
    else if (end > today) {
    chipColor = "warning";
    chipText = "Upcoming";
    }
    else {
    chipColor = "error";
    chipText = "Ended";
    }

    let startDate = obtenerFechaEnFormato(trip.start_date);
    let endDate = obtenerFechaEnFormato(trip.end_date);


    return (
    <Link to={`/trip/${trip.id}`} className="link-to-trip">
    <Card sx={{ maxWidth: 345 }}>
    <CardActionArea className='card-complete'>
    <Stack spacing={1}>
      <Skeleton variant="rounded" width={800} height={150} animation="wave" />
    </Stack>
        <CardContent>
        <Typography gutterBottom variant="h5" component="div">
            {trip?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {trip?.description}
            </Typography>

        </CardContent>
    
    <CardActions>
        <Typography variant="body2" color="text.secondary">
        {startDate} - {endDate} <Chip className={"Chip"} label={chipText} color={chipColor} right={0} />
        </Typography>
    </CardActions>
    
    </CardActionArea>
    </Card>
    </Link>
    );
    }