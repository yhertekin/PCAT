const express = require("express");
const mongoose = require("mongoose");

const Photo = require("./models/Photo");

// const ejs = require("ejs");
// const path = require("path");

const app = express();
// connect database
mongoose.connect("mongodb://localhost/pcat-test-db");

app.set("view engine", "ejs");

//middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
	const photos = await Photo.find({});
	res.render("index", { photos });
});

app.get("/add", (req, res) => {
	res.render("add");
});

app.get("/about", (req, res) => {
	res.render("about");
});

app.post("/photos", async (req, res) => {
	await Photo.create(req.body);
	res.redirect("/");
});

const port = 3000;
app.listen(port, () => {
	console.log(`Server started at port: ${port}`);
});
