const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Database connection failed:', err));

// Models
const Patient = mongoose.model('Patient', new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}));

const Appointment = mongoose.model('Appointment', new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    providerId: { type: String }, // Simulating provider as string for simplicity
    date: { type: Date, required: true },
    notes: { type: String },
}));

// Middleware for authentication
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token is required');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        req.user = decoded;
        next();
    });
};

// Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const patient = new Patient({ ...req.body, password: hashedPassword });
        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const patient = await Patient.findOne({ email: req.body.email });
        if (patient && await bcrypt.compare(req.body.password, patient.password)) {
            const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, patient });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/appointments', verifyToken, async (req, res) => {
    try {
        const appointment = new Appointment({ ...req.body, patientId: req.user.id });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.get('/api/appointments', verifyToken, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user.id }).populate('providerId');
        res.json(appointments);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running ....`);
});
