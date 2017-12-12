var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RepoSchema = new Schema({

    repo_id: {type: Number, required: true},
    name: {type: String, required: true},
    path: {type: String, required: true},
    description: String,
    owner: {type: Schema.ObjectId, ref: 'User'},
    contributors: [
        {
            user: { type: Schema.ObjectId, ref: 'User' },
            contributions: Number
        }
    ],

});

//Export model
module.exports = mongoose.model('Repo', RepoSchema);