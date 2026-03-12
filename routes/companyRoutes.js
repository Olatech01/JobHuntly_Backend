const express = require("express");
const { auth } = require("../middleWare/auth");
const { getAllCompany } = require("../controller/company");




const router = express.Router();

router.get("/allCompanies", auth, getAllCompany)



module.exports = router;