const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// --- START OF CHANGES ---

// List of allowed origins for CORS
const allowedOrigins = [
  // Your primary frontend URL from environment variables
  process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  // A regular expression to match all Vercel preview URLs for your project
  /https:\/\/store-rating-.*-shikhars-projects-8c874482\.vercel\.app$/
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin is in our allowed list
    if (allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      }
      // If it's a regex, test it against the origin
      return allowedOrigin.test(origin);
    })) {
      callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      callback(new Error(msg), false);
    }
  },
  credentials: true
}));

// --- END OF CHANGES ---


// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stores", require("./routes/storeRoutes"));
app.use("/api/ratings", require("./routes/ratingRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.get("/", (req,res) => res.json({ ok: true }));

module.exports = app;
