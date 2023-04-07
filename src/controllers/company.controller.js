const Response = require("../utils/response");
const APIError = require("../utils/errors");
const User = require("../models/user.model");
const Company = require("../models/company.model");
const CompanyInviteReq = require("../models/companyInviteReq.modal");

const inviteSomeoneToCompany = async (req, res) => {
  try {
    const email = req.body.email;
    const user = req.user;
    const tempUser = await User.findOne({ email: email });
    const company = await Company.findOne({ ownerId: user._id });
    const companyRequest = new CompanyInviteReq({
      senderId: user._id,
      companyId: company._id,
      receiverId: tempUser._id,
      status: "pending",
    });
    await companyRequest.save();
    return new Response(companyRequest).success(res);
  } catch (error) {
    return new APIError("Error!", 400);
  }
};

const pendingCompanyInvite = async (req, res) => {
  try {
    const companyInvite = await CompanyInviteReq.findOne({
      receiverId: req.user._id,
      status: "pending",
    });
    return new Response(companyInvite).success(res);
  } catch (error) {
    return new APIError("Error!", 400);
  }
};

const responseToInvite = async (req, res) => {
  try {
    const { companyInviteId, status } = req.body;
    const companyInvite = await CompanyInviteReq.findByIdAndUpdate(
      companyInviteId,
      {
        $set: { status: status },
      },
      { new: true }
    );
    if (companyInvite && status === "accepted") {
      const company = await Company.findById(companyInvite.companyId);
      company.employees.push(companyInvite.receiverId);
      await company.save();
    }

    return new Response(companyInvite).success(res);
  } catch (error) {
    return new APIError("Error!", 400);
  }
};

module.exports = {
  inviteSomeoneToCompany,
  pendingCompanyInvite,
  responseToInvite,
};
