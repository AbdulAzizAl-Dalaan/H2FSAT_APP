const mongoose = require("mongoose")

const cogTest = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    physicalHealth: {
        type: Number,
        required: true
    },
    mentalHealth: {
        type : Number, 
        required: true
    },
    nutrionalHealth: {
        type: Number,//this may be a number
        required: true
    },
    spiritualHealth: {
        type: Number,
        required: true
    },
    sleepHealth: { 
        type: Number,
        required: true
    },
    totalScore: {
        type: Number,
        required: true
    },
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


module.exports = mongoose.model("cognitiveTest", cogTest)