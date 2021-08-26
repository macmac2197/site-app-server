import express from 'express';
import cors from 'cors';
import bodyPparser from 'body-parser';
import mongoose from 'mongoose';
import env from 'dotenv';

// Routes
import postRoutes from './routes/posts.js';
import authRoutes from './routes/authRoutes.js';
env.config();

const app = express();

app.use(bodyPparser.json({ limit: "30mb", extended: "true" }));
app.use(bodyPparser.urlencoded({ limit: "30mb", extended: "true" }));
app.use(cors());

// Routes path
app.use('/posts', postRoutes);
app.use('/auth', authRoutes)

// Display if app is running
app.get('/', (req, res) => {
    res.send('App is runing!');
})

// Database URL connect to mongodb server
// const CONNECTION_URL = "mongodb+srv://macmac:macmac123@cluster0.4xjwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5002;


mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);
