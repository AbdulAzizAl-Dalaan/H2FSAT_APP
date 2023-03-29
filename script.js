const mongoose = require("mongoose")
const Soldier = require("./Soldier")//importing the soldier schema

const uriNew = "mongodb+srv://aaronsS:psswd@h2fsat.ovtauii.mongodb.net/test"
const uriT = "mongodb+srv://aaronsS:psswd@h2fsat.ovtauii.mongodb.net/test";//change test to something else to create a new database
// main().catch(err => console.log(err))
mongoose.connect(uriNew)//uri, {useNewUrlParser: true, useUnifiedTopology: true},() => console.log("mongoose is connected")"mongodb://localhost/testdb"
//mongoose.connect(uriT, {useNewUrlParser: true, useUnifiedTopology: true},() => console.log("mongoose is connected"))

run()
async function run(){
    try{
    const soldier = await Soldier.create({
        uic: "SubuClass", 
        name: "Aaron Straka",
        unit: "team1",//this may be a number
        email: "AAron.straka@wsu.edu",
        age: 22,
        gender: "Male",
        occupation: "Computer science",
        rank: "no rank",
        

        })
    // soldier.name = "Ben R"//changing a name 
    // await soldier.save()
    console.log(soldier)}catch(e){
        console.log(e.message)
    }
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