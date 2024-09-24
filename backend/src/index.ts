import express from 'express';
import userRoutes from './routes/UserRoutes.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use('/api', userRoutes);

app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
