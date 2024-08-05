const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
// mongodbCompass local database configuration
// mongoose.connect("mongodb://127.0.0.1/dateApplication").then(()=>{
//     console.log("Database connected successfully")
// }).catch(()=>{
//     console.log("unable to connect ")
// })
mongoose.connect(process.env.MONGODB_CONNECT_URL).then(()=>{
    console.log("Database connected successfully")
}).catch(()=>{
    console.log("unable to connect ")
})
