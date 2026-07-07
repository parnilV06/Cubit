require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello Cubit!');
});

// API Health Check
app.get('/api/health', async(req,res)=>{
    try {
        res.status(200).json({ message: 'Server is healthy' });
    } catch (error) {
        console.error('Error checking API health:', error);
        res.status(500).json({ message: 'API health check failed' });
    }
});


// mounting routers
const cubitRoutes = require('./routes/cubit.routes');
app.use('/api', cubitRoutes);

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectDB();
});