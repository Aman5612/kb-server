const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3001;
app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "/public")));

const todoSchema = new mongoose.Schema({
  priority: String,
  title: String,
  body: String,
});

mongoose.connect(
  "mongodb+srv://aman5612:hUw42fXicveWNNc6@cluster0.cqhprto.mongodb.net/?retryWrites=true&w=majority",
  {
    dbName: "kanban",
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

const todolist = mongoose.model("todolist", todoSchema);
const underProcess = mongoose.model("underProcess", todoSchema);
const completed = mongoose.model("completed", todoSchema);

app.get("/gettasks", async (req, res) => {
  try {
    const todos = await todolist.find();
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/gettasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const id = JSON.parse(taskId);
  try {
    const todos = await todolist.findById(id);
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/underProcessTasks", async (req, res) => {
  try {
    const todos = await underProcess.find();
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/underProcessTask/:id", async (req, res) => {
  const taskId = req.params.id;
  const id = JSON.parse(taskId);
  try {
    const todos = await underProcess.findById(id);
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/completedTasks", async (req, res) => {
  try {
    const todos = await completed.find();
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/tasks", async (req, res) => {
  const { title, body, priority } = req.body;
  try {
    const newTask = todolist.create({ title, body, priority });
    res.json(newTask);
  } catch (error) {
    console.error("Error adding todo:", error);
  }
});
app.post("/underProcessTask", async (req, res) => {
  const { title, body, priority } = req.body;
  try {
    const newTask = underProcess.create({ title, body, priority });
    res.json(newTask);
  } catch (error) {
    console.error("Error adding todo:", error);
  }
});
app.post("/completedTask", async (req, res) => {
  const { title, body, priority } = req.body;
  try {
    const newTask = completed.create({ title, body, priority });
    res.json(newTask);
  } catch (error) {
    console.error("Error adding todo:", error);
  }
});

app.put("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const id = JSON.parse(taskId);
  const { title, body, priority } = req.body;
  try {
    const updatedTask = await todolist.findOneAndUpdate(
      { _id: id },
      { title, body, priority },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/underProcessTask/:id", async (req, res) => {
  const taskId = req.params.id;
  const id = JSON.parse(taskId);
  const { title, body, priority } = req.body;
  try {
    const updatedTask = await underProcess.findOneAndUpdate(
      { _id: id },
      { title, body, priority },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const id = JSON.parse(taskId);
  try {
    const deletedTask = await todolist.findOneAndDelete({ _id: id });
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/underProcessTask/:id", async (req, res) => {
  const taskId = req.params.id;
  const id = JSON.parse(taskId);
  try {
    const deletedTask = await underProcess.findOneAndDelete({ _id: id });
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/completedTask/:id", async (req, res) => {
  const taskId = req.params.id;
  const id = JSON.parse(taskId);
  try {
    const deletedTask = await completed.findOneAndDelete({ _id: id });
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running `);
});
