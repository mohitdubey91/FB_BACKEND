const User = require("../models/User");

exports.validateEmail = (email) => {
    return String(email).toLocaleLowerCase().match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,13})(\.[a-z]{2,13})?$/)
}

exports.validateLength = (text, min, max) => {
    return !(text.length > max || text.length < min);
}

exports.validateUsername = async (username) => {
    let a = false;
    do {
        let check = await User.findOne({ username });

        if (check) {
            username += (+new Date() * Math.random()).toString().substring(0, 2);
            a = true;
        } else {
            a = false;

        }
    } while (a);

    return username;
}