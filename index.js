const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000, http://localhost:3000");
});

// serve your css as static
app.use(express.static(__dirname));

// get our app to use body parser 
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/home.html");
});

app.post("/", (req, res) => {
    var type = req.body.type;

    if (type === "login") {
        var email = req.body.email;
        var password = req.body.password;
    } else if (type === "register") {
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var confirmPassword = req.body.confirmPassword;
    } else {
        res.send("Invalid request, please refresh the page and try again.")
    }
});