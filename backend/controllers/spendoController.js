const Spendo = require("../model/spendoModel");

exports.getAll = async (req, res) => {
  try {
    const records = await Spendo.find().sort({ date: -1 });
    res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).json({ message: "Error fetching records", error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, type, date, category, amount, description } = req.body;
    if (!title || !type || !category || !date || !amount) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newRecord = new Spendo({
      title: title.trim(),
      type,
      date,
      category,
      amount: parseFloat(amount),
      description: description?.trim(),
    });

    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    console.error("Error creating record:", err);
    res.status(400).json({ message: "Error creating record", error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const record = await Spendo.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ message: "Error fetching record", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Spendo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: "Error updating record", error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Spendo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting record", error: err.message });
  }
};
