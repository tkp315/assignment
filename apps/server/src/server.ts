import app from "./app.ts";
import dotenv from 'dotenv'

dotenv.config({path:'./.env'});

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`SERVER RUNNING AT ${port}`);
})