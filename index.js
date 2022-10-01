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
        
        res.redirect('/?form=login&status=error&msg=Invalid username or password');
    } else if (type === "register") {
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var confirmPassword = req.body.confirmPassword;

        username = username.trim();
        email = email.trim();
        _id = username;

        var obj = { _id, username, email, password };



        userDatabase.findOne({_id: obj.username}, function (err, docs) 
        { 
            if (docs != null) {
                res.redirect('/?form=register&status=error&msg=Username already exists');
            }else {
                userDatabase.insert(obj);
                res.redirect('/?form=register&status=success&msg=Registered successfully');
            }
        });

        return;
    } else {
        res.send("Invalid request, please refresh the page and try again.")
    }
});

