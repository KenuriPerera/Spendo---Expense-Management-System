const express = require("express");
const router = express.Router();
const spendoController = require("../controllers/spendoController");

// CRUD Routes
router.get("/", spendoController.getAll);         // Get all records
router.post("/", spendoController.create);        // Create new record
router.get("/:id", spendoController.getById);     // Get record by ID
router.put("/:id", spendoController.update);      // Update record
router.delete("/:id", spendoController.delete);   // Delete record

module.exports = router;
