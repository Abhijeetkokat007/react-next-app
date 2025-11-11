import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

// Routes
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello! Node + SQL server is running.");
  res.end();
  
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
