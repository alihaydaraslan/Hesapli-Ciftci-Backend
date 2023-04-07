const router = require("express").Router();

const {
  inviteSomeoneToCompany,
  responseToInvite,
  pendingCompanyInvite,
} = require("../controllers/company.controller");

const { tokenCheck } = require("../middlewares/auth");

router.post("/invite-someone-to-company", tokenCheck, inviteSomeoneToCompany);
router.get("/pending-company-invites", tokenCheck, pendingCompanyInvite);
router.post("/response-to-invite", tokenCheck, responseToInvite);

// router.post("/verifyotp", verifyotp);

// router.post("/resendotpverificationcode", resendotpverificationcode);

module.exports = router;
