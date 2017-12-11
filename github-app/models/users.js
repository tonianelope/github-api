var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {type: String},
    login: {type: String, required: true},
    location: {type: String, required: true},
    avatar_url: {type: String}

});

//Export model
module.exports = mongoose.model('User', UserSchema);