const User = require("../models/user.model");
const { Company } = require("../models/company.model");
const { CompanyInviteReq } = require("../models/companyInviteReq.modal");
const Response = require("../utils/response");

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
    console.log(error);
  }
};

const pendingCompanyInvite = async (req, res) => {
  const companyInvite = await CompanyInviteReq.findOne({
    receiverId: req.user._id,
    status: "pending",
  });
  const messege = `${req.user.name} wants to add you`;
  return new Response({
    companyInviteReq: companyInvite,
    messege: messege,
  }).success(res);
};

const responseToInvite = async (req, res) => {
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
    await User.findByIdAndUpdate(req.user._id, {
      $set: { primalCompany: company._id },
    });
    company.employees.push(companyInvite.receiverId);
    await company.save();
  }

  return new Response(companyInvite).success(res);
};

module.exports = {
  inviteSomeoneToCompany,
  pendingCompanyInvite,
  responseToInvite,
};
