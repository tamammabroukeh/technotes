const Note = require("../modules/Note");
const User = require("../modules/User");

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = async (req, res) => {
  // Get all notes from MongoDB
  const notes = await Note.find().lean();
  // If no notes
  if (!notes?.length) {
    return res.status(204).json({ message: "No Found Notes" });
  }

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user };
    })
  );
  res.json(notesWithUser);
};

// @desc add a new note
// @route POST /notes
// @access Private
const createNewNote = async (req, res) => {
  const { user, title, text } = req.body;
  if (!title || !text || !user) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Check for duplicate
  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(400).json({ message: "Duplicate note title" });
  }

  const note = await Note.create({ user, title, text });
  if (note) {
    // created
    return res.status(201).json({ message: "New note created" });
  } else {
    return res.status(400).json({ message: "Invalid note data recieved" });
  }
};
// @desc update a note
// @route PATCH /notes
// @access Private
const updateNote = async (req, res) => {
  const { id, user, title, text, completed } = req.body;
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();
  res.json(`${updatedNote.title} updated`);
};

// @desc Get all notes
// @route GET /notes
// @access Private
const deleteNote = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Note ID is required" });
  }

  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }
  const result = await note.deleteOne();

  const reply = `Note ${note.title} with ID ${note._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
