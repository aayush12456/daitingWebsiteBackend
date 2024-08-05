const mongoose=require('mongoose')
// mongodbCompass local database configuration
// mongoose.connect("mongodb://127.0.0.1/dateApplication").then(()=>{
//     console.log("Database connected successfully")
// }).catch(()=>{
//     console.log("unable to connect ")
// })
mongoose.connect("mongodb+srv://apnapan96:12345@apnapancluster.dmqxm67.mongodb.net/ApnaPanDatabase?retryWrites=true&w=majority&appName=ApnaPanCluster",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase the server selection timeout
    socketTimeoutMS: 45000 
}).then(()=>{
    console.log("Database connected successfully")
}).catch(()=>{
    console.log("unable to connect ")
})
