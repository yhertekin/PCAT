const Photo = require("../models/Photo");
const fs = require("fs");

exports.getAllPhotos = async (req, res) => {
	const photos = await Photo.find({}).sort("-dateCreated");
	res.render("index", { photos });
};

exports.getPhoto = async (req, res) => {
	const photo = await Photo.findById(req.params.id);
	res.render("photo", { photo });
};

exports.createPhoto = async (req, res) => {
	let image = req.files.image;
	const uploadDir = "public/uploads";
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir);
	}
	let uploadPath = __dirname + "/../public/uploads/" + image.name;
	image.mv(uploadPath, async () => {
		await Photo.create({
			...req.body,
			image: "/uploads/" + image.name,
		});
		res.redirect("/");
	});
};

exports.updatePhoto = async (req, res) => {
	const photo = await Photo.findById(req.params.id);
	photo.title = req.body.title;
	photo.description = req.body.description;
	photo.save();
	res.redirect(`/photos/${photo._id}`);
};

exports.deletePhoto = async (req, res) => {
	const photo = await Photo.findById(req.params.id);
	try {
		const deletedPhoto = __dirname + "/../public" + photo.image;
		fs.unlinkSync(deletedPhoto);
	} catch (e) {
		console.log(e);
	} finally {
		await Photo.findByIdAndRemove(req.params.id);
		res.redirect("/");
	}
};
