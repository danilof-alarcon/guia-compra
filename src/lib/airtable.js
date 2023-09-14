import Airtable from "airtable"

const base = new Airtable({apiKey: import.meta.env.VITE_API_KEY}).base(import.meta.env.VITE_BASE);

async function getCameras() {
    try {
        const records = await base('Camaras').select({
            maxRecords: 100,
            sort: [{field: "Presupuesto", direction: "asc"}, {field: "Objetivo", direction: "asc"}],
        }).all();
        const data = records.map(record => record);
        return data
    } catch (error) {
        console.error('Error fetching Airtable records:', error.message);
    }
}

export default getCameras