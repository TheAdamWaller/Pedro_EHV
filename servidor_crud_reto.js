const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Traemos la cadena de conexion de mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://Pedro:src21@cluster0.6nupw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Creamos la conexion
const cliente = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// CRUD --> Create, Retrieve, Update y Delete

// CREATE
app.post('/vehiculos', async (req, res) => {
    try {
        const { id, marca, modelo, placa, color, año } = req.body;
        await cliente.connect();
        const db = cliente.db('MiBaseDatos');
        const coleccion = db.collection("vehiculos");
        await coleccion.insertOne({ id, marca, modelo, placa, color, año });
        res.send("Vehículo insertado con éxito.");
    } finally {
        await cliente.close();
    }
});

// READ
app.get('/vehiculos', async (req, res) => {
    try {
        await cliente.connect();
        const db = cliente.db('MiBaseDatos');
        const coleccion = db.collection("vehiculos");
        const data = await coleccion.find({}).toArray();
        res.json(data);
    } finally {
        await cliente.close();
    }
});

// UPDATE
app.put('/vehiculos', async (req, res) => {
    try {
        const { id, marca, modelo, placa, color, año } = req.body;
        await cliente.connect();
        const db = cliente.db('MiBaseDatos');
        const coleccion = db.collection("vehiculos");
        await coleccion.updateOne(
            { id: id },
            { $set: { marca, modelo, placa, color, año } }
        );
        res.send("Vehículo actualizado.");
    } finally {
        await cliente.close();
    }
});

// DELETE
app.delete('/vehiculos', async (req, res) => {
    try {
        const { id } = req.body;
        await cliente.connect();
        const db = cliente.db('MiBaseDatos');
        const coleccion = db.collection("vehiculos");
        await coleccion.deleteOne({ id: id });
        res.send("Vehículo eliminado.");
    } finally {
        await cliente.close();
    }
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

app.listen(port, () => {
    console.log(`Server attending at ${port}`);
});
