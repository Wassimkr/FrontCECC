import models from "../../../db/models/index";
export default async function handler(req, res) {
  const { email, password } = req.body;
  const user = await models.users.findOne({
    where: { email: email },
    attributes: ["id", "email", "password", "name"],
    limit: 1,
  });
  /* Check if exists */
  if (!user) {
    res.status(400).json({ status: "error", error: "User Not Found" });
    return;
  }
  /* Define variables */
  const dataUser = user.toJSON();
  if (dataUser.password != password) {
    res.status(400).json({ status: "error", error: "User Not Found" });
    return;
  }
  res.status(200).json(dataUser);
}
