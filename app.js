const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const fileUpload = require("express-fileupload");
const fs = require("fs");
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
app.use(fileUpload());
app.use(
	methodOverride("_method", {
		methods: ["POST", "GET"],
	})
);

app.get("/", async (req, res) => {
	const photos = await Photo.find({}).sort("-dateCreated");
	res.render("index", { photos });
});

app.get("/photos/:id", async (req, res) => {
	const photo = await Photo.findById(req.params.id);
	res.render("photo", { photo });
});

app.get("/add", (req, res) => {
	res.render("add");
});

app.get("/about", (req, res) => {
	res.render("about");
});

app.post("/photos", async (req, res) => {
	let image = req.files.image;
	const uploadDir = "public/uploads";

	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir);
	}

	let uploadPath = __dirname + "/public/uploads/" + image.name;

	image.mv(uploadPath, async () => {
		await Photo.create({
			...req.body,
			image: "/uploads/" + image.name,
		});
		res.redirect("/");
	});
});

app.get("/photos/edit/:id", async (req, res) => {
	const photo = await Photo.findById(req.params.id);
	res.render("edit", { photo });
});

app.put("/photos/:id", async (req, res) => {
	const photo = await Photo.findById(req.params.id);
	photo.title = req.body.title;
	photo.description = req.body.description;
	photo.save();
	res.redirect(`/photos/${photo._id}`);
});

app.delete("/photos/:id", async (req, res) => {
	const photo = await Photo.findById(req.params.id);
	const deletedPhoto = __dirname + "/public" + photo.image;
	fs.unlinkSync(deletedPhoto);
	await Photo.findByIdAndRemove(req.params.id);
	res.redirect("/");
});

const port = 3000;
app.listen(port, () => {
	console.log(`Server started at port: ${port}`);
});
