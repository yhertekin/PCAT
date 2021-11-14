const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const fileUpload = require("express-fileupload");

const photoController = require("./controllers/photoController");
const pageController = require("./controllers/pageController");

// const ejs = require("ejs");
// const path = require("path");

const app = express();
// connect database
mongoose.connect("Add Your Connection String");

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

app.get("/", photoController.getAllPhotos);
app.get("/photos/:id", photoController.getPhoto);
app.post("/photos", photoController.createPhoto);
app.put("/photos/:id", photoController.updatePhoto);
app.delete("/photos/:id", photoController.deletePhoto);

app.get("/add", pageController.getAddPage);
app.get("/about", pageController.getAboutPage);
app.get("/photos/edit/:id", pageController.getEditPage);

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`Server started at port: ${port}`);
});
