var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommitSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    repo: { type: Schema.ObjectId, ref: 'Repo'},

    commits: [{
        date: {type: String},
        stats: {additions: Number, deletions: Number, total: Number },
        files: [
            {filename: String}
        ]
    }]
});

//Export model
module.exports = mongoose.model('Contributor', CommitSchema);