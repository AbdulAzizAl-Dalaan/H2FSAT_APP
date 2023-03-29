const mongoose = require("mongoose")
const Soldier = require("./Soldier")//importing the soldier schemad
const Test = require("./assesQues")
const CogTest = require("./cognitiveTest")

const uriNew = "mongodb+srv://aaronsS:psswd@h2fsat.ovtauii.mongodb.net/test"
const uriT = "mongodb+srv://aaronsS:psswd@h2fsat.ovtauii.mongodb.net/test";//change test to something else to create a new database
// main().catch(err => console.log(err))
mongoose.connect(uriNew)//uri, {useNewUrlParser: true, useUnifiedTopology: true},() => console.log("mongoose is connected")"mongodb://localhost/testdb"
//mongoose.connect(uriT, {useNewUrlParser: true, useUnifiedTopology: true},() => console.log("mongoose is connected"))

run()
async function run(){
    // try{
    // const soldier = await Soldier.create({
    //     uic: "SubuClass", 
    //     name: "Hello Man",
    //     unit: "team1",//this may be a number
    //     email: "AAron.straka@wsu.edu",
    //     age: 22,
    //     gender: "Male",
    //     occupation: "Computer science",
    //     rank: "no rank",
        

    //     })
    // //soldier.name = "Ben R"//changing a name 
    // await soldier.save()
    // console.log(soldier)}catch(e){
    //     console.log(e.message)
    // }


    //putting in written question
    //create new
    // try{
    //     const question = await Test.create({
    //         question: "32. temp question",
    //         section: "test Section",
    //         possAns1: "a.   test1",
    //         possAns2: "b.   test2",
    //         possAns3: "c.   test3",
    //         possAns4: "d.   test4",
    //         correctAns: "b. test2"
    //     })
            
    //     await question.save()
    //     console.log(question)}catch(e){
    //         console.log(e.message)
    //     }


    //Update
    try {
        const newQ = await Test.findOne({question: /^31/})
        // newQ.set({section: "sleep sleep"})
        // await newQ.save()

        console.log(newQ)}catch(e){
            console.log(e.message)
        }

    //Delete
    // try {
    //     const delNewQ = await Test.deleteOne({section: "sleep sleep"})
        
    //     //await delNewQ.save()

    //     console.log(delNewQ)}catch(e){
    //         console.log(e.message)
    //     }




    //Cognitive creation**************************
    // try {
    //     const newCogTest = await CogTest.create({
    //         question: "Current (past 7 days) self-rating of my:",
    //         physicalHealth: 0,
    //         mentalHealth: 0,
    //         nutrionalHealth: 0,
    //         spiritualHealth: 0,
    //         sleepHealth: 0,
    //         totalScore: 0
    //     })
    //     console.log(newCogTest)}catch(e){
    //         console.log(e.message)
    //     }







}


// async function main(){
//     await mongoose.connect("mongodb://127.0.0.1:27017/H2FSAT")//idk if this connects to cloud
// }

try{
//use this to find out exactly what your error is 
}catch (e){
    console.log(e.message)//prints the error message
}

// run2()
// async function run2(){
//     try{
//         const soldier = await Soldier.findOne({name: "Aaron"})
//         console.log(soldier)
// }catch (e){
//     console.log(e.message)//prints the error message
// }
// }