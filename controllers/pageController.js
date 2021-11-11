const Photo = require("../models/Photo");

exports.getAddPage = (req, res) => {
	res.render("add");
};

exports.getAboutPage = (req, res) => {
	res.render("about");
};

exports.getEditPage = async (req, res) => {
	const photo = await Photo.findById(req.params.id);
	res.render("edit", { photo });
};
