
const CollegeModels = require("./Models/CollegeModels");
const InternModel = require("./Models/InternModels")

//         **************************** Regex ****************************

const mobile1 = /^[0-9]{10}$/;
const re = /^[a-zA-Z\-]+$/;
const fn = /^[a-zA-Z ]*$/;
const email1 = /^[a-zA-Z][a-zA-Z0-9\-\_\.]+@[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}$/;
const regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

//**************************** Function to check user input ****************************

function x(data) {
    if (!data || data == null || data === undefined ) return false;
    return true
}

//**************************** Function to check input object ****************************

const checkBody = async function (req, res, next) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, msg: "Bad request- Please enter details in the request Body " }) }
        next()
    } catch (err) {
        res.status(500).send({ error: err.messsage })
    }
}


//         **************************** Middleware 1 ****************************
//                                     (Use in API 1)

const validator1 = async function (req, res, next) {

    try {

         let data=req.body
         data= JSON.parse(JSON.stringify(data).replace(/"\s+|\s+"/g,'"'))
         const {name, fullName, logoLink }=data

        if (!x(name)) return res.status(400).send({ status: false, message: "Please enter name" })
        if (!name.match(re)) return res.status(400).send({ status: false, message: "Please enter valid name" })
        let usedname = await CollegeModels.findOne({ name: name })
        if (usedname) return res.status(400).send({ status: false, message: "This name is already been used" })

        if (!x(fullName)) return res.status(400).send({ status: false, message: "Please enter fullName" })  

        if (!x(logoLink)) return res.status(400).send({ status: false, message: "Please enter LogoLink" })
        if (!logoLink.match(regex)) return res.status(400).send({ status: false, message: "Please enter valid LogoLink" })
         
        req.info=data
        next()

    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}

//         **************************** Middleware 2 ****************************
//                                     (Use in API 2)

const validator2 = async function (req, res, next) {

    try {

        let data=req.body
        data= JSON.parse(JSON.stringify(data).replace(/"\s+|\s+"/g,'"'))
        const {name, email, mobile, collegeName} = data

        if (!x(name)) return res.status(400).send({ status: false, message: "Please enter name" });
        if (!name.match(fn)) return res.status(400).send({ status: false, message: "Please enter valid name" })
        
        if (!x(email)) return res.status(400).send({ status: false, message: "Please enter email" })
        if (!email.match(email1)) return res.status(400).send({ status: false, message: "Please Enter Valid email" })
        const usedemail = await InternModel.findOne({ email: email })
        if (usedemail) return res.status(400).send({ status: false, message: "This emailId has already been used" })

        if (!mobile) return res.status(400).send({ status: false, message: "Please enter mobile" })
        if (!mobile.match(mobile1)) return res.status(400).send({ status: false, message: "Please Enter Valid Mobile Number" })
        const usedmobile = await InternModel.findOne({ mobile: mobile })
        if (usedmobile) return res.status(400).send({ status: false, message: "This mobile number has already been used" })

        if (!x(collegeName)) return res.status(400).send({ status: false, message: "Please enter collegeName" })
        if (!collegeName.match(re)) return res.status(400).send({ status: false, message: "Please enter valid collegeName" })
        const presentCollegeName = await CollegeModels.findOne({ name: collegeName })
        if (!presentCollegeName) return res.status(404).send({ status: false, message: "college not exist" })

        req.info=data
        req.id=presentCollegeName.id
        next();

    } catch (err) {
        res.status(500).send({ error: err.message })
    }

}

module.exports = { validator1, validator2, checkBody }