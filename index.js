const express = require('express');
const app = express();
let countries = require('./countries.json');
const { body, validationResult } = require('express-validator');
const validating = (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        console.log("Hello");
        return response.status(400).json({ errors: errors.array() });
    }
    next();
}
const validateAplha2Code = body('alpha2Code').isLength({ min: 2, max: 2 });
const validateAplha3Code = body('alpha3Code').isLength({ min: 3, max: 3 });
const validateVisited = body('visited').equals('false');

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res, next) => {
    res.sendFile(__dirname+'/index.html');
});

countries = countries.map(country => ({...country, visited: false}) );

app.get('/api/countries', (req, res, next) => {
    const sortedCountries = countries.sort((a, b) => a.name.localeCompare(b.name));
    res.send(sortedCountries);
});

app.post('/api/countries', validateAplha2Code, validateAplha3Code, validateVisited, validating,
    (req, res, next) => {
        console.log(req.body);
        if(countries.some(country => country.alpha2Code === req.body.alpha2Code) 
            || countries.some(country => country.alpha3Code === req.body.alpha3Code)
            || countries.some(country => country.id === req.body.id) ) {
            return res.status(500).send('The country that you entered already exists!');
        } else {
            countries.push(req.body);
            const sortedCountries = countries.sort((a, b) => a.name.localeCompare(b.name));
            res.send(sortedCountries);
        }
    }
)

app.get('/api/countries/:code', (req, res, next) => {
    const { code } = req.params;
    if(countries.some(country => country.alpha2Code === code) === false 
    && countries.some(country => country.alpha3Code === code) === false ) {
        return res.status(500).send('The country that you entered does not exist!'); 
    }
    const countryToDisplay = countries.filter(country => country.alpha2Code === code 
        || country.alpha3Code === code );
    res.send(countryToDisplay);
})

app.put('/api/countries/:code', validateAplha2Code, validateAplha3Code, validateVisited, validating,
    (req, res, next) => {
        const { code } = req.params;
        if(countries.some(country => country.alpha2Code === req.body.alpha2Code) 
            && countries.some(country => country.alpha3Code === req.body.alpha3Code) ) {   
                const index = countries.findIndex(country => country.alpha2Code === code
                    || country.alpha3Code ===code );
                countries[index] = req.body;
                res.send(countries);
        } else {
                res.status(500).send('The country that you entered does not exist!'); 
        }
    }
)

/*
app.delete('/api/countries/:code', (req, res, next) => {
    const { code } = req.params;
    const index = countries.findIndex(country => country.alpha2Code === code
        || country.alpha3Code ===code );
    const countriesDeleted = countries.splice(index, 1);
    res.send(countriesDeleted);
})
*/

app.delete('api/countries/:code', )





app.listen(port, () => console.log(`Server is listening to port ${port}`));