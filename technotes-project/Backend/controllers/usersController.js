const User = require("../modules/User");
const Note = require("../modules/Note");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();
  console.log(users);
  if (!users?.length) {
    return res.status(400).json({ message: "No Found Users" });
  }
  res.json(users);
};

// @desc create a new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const { username, password, roles } = req.body;
  // console.log(username);
  // console.log(Array.isArray(roles));
  // console.log(password);
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username!" });
  }
  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject =
    !Array.isArray(roles) || !roles?.length
      ? { username, password: hashedPwd }
      : { username, password: hashedPwd, roles };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: `Invalid user data recieved` });
  }
};

// @desc update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { id, username, password, roles, active } = req.body;
  // Confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles?.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate username
  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  // Allow updates to the original user
  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;
  user.active = active;
  user.roles = roles;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
};

// @desc delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user still have assigned notes?
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${user.username} with ID ${user._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
