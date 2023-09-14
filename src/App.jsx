import { useEffect, useState } from 'react';
import getCameras from './lib/airtable';
import './App.css'

function App() {

    const [cameras, setCameras] = useState([]);

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
            <h1>Cameras</h1>
            <ul>
                {cameras.map((camera) => {
                    return (
                        <li key={camera.id}>
                            <h3>{camera.fields.Marca} {camera.fields.NombreCamara}</h3>
                            <img src={camera.fields.Foto[0].url} alt={camera.fields.NombreCamara} />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default App
