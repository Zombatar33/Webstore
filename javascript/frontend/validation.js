function $_GET(q) {
    var url_string = window.location;
    var url = new URL(url_string);
    var name = url.searchParams.get(q);
    return name;
}

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