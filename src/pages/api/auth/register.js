import models from "../../../db/models/index";
export default async function handler(req, res) {
  const { email, password, name } = req.body;
  const newUser = await models.users.create({
    email,
    password,
    name,
  });
  return res.status(200).json(newUser);
}
