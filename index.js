const express = require("express");
const bodyParser = require("body-parser");
const Datastore = require("nedb");
const app = express();

var yea = false;

var userDatabase = new Datastore(__dirname + "/data/users.db");
var productDatabase = new Datastore(__dirname + "/data/products.db");
var couponsDatabase = new Datastore(__dirname + "/data/coupons.db");

console.log("Loading database...")
userDatabase.loadDatabase();
productDatabase.loadDatabase();
couponsDatabase.loadDatabase();

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000, http://localhost:3000");
});

// serve your css as static
app.use(express.static(__dirname));

// get our app to use body parser 
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/html/home.html");
});

app.post("/", (req, res) => {
    var type = req.body.type;

    if (type === "login") {
        var email = req.body.email;
        var password = req.body.password;

        if (validateEmail(email) && validatePassword(password)) {
            userDatabase.findOne({email: email}, function (err, docs) 
            { 
                if (docs == null) {
                    res.redirect('/?form=login&status=error&msg=Invalid credentials');
                }else {
                    res.send(`Hello, ${docs.username}!`);
                }
            });
        }else {
            res.redirect('/?form=login&status=error&msg=Invalid credentials');
        }

        return;
    } else if (type === "register") {
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var confirmPassword = req.body.confirmPassword;

        username = username.trim();
        email = email.trim();
        _id = username;

        var obj = { _id, username, email, password };

        if (validateEmail(email) && validateUsername(username) && validatePassword(password) && validateMatchingPassword(password, confirmPassword)) {
            userDatabase.findOne({_id: obj.username}, function (err, docs) 
            { 
                if (docs != null) {
                    res.redirect('/?form=register&status=error&msg=Username already in use');
                }else {
                    userDatabase.findOne({email: obj.email}, function(err, docs) 
                    {
                        if (!docs != null) {
                            res.redirect('/?form=register&status=error&msg=E-Mail already in use');
                        }else {
                            userDatabase.insert(obj);
                            res.redirect('/?form=login&status=success&msg=Registered successfully');
                        }
                    })
                }
            });
        }else {
            res.redirect('/?form=register&status=error&msg=Invalid Credentials');
        }

        return;
    } else {
        res.send("Invalid request, please refresh the page and try again.")
    }
});

function validateEmail(email) {
    return email.length > 0 && String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
};

function validateUsername(username) {
    return username.length > 2;
}

function validatePassword(password) {
    return password.length > 7;
}

function validateMatchingPassword(password1, password2) {
    return password1.length > 0 && password2.length > 0 && password1 === password2;
}