const express = require('express');
const morgan = require('morgan');
const fsPromise = require('fs/promises');
const fs = require('fs');
const { body, validationResult } = require('express-validator');

//app
const app = express();

//middleware
app.use(morgan('dev'));
app.use(express.static('public')); //static files
app.use(express.urlencoded({ extended: true })); //feldolgozza az url-t, ami tartalmaz minden adatot LEHET HOGY NEM KELL
app.use(express.json());

app.use((req, res, next) => { //trailing slash redirect
    if (req.path.substr(-1) === '/' && req.path.length > 1) {
        const query = req.url.slice(req.path.length)
        const safepath = req.path.slice(0, -1).replace(/\/+/g, '/')
        res.redirect(301, safepath + query)
    } else {
        next()
    }
})

//endpoints
app.get('/pizza/list', (req, res) => {
    console.log(__dirname);
    res.sendFile(__dirname + '/index.html')
})

function readMyFile(req, res, fileName) {
    fs.readFile(fileName, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Please try again');
        } else {
            console.log('done');
            res.send(JSON.parse(data));
        }
    })
}

app.get('/api/pizza', (req, res) => readMyFile(req, res, 'pizzas.json'));
app.get('/api/allergens', (req, res) => readMyFile(req, res, 'allergens.json'));
app.get('/api/order', (req, res) => readMyFile(req, res, 'pizzas.json'));

app.post('/api/order', //Data validation!
    body('customer.name').isLength({ min: 1 }), //name min length 1
    body('customer.email').isEmail(), //email is an email
    body('customer.phone').isLength({ min: 1 }), //phone number min length 1
    body('customer.address.postcode').isLength({ min: 1 }), //postcode min length 1
    body('customer.address.city').isLength({ min: 1 }), //city min length 1
    body('customer.address.street').isLength({ min: 1 }), //address min length 1
    body('pizzas.*.amount').isInt({ min: 1 }), //pizza min amount 1
    //response
    (req, res) => {
        //console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(500).send('invalid data');
        } else {
            if (!fs.existsSync('orders.json')) {
                fs.writeFileSync('orders.json', "[]");
            }
            fs.readFile('orders.json', (err, data) => {
                if (err) {
                    res.status(500).send('Please try again');
                } else {
                    const currentOrders = JSON.parse(data);
                    const newOrder = { id: "", pizzas: "", date: "", customer: "", comments: "" };
                    newOrder.id = currentOrders.length + 1;
                    newOrder.pizzas = req.body.pizzas;
                    newOrder.customer = req.body.customer;
                    newOrder.comments = req.body.comments;
                    //Object.assign(newOrder, req.body); //ALTERNATIVE, but junk data might be written
                    //JSON fájl olvasása és object létrehozás
                    const todaysDate = new Date().toISOString();
                    //newOrderhez
                    newOrder.date = {
                        year: +todaysDate.slice(0, 4),
                        month: +todaysDate.slice(5, 7),
                        day: +todaysDate.slice(8, 10),
                        hour: +todaysDate.slice(11, 13) + 1, //TODO: USE TIME ZONE INSTEAD
                        minute: +todaysDate.slice(14, 16)
                    }
                    //objectbe beadni az új adatot
                    currentOrders.push(newOrder);
                    console.log(currentOrders);
                    //JSON vissza
                    fs.writeFile('orders.json', JSON.stringify(currentOrders), (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Please try again');
                        } else {
                            console.log('done');
                            res.send('done'); //TODO: Send back some response
                        }
                    })
                }
            })
            //res.send('valid data');
        }
    })

app.use((req, res) => {
    res.status(404).send('Error 404, site not found');
})

//listen
app.listen(3005, () => {
    console.log('Listening on port 3005, http://localhost:3005');
})