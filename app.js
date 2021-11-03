const express = require("express");

const app = express();

app.get("/", (req, res) => {
	res.status(200).send("Hello world");
});

const port = 3000;
app.listen(port, () => {
	console.log(`Server started at port: ${port}`);
});
