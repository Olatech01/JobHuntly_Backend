const express = require("express");
const { auth, companyAuth } = require("../middleWare/auth");
const { getAllCompany } = require("../controller/company");
const { addTeam, allteamByCompany } = require("../controller/team");
const { upload } = require("../config/multerConfig");




const router = express.Router();

router.get("/allCompanies", auth, getAllCompany)




router.post(
   "/team",
   auth,
   companyAuth,
   upload.single("teamImage"),
   addTeam
);


router.get("/company/team", auth, companyAuth, allteamByCompany);



module.exports = router;