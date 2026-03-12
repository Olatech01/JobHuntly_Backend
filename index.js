require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const cors = require('cors');
const path = require('path');
const connectDB = require('./connectDb/connect')
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes')
const companyRoutes = require('./routes/companyRoutes')

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-very-strong-secret-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 24 * 60 * 60 * 1000, 
        httpOnly: true,
        sameSite: 'lax'
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.use(cors({
    origin: [
        'https://job-huntly-three.vercel.app',
        'http://localhost:3000',
    ],
    credentials: true
}));

// Routes
// app.use("/api", require("./routes/handler"));
app.use("/api/auth", authRoutes);
app.use("/api", jobRoutes);
app.use("/api", companyRoutes);

const PORT = process.env.PORT || 6060;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
    console.log(`Uploads available at: /uploads`);
});