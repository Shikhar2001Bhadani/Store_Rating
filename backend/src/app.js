const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Configure CORS with allowed origins
const allowedOrigins = [
  // Frontend URL from env or default to local development
  process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  // Vercel preview URLs pattern
  /https:\/\/store-rating-.*-shikhars-projects-8c874482\.vercel\.app$/
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => 
      typeof allowedOrigin === 'string' 
        ? allowedOrigin === origin 
        : allowedOrigin.test(origin)
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'), false);
    }
  },
  credentials: true
}));

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stores", require("./routes/storeRoutes"));
app.use("/api/ratings", require("./routes/ratingRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.get("/", (req,res) => res.json({ ok: true }));

module.exports = app;
