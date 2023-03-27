const User = require("../models/user.model");
const { Company } = require("../models/company.model");
const { CompanyInviteReq } = require("../models/companyInviteReq.modal");

const inviteSomeoneToCompany = async (req, res) => {
  const email = req.body.email;
  const user = req.user;
  const tempUser = await User.find({ email: email });
  const company = await Company.find({ ownerId: user_id });
  const companyRequest = CompanyInviteReq({
    senderId: user._id,
    companyId: company._id,
    receiverId: tempUser._id,
    status: "pending",
  });
  await companyRequest.save();
  return new Response(companyRequest).success(res);
};

const pendingCompanyInvite = async (req, res) => {
  const companyInvite = await CompanyInviteReq.findOne({
    receiverId: req.user._id,
    status: "pending",
  });
  return new Response(companyInvite).success(res);
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
