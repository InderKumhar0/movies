const db = require("../db");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createActor = catchAsync(async (req, res) => {
  const { name, birthdate } = req.body;

  const [result] = await db.execute(
    "INSERT INTO actors (name, birthdate) VALUES (?, ?)",
    [name, new Date(birthdate)]
  );
  res.status(201).json({ message: "Actor created", result });
});

exports.getAllActors = catchAsync(async (req, res) => {
  const [actors] = await db.execute("SELECT * FROM actors");
  res.json(actors);
});

exports.getActorById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const [actors] = await db.execute("SELECT * FROM actors WHERE id = ?", [id]);
  if (actors.length === 0) {
    return next(new AppError("Actor not found", 404));
  }
  res.json(actors[0]);
});

exports.updateActor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, birthdate } = req.body;
  const [result] = await db.execute(
    "UPDATE actors SET name = ?, birthdate = ? WHERE id = ?",
    [name, new Date(birthdate), id]
  );
  if (result.affectedRows === 0) {
    return next(new AppError("Actor not found", 404));
  }
  res.json({ message: "Actor updated" });
});

exports.deleteActor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const [result] = await db.execute("DELETE FROM actors WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    return next(new AppError("Actor not found", 404));
  }
  res.json({ message: "Actor deleted" });
});
