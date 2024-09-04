


const express = require("express");
const app = express();
const port = 3000;


app.use("/mvmzSaveEditor", express.static("mvmzSaveEditor"));
app.use("/mzSaveEditor", express.static("mzSaveEditor"));


app.get("/", (req, res) => {
    res.send("Hello World!")
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});




