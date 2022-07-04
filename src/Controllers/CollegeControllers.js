
const CollegeModel = require("../Models/CollegeModels.js");
const InternModel = require("../Models/InternModels.js");


//*********** Function to capitalize first alphabet of each words in a string *********

const convupper= function startUpperCase(x) {
    const a = x.split(" ");
    for (var i = 0; i < a.length; i++) {
        a[i] = a[i].charAt(0).toUpperCase() + a[i].slice(1).toLowerCase();
    }   
    x = a.join(" ");
    return x
}

//  **************************** API to create college document ********************


const college = async function (req, res) {

    try{

        let data = req.info
        data.fullName=convupper(data.fullName) 
        const createCollege = await CollegeModel.create(data);
        const finelResult=await CollegeModel.findOne({_id:createCollege._id}).select({_id:0,__v:0,createdAt:0,updatedAt:0})
        res.status(201).send({ status: true, data: finelResult })

    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }

}

// ********************** API to get details of interns and college ********************


let getDetails = async function (req, res) {

    try {

        let collegeName = req.query.collegeName
        if (!collegeName) { return res.status(400).send({ status: false, msg: "Collge name is required" }) }
        collegeName = collegeName.trim()
        const findName = await CollegeModel.findOne({ name: collegeName })
        if (!findName) { return res.status(404).send({ status: false, msg: "Collge does not exists" }) }
        const id = findName._id
        const findIntern = await InternModel.find({ collegeId: id }).select({ name: 1, email: 1, mobile: 1 })
        if (!findIntern.length > 0) { return res.status(404).send({ status: false, msg: "No Intern found" }) }
        const newData = {
            name: collegeName.toLowerCase(),
            fullName: findName.fullName,
            logoLink: findName.logoLink,
            interns: findIntern
        }

        return res.status(200).send({ status: true, data: newData })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}

module.exports = { college, getDetails, convupper }