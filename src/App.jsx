import { useEffect, useState } from 'react';
import getCameras from './lib/airtable';
import Fade from '@mui/material/Fade';
import './App.css'

function App() {

    const [cameras, setCameras] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(1);
    const [budgetFilter, setBudgetFilter] = useState('');
    const [goalFilter, setGoalFilter] = useState([]);
    const [interestFilter, setInterestFilter] = useState('');
    const [weightFilter, setWeightFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
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

    const brandOptions = cameras.map((camera) => {
        return camera.fields.Marca;
    }).filter((brand, index, array) => {
        return array.indexOf(brand) === index;
    });

    const filteredCameras = cameras.filter((camera) => {
        const budgetMarch = budgetFilter === "" || camera.fields.Presupuesto === budgetFilter;
        const goalMatch = goalFilter.length === 0 || camera.fields.Objetivo.includes(goalFilter);
        const interestMatch = interestFilter === "" || camera.fields.Interes === interestFilter;
        const weightMatch = weightFilter === "" || camera.fields.Peso === weightFilter;
        const brandMatch = brandFilter === "" || camera.fields.Marca === brandFilter;
        return budgetMarch && goalMatch && interestMatch && weightMatch && brandMatch;
    });

    const parseData = (data) => {
        return data.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    }

    const generateQuestionField = (question, questionNumber, questionKey, questionOptions, setFilter) => {
        return (
            <Fade in={activeQuestion === questionNumber}>
                <div className={`${questionKey}-filter`} id={`${questionNumber}`}>
                    <h2>{question}</h2>
                    {questionOptions.map((option) => {
                        return (
                            <div key={option}>
                                <input type="radio" id={parseData(option)} name={parseData(questionKey)} value={option} onChange={(e) => {
                                    setFilter(e.target.value)
                                    setIsOptionSelected(true)
                                }}/>
                                <label htmlFor={parseData(option)}>{option}</label>
                            </div>
                        )
                    })}
                    <button onClick={() => handleNextQuestion()} disabled={!isOptionSelected}>
                    Next
                    </button>
                </div>
            </Fade>
        )
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


    useEffect(() => {
        getCameras()
        .then((response) => {
            setCameras(response);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <div>
            <h1>Camera Finder</h1>

            {activeQuestion === 1 && (
                generateQuestionField('What is your budget?', 1, 'budget', budgetOptions, setBudgetFilter)
            )}

            {activeQuestion === 2 && (
                generateQuestionField('What is your main goal?', 2, 'goal', goalOptions, setGoalFilter)
            )}

            {activeQuestion === 3 && ( interestOptions.length === 1 ? handleFinish() :
                generateQuestionField('What is your main interest?', 3, 'interest', interestOptions, setInterestFilter)
            )}

            {activeQuestion === 4 && ( weightOptions.length === 1 ? handleFinish() :
                generateQuestionField('Do you mind about weight?', 4, 'weight', weightOptions, setWeightFilter)
            )}

            {activeQuestion >= 5 && handleFinish()}


            {activeQuestion === 0 &&
                <Fade in={activeQuestion === 0}>
                    <div className="results">
                        <h2>Results</h2>
                            {brandOptions.length > 1 && (
                                <div className='brand-filter'>
                                    <h3>Filter by Brand</h3>
                                    {brandOptions.map((brand) => {
                                        return (
                                            <div key={brand}>
                                                <input type="radio" id={parseData(brand)} name='brand' value={brand} onChange={(e) => setBrandFilter(e.target.value)} checked={brandFilter === brand} />
                                                <label htmlFor={parseData(brand)}>{brand}</label>
                                            </div>
                                        )
                                    })}
                                    <button onClick={() => setBrandFilter('')}>Reset</button>
                                </div>
                            )}
                        
                        {filteredCameras.map((camera) => {
                            return (
                                <div key={camera.id} className="camera">
                                    <h3>{camera.fields.Marca} {camera.fields.NombreCamara}</h3>
                                    <img src={camera.fields.Foto[0].url} alt={camera.fields.Nombre} />
                                </div>
                            )
                        })}
                    </div>
                </Fade>
            }
        </div>
    )
}

export default App