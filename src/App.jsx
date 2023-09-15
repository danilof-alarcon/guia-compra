import { useEffect, useState } from 'react';
import getCameras from './lib/airtable';
import { Box, Button, Card, CardMedia, CircularProgress, Container, Fade, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, Skeleton, Stack, Typography } from '@mui/material';
import './App.css'
import { ThemeProvider } from '@mui/material/styles';
import theme from './utils/theme';
import styles from './styles/custom-styles';

function App() {

    const [cameras, setCameras] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState(1);
    const [budgetFilter, setBudgetFilter] = useState('');
    const [goalFilter, setGoalFilter] = useState([]);
    const [interestFilter, setInterestFilter] = useState('');
    const [weightFilter, setWeightFilter] = useState('');
    const [isOptionSelected, setIsOptionSelected] = useState(false);

    const budgetOptions = cameras.map((camera) => {
        return camera.fields.Presupuesto;
    }).filter((budget, index, array) => {
        return array.indexOf(budget) === index;
    });

    const goalOptions = cameras.map((camera) => {
        return camera.fields.Objetivo;
    }).flat().filter((goal, index, array) => {
        return array.indexOf(goal) === index;
    });

    const interestOptions = cameras.map((camera) => {
        return camera.fields.Interes;
    }).filter((interest, index, array) => {
        return array.indexOf(interest) === index;
    });

    const weightOptions = cameras.map((camera) => {
        return camera.fields.Peso;
    }).filter((weight, index, array) => {
        return array.indexOf(weight) === index;
    });

    const filteredCameras = cameras.filter((camera) => {
        const budgetMarch = budgetFilter === "" || camera.fields.Presupuesto === budgetFilter;
        const goalMatch = goalFilter.length === 0 || camera.fields.Objetivo.includes(goalFilter);
        const interestMatch = interestFilter === "" || camera.fields.Interes === interestFilter;
        const weightMatch = weightFilter === "" || camera.fields.Peso === weightFilter;
        return budgetMarch && goalMatch && interestMatch && weightMatch;
    });

    const parseData = (data) => {
        return data.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    }

    function handleNextQuestion() {
        setCameras(filteredCameras);
        setActiveQuestion(activeQuestion + 1);
        setIsOptionSelected(false);
    }

    function handleFinish() {
        setActiveQuestion(0);
        setCameras(filteredCameras);
    }

    const generateQuestion = (question, questionOptions, setFilter) => {
        return (
                <>
                    <Typography variant='body1' color="secondary" maxWidth={400} fontSize={{ md: 20, xs: 18 }} fontWeight={800}>{question}</Typography>
                    <FormControl>
                        <RadioGroup sx={{ color: "#525252", paddingBottom: 2 }}>
                            {
                                questionOptions.map((option) => {
                                    return (
                                        <FormControlLabel key={parseData(option)} value={option} control={<Radio />} label={option} onChange={(e) => {
                                            setFilter(e.target.value);
                                            setIsOptionSelected(true);
                                        }} />
                                    )
                                })
                            }
                        </RadioGroup>
                        <Button variant="contained" color="primary" sx={styles.components.button} onClick={() => handleNextQuestion()} disabled={!isOptionSelected}>Siguiente</Button>
                    </FormControl>
                </>                
        )
    }

    useEffect(() => {
        getCameras()
        .then((response) => {
            setCameras(response);
            setIsLoaded(true);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ backgroundColor: "#EEFFF6" }}>
                <Container fixed>
                    <Grid container direction="column" justifyContent="center" alignItems="center" paddingY={5} minHeight="auto">
                        {isLoaded ? (
                        <Stack spacing={3} justifyContent="center" alignItems="center">
                            <Typography variant='h1' fontFamily={"Lokanova"} color="primary" textAlign={"center"} fontSize={{ md: 96, xs: 64 }}>Guía de Compra</Typography>
                            <Typography variant='body1' color="secondary" textAlign={"center"} maxWidth={320} fontSize={{ md: 18, xs: 16 }}>Descubre mi recomendación personal en la compra de cámaras</Typography>
                            <Paper elevation={0} sx={{ 
                                width: { 
                                    md: 500, xs: 320
                                },
                                borderRadius: 5,
                                border: "2px solid #2C2C2C",
                                boxShadow: "5px 5px 0px 0px #2C2C2C",
                            }}>
                                <Stack direction="column" padding={4} spacing={2}>
                                
                                {activeQuestion === 1 && (
                                    generateQuestion('¿Cuál es tu presupuesto?', budgetOptions, setBudgetFilter)
                                )}

                                {activeQuestion === 2 && (
                                    generateQuestion('¿Cuál es tu objetivo principal?', goalOptions, setGoalFilter)
                                )}

                                {activeQuestion === 3 && ( interestOptions.length === 1 ? handleFinish() :
                                    generateQuestion('¿Cuál es tu interés?', interestOptions, setInterestFilter)
                                )}

                                {activeQuestion === 4 && ( weightOptions.length === 1 ? handleFinish() :
                                    generateQuestion('¿Cuál es tu peso ideal?', weightOptions, setWeightFilter)
                                )}

                                {activeQuestion >= 5 && handleFinish()}

                                {activeQuestion === 0 && (
                                    <>
                                    <Typography variant='body1' color="secondary" maxWidth={400} fontSize={{ md: 20, xs: 18 }} fontWeight={800}>Mi recomendación:</Typography>
                                    {cameras.map((camera) => {

                                        return (
                                            <Card key={parseData(camera.fields.NombreCamara)} elevation={0} sx={{ display: 'flex', alignItems: "center", paddingBottom: 1 }}>
                                                <CardMedia
                                                component="img"
                                                sx={{
                                                    width: 100,
                                                    minHeight: 100,
                                                    border: "2px solid #2C2C2C",
                                                    borderRadius: 4,
                                                }}
                                                image={camera.fields.Foto[0].url}
                                                alt={`${camera.fields.NombreCamara}`} />
                                                <Box sx={{ display: 'flex', flexDirection: 'column', paddingLeft: 2, }}>
                                                    <Typography variant='body2' color="secondary" fontSize={{ md: 16, xs: 14 }}>{camera.fields.Marca}</Typography>
                                                    <Typography variant='body1' color="primary" fontSize={{ md: 24, xs: 20 }} fontWeight={800}>{camera.fields.NombreCamara}</Typography>
                                                </Box>
                                            </Card>
                                        )
                                    })}
                                    <Button variant="contained" color="primary" sx={styles.components.button} onClick={() => window.location.reload(false)}>Comenzar de nuevo</Button>
                                    </>
                                )}

                                </Stack>
                            </Paper>
                            <Typography variant='body2' color="#9F9F9F" textAlign={"center"} maxWidth={400} fontSize={{ md: 14, xs: 12 }} paddingTop={3}>Hecho por Nicolas Vildósola <br /> Desarrollado por Danilo Alarcón</Typography>
                        </Stack>
                        ) : <CircularProgress />}
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    )
}

export default App