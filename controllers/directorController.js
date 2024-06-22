const db = require("../db");
const catchAsync = require("../utils/catchAsync");

exports.createDirector = catchAsync(async (req, res) => {
  const { name, birthdate } = req.body;
  const [result] = await db.execute(
    "INSERT INTO directors (name, birthdate) VALUES (?, ?)",
    [name, new Date(birthdate)]
  );
  res
    .status(201)
    .json({ message: "director created", directorId: result.insertId });
});

exports.getAllDirectors = catchAsync(async (req, res) => {
  const [directors] = await db.execute("SELECT * FROM directors");
  res.json(directors);
});

exports.getDirectorById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const [directors] = await db.execute("SELECT * FROM directors WHERE id = ?", [
    id,
  ]);
  if (directors.length === 0) {
    return next(new AppError("director not failed", 404));
  }
  res.json(directors[0]);
});

exports.updateDirector = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, birthdate } = req.body;
  const [result] = await db.execute(
    "UPDATE directors SET name = ?, birthdate = ? WHERE id = ?",
    [name, new Date(birthdate), id]
  );
  if (result.affectedRows === 0) {
    return next(new AppError("director not found failed", 404));
  }
  res.json({ message: "director updated" });
});

exports.deleteDirector = catchAsync(async (req, res) => {
  const { id } = req.params;
  const [result] = await db.execute("DELETE FROM directors WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    return next(new AppError("director not found", 401));
  }
  res.json({ message: "director deleted" });
});
