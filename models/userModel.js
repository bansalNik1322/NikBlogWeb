mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {
        typeof: String,
        require: true
    },
    email: {
        typeof: String,
        require: true
    },
    password: {
        typeof: String,
        require: true
    },
    phoneNumber: {
        typeof: String,
        require: true
    },
    userName: {
        typeof: String,
        require: true
    },

    img: {
        data: Buffer,
        contentType: String
    }
});

//Image is a model which has a schema imageSchema

const User = new mongoose.model('User', userSchema);
export default User