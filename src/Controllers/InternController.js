const InternModel = require("../Models/InternModels.js");
const CollegeModel=require("../Models/CollegeModels")

function startUpperCase(x) {
    const a = x.split(" ");
    for (var i = 0; i < a.length; i++) {
        a[i] = a[i].charAt(0).toUpperCase() + a[i].slice(1).toLowerCase();
    }
    x = a.join(" ");
    return x
}

const intern = async function (req, res) {
    try {
        let data = req.body;
        let Name = data.name;
        let CollName=data.collegeName.toLowerCase()
        let findCollegeId = await CollegeModel.findOne({name:CollName}).select({_id:1})
        let id=findCollegeId._id
        data.name = startUpperCase(Name);
        let newData = {
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            collegeId:id
        }
        let createIntern = await InternModel.create(newData);
        let finelResult=await InternModel.findOne({_id:createIntern._id}).select({_id:0,__v:0,createdAt:0,updatedAt:0})
      
        res.status(201).send({ status: true, data: finelResult })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }

}


module.exports = {
    intern
}