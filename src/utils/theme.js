import { createTheme } from '@mui/material/styles';

const theme = createTheme({

    palette: {
        primary: {
            main: '#2C2C2C',
        },
        secondary: {
            main: '#525252',
        }
    },
    typography: {
        fontFamily: ['Montserrat', "sans-serif"].join(","),
    },
});

export default theme