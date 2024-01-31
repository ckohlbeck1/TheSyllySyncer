const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:sylly@syllydatabase.wigycux.mongodb.net/")
.then(()=>{
    console.log("mongo connected");
})
.catch(()=>{
    console.log("failed to connect");
});

const syllySchema = new mongoose.Schema({
    username:{
        type: String,
        rquired:true
    },
    password:{
        type: String,
        required: true
    }
});

const collection = new mongoose.model("LogInCollection", syllySchema);

module.exports = collection;