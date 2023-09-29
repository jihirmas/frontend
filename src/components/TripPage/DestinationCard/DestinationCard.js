
import './DestinationCard.css';
import { Link } from "react-router-dom";
import {Button, Chip, Container} from "@mui/material";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import { CardActionArea } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


export default function DestinationCard({dest}) {

    

    return (
    
    <Card sx={{ maxWidth: 345 }}>
    <CardActionArea className='card-complete'>
    <Stack spacing={1}>
      <Skeleton variant="rounded" width={800} height={150} animation="wave" />
    </Stack>
        <CardContent>
        <Typography gutterBottom variant="h5" component="div">
            {dest?.country}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {dest?.city}
            </Typography>

        </CardContent>
    
    </CardActionArea>
    </Card>

    );
    }