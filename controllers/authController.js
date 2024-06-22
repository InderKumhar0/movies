const db = require("./../db");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, photo, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const apiKey = crypto.randomBytes(16).toString("hex");

  const [result] = await db.execute(
    "INSERT INTO users (name, email, password, photo, role, api_key) VALUES (?, ?, ?, ?, ?, ?)",
    [name, email, hashedPassword, photo, role, apiKey]
  );
  res
    .status(201)
    .json({ message: "User created", userId: result.insertId, apiKey });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return next(new AppError('Authentication failed', 401))
    }
    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.PASSWORD);
    if (!isValid) {
      return next(new AppError('Authentication failed', 401))
    }

    const token = crypto.randomBytes(32).toString("hex");

    await db.execute("UPDATE users SET token = ? WHERE id = ?", [
      token,
      user.id,
    ]);

    res.json({ apiKey: user.api_key, token });
});

exports.users = async (req, res) => {
  const [results] = await db.execute("SELECT * FROM users");

  return res.status(200).json({
    results,
  });
};
