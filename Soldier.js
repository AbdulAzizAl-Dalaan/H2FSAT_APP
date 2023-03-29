const mongoose = require("mongoose")

const soliderschema = new mongoose.Schema({
    uic: {//requiring that the soldier gives the code
        type: String,
        required: true
    },//unit identification code
    name: {
        type: String,
        required: true
    },
    email: {
        type : String, //username
        required: true,
        lowercase: true
    },
    unit: {
        type: String,//this may be a number
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: String,
    occupation: String,
    rank: String,
    createdAt: {
        type: Date,
        imutable: true,//dont allow its creation data to change
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    }
    //have to decide if we will keep scores in here as well
})


module.exports = mongoose.model("Soldier", soliderschema)