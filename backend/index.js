import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import mongoose from "mongoose";
import  userRoutes from "./routes/userRouter.js";
import taskRoutes from "./routes/taskRoutes.js"

dotenv.config()

mongoose.connect(process.env.MONGO_DB).then(()=>{
    console.log("MongoDB Connected");
}).catch((err)=>{
    console.log(err)
})


const app = express();
const  port = process.env.PORT ;


app.use(express.json());

app.use(cors())



app.listen(port, () => {
    console.log(`Server is running on port ${port} `);
})


app.use("/api",userRoutes);
app.use('/api/task',taskRoutes);


export default app;