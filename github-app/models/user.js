var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    user_id: {type: Number, required: true},
    name: {type: String},
    login: {type: String, required: true},
    location: String,
    avatar_url: {type: String}
});

//Export model
module.exports = mongoose.model('User', UserSchema);