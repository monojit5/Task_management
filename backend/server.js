import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import cors from 'cors';
import createDb from './src/database/db.js';
import userRoute from './src/routes/userRoute.js';
import taskRoute from './src/routes/taskRoute.js';
const app = express()
import dns from 'node:dns/promises';
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const port = process.env.PORT||8000;
app.use(cors({
    origin:process.env.FRONTEND_URL||"http://localhost:5173",
    methods:"GET, POST, DELETE, PATCH, PUT"
}))
app.use(express.json());

app.use("/user",userRoute );
app.use("/user", taskRoute)
createDb()

app.listen(port, () => console.log(`Example app listening on port ${port}!`))