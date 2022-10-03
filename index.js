const express = require("express");
const bodyParser = require("body-parser");
const Datastore = require("nedb");
const session = require("express-session");
const app = express();

var yea = false;

var userDatabase = new Datastore(__dirname + "/data/users.db");
var purchaseDatabase = new Datastore(__dirname + "/data/purchases.db");

console.log("Loading database...")
userDatabase.loadDatabase();
purchaseDatabase.loadDatabase();

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000, http://localhost:3000");
});

app.use(session({
    secret: 'wow secret',
    resave: false,
    saveUninitialized: false,
}));

// serve your css as static
app.use(express.static(__dirname));

// get our app to use body parser 
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/logout", (req, res) => {
    if (req.session.loggedIn) {
        req.session.loggedIn = false;
        req.session.user = null;
        res.redirect('/?form=login&status=success&msg=Logged out successfully');
    }else {
        res.redirect('/');
    }
});

app.get("/", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/products/')
    }else {
        res.sendFile(__dirname + "/html/home.html");
    }
});

app.get("/products/", (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(__dirname + "/html/products.html");
    }else {
        res.redirect('/');
    }
});

app.get("/product/", (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(__dirname + "/html/product.html");
    }else {
        res.redirect('/');
    }
});

app.get("/validate", (req, res) => {
    var id = req.query.id;

    purchaseDatabase.findOne({_id: id}, function(err, docs) {
        if (docs != null) {
            res.status(200).send({
                status: "true"
            })
        }else {
            res.status(404).send({
                status: "false"
            });
        }
    });
});

app.post("/product", (req, res) => {
    var user = req.session.user;
    var product = req.body.product;

    var _id = user + product;

    // normally you would process the payment here
    // but for the sake of simplicity we assume that the payment was successful

    var obj = { _id }

    userDatabase.findOne({_id: _id}, function (err, docs) {
        if (docs === null) {
            purchaseDatabase.insert(obj);
        }
        res.redirect(`/product?product=${product}&purchase=true&id=${_id}`);
    });
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
                    req.session.loggedIn = true;
                    req.session.user = docs.username;
                    res.redirect('/products/');
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
                    userDatabase.findOne({email: obj.email}, function(err, docs2) 
                    {
                        if (docs2 != null) {
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