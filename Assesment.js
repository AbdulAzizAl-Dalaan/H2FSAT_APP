const mongoose = require("mongoose")

const assesmentCreation = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    possAns1: {
        type : String, 
        required: false
    },
    possAns2: {
        type: String,//this may be a number
        required: false
    },
    possAns3: {
        type: String,
        required: false
    },
    possAns4: { 
        type: String,
        required: false
    },
    correctAns: {
        type: String,
        required: false
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


module.exports = mongoose.model("Assesment", assesmentCreation)