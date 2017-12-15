var User = require('../../models/user');
var Repo = require('../../models/repo');
var Commit = require('../../models/commit');
var github = require('octonode');
var fs = require('fs');
var async = require('async');

//move!!!
var client = github.client();

exports.get_repo = (req, res, next) => {
    // Check if repo in DB
    var repo_name = req.body.repo;
    Repo.findOne({path: repo_name}, (err, repo) => {
        if (err) next(err); //redirect to error??
        else if (repo) {
            console.log("Found repo");
            res.redirect(`/load?repo=${encodeURIComponent(repo_name)}`);
        }
        else {
            // Scrape Repo
            console.log(`${repo_name} not saved. getting repo ...`);
            save_repo(repo_name, (err, saved_repo) => {
                if (err) next(err);
                console.log("REDIRECTING");
                req.query.repo = repo_name;
                res.redirect(`/load?repo=${encodeURIComponent(repo_name)}`);
            });
        }
    });
};

save_repo = function (repo_name, cb) {

    if (process.env.GITHUB_TOKEN) {
        client = github.client(process.env.GITHUB_TOKEN);
        console.log("REPO CLIENT: " + client);
    }
    var ghrepo = client.repo(repo_name);
    ghrepo.info((err, info, head) => {
        if (err) {
            cb(err, undefined);
            return;
        }
        var r = new Repo({
            repo_id: info.id,
            name: info.name,
            path: info.full_name,
            description: info.description,
            contributors: []
        });

        ghrepo.contributors((err, contributors, head) => {
            console.log(head);
            if (err) throw err;
            else {
                get_contributors(contributors, 0, r, function (err, new_r) {
                    if (err) cb(err, undefined);
                    console.log("END OF LOOP");

                    new_r.save((err) => {
                        if (err) cb(err, undefined);
                        console.log("New repo: " + r);
                        cb(undefined, r);
                    });
                });

            }

        });
    });
};

get_contributors = function (contributors, i, r, cb) {
    if (i >= contributors.length) {
        cb(undefined, r);
        return;
    }
    get_user(contributors[i].login, (err, user) => {
        console.log(i);
        if (err) {
            cb(err, undefined);
            return;
        } else if (user) {
            console.log("REF: " + user);
            r.contributors.push({
                contributions: contributors[i].contributions,
                user: user._id
            });
            if (i === 0) r.owner = user._id;
            get_contributors(contributors, i + 1, r, cb);
        }
    });
};

get_user = function (user_login, cb) {
    console.log("Looking for " + user_login);
    User.findOne({login: user_login}, (err, user) => {
        if (err) cb(err, undefined);
        else if (user) {
            console.log(`${user_login} in DB`);
            cb(undefined, user);
        } else
            save_user(user_login, (err, new_user) => {
                if (!err) {
                    console.log("RECEIVED: " + new_user);
                    cb(undefined, new_user);
                }
                cb(err, undefined);
            });
    });
};

save_user = function (user_login, cb) {
    console.log(`Saving ${user_login}`);
    var ghuser = client.user(user_login);
    ghuser.info((err, info, head) => {
        if (err) {
            cb(err, undefined);
        }
        var u = new User({
            user_id: info.id,
            name: info.name,
            login: info.login,
            location: info.location,
            avatar_url: info.avatar_url
        });
        u.save((err) => {
            if (err) cb(err, undefined);
            else console.log("New User: " + u);
            cb(undefined, u);
        });
        console.log("RETURNING : " + u);

    });
};

//test db funtion
exports.insert_user = (req, res, next) => {
    var u = new User({
        user_id: 1,
        name: "monalisa octocat",
        login: 'octocat',
        location: "San Francisco",
        avatar_url: "https://github.com/images/error/octocat_happy.gif"
    });
    u.save((err) => {
        if (err) throw err;
        console.log("New User: " + u);
    });
    //cb(null, u);
    res.send(u);
};


exports.get_profile = (req, res, next) => {
    //TODO make functoin??
    if (process.env.GITHUB_TOKEN) {
        client = github.client(process.env.GITHUB_TOKEN);
        console.log("REPO CLIENT: " + client);
    }
    ghme = client.me();
    ghme.info((err, info) => {
        if (!err) {
            res.info = info;
        } else {
            next(err);
        }
    });

    ghme.repos((err, repos) => {
        if (!err) {
            //get languages for all repos
            get_lang(repos, 0, {}, (err, langs) => {
                var langSorted = Object.keys(langs).sort(function (a, b) {
                    return langs[b] - langs[a]
                })
                var data = {
                    "languages": []
                };
                var index = 0.3;
                console.log(langSorted);
                for (var key in langSorted) {
                    data.languages.push({
                        "index": index,
                        "value": langs[langSorted[key]],
                        "label": langSorted[key]
                    });
                    index += 0.1;
                }
                console.log(langs);
                fs.writeFile(`public/json/langs.json`, JSON.stringify(data), (err) => {
                    if (!err) {
                        console.log("Wrote file");
                        res.langs = langs;
                        next();
                    } else {
                        next(err)
                    }
                });

            });
        }
        else {
            next(err);
        }
    });
};


var get_lang = function (repos, i, langs, cb) {

    if (i < repos.length) {
        ghrepo = client.repo(repos[i].full_name);
        ghrepo.languages((err, repo_langs, head) => {
            if (!err) {
                console.log(langs);
                for (var key in repo_langs) {
                    if (langs[key]) langs[key] += repo_langs[key];
                    else langs[key] = repo_langs[key];
                }
                get_lang(repos, i + 1, langs, cb);
            } else {
                cb(err, undefined);
            }
        })
    } else {
        cb(undefined, langs);
    }


};


var get_content = function (ghrepo, path, repo_name, callback) {
    console.log("getting" + path + " in " + repo_name);
    var file;
    ghrepo.contents(path, 'master', (err, conts, head) => {
        // if (err) {
        //     callback(err);
        // }
        async.each(conts, (file, cb) => {
            var dot = file.name.indexOf(".");
            if (file.size === 0 && dot === -1) {
                console.log("FOLDER " + file.name);
                get_content(ghrepo, file.path, repo_name, cb);
            } else {
                //FILES TO IGNORE: images & apks language=JSRegexp
                if (dot !== -1 && dot !== 0 && file.size !== 0 && !file.name.match(/.(jpg|jpeg|png|gif|apk|jar)$/i)) {
                    //add to files
                    console.log('FILE ' + file.name);
                    files.push({
                        "name": file.path,
                        "size": file.size,
                        "repo": repo_name,
                        "url": file.html_url
                    });
                } else {
                    console.log("ERROR " + file.name);
                }
                cb();
            }
        }, (err) => {
            console.log("RETURNING "+repo_name);
            callback(undefined);
        });
    });
};

var for_all_repos = function (repos, callback) {
    var repo;
    console.log(repo);
    async.each(repos, (repo, cb) => {
        console.log("GETTIN REPO "+repo.full_name);
        ghrepo = client.repo(repo.full_name);
        get_content(ghrepo, '', repo.full_name, (err) => {
            if (!err) {
                console.log("REPO RECIEVED " + repo.full_name);
                cb();
            } else {
                cb(err);
            }
        });
    }, (err) => {
        console.log("CALLBACK");
        callback(err);
    });
};

var files;

exports.get_all_files = function (req, res, next) {
    if (process.env.GITHUB_TOKEN) {
        client = github.client(process.env.GITHUB_TOKEN);
        console.log("REPO CLIENT: " + client);
    }
    files = [];

    ghme = client.me();
    async.parallel({
        infos: (cb) => {
            ghme.info((err, info) => {
                if (!err) {
                    cb(undefined, info);
                } else {
                    cb(err, undefined);
                }
            });
        },
        allrepos: (cb) => {
            ghme.repos((err, repos) => {
                if (!err) {
                    for_all_repos(repos, (err) => {
                        if (!err) {
                            console.log("AT R");
                            cb(undefined, repos);
                        } else {
                            cb(err, undefined);
                        }
                    });
                } else {
                    cb(err, undefined);
                }
            });
        }
        //Callback executes after all calls finish or one fails
    }, (err, resluts) => {
        console.log("AT AS");
        if (err) {
            next(err);
        } else {
            res.info = resluts.infos;
            res.repos = resluts.allrepos;
            fs.writeFile(`github-app/public/json/files.json`, JSON.stringify(files), (err) => {
                if (!err) {
                    console.log("Wrote file");
                    console.log(res.info);
                    console.log(res.repos);
                    next();
                } else {
                    next(err);
                }
            });
        }
    });
};
