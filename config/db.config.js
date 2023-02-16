const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tastebuds"

mongoose
    .connect(MONGODB_URI)
    .then(() =>
        console.info(`Succesfully connected to the database ${MONGODB_URI}`)
    )
    .catch((error) => 
        console.error(`An error ocurred trying to connect to the database ${MONGODB_URI}`)
    );
    
process.on("SIGINT", function () {
    mongoose.connection.collection(function () {
        console.log("Mongoose disconnected on app termination");
        process.exit(0);
    });
});