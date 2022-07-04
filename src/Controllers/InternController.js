const InternModel = require("../Models/InternModels.js");
const convupper=require('../Controllers/CollegeControllers.js')


//  **************************** API to create intern document ********************


const intern = async function (req, res) {
    try {
        let data = req.info;
        let Name = data.name;
        data.name = convupper.convupper(Name);
        const id=req.id
        const newData = {
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            collegeId:id
        }
        const createIntern = await InternModel.create(newData);
        const finelResult=await InternModel.findOne({_id:createIntern._id}).select({_id:0,__v:0,createdAt:0,updatedAt:0})
      
        res.status(201).send({ status: true, data: finelResult })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }

}


module.exports = { intern }