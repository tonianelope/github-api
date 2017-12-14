var github = require('octonode');
var fs = require('fs');

var client = github.client();

var ghocto = client.repo('pksunkara/octonode');

var ghreact = client.repo('facebook/react-native');

var glob_pulls;

ghocto.contents('', 'master',(err, conts, head)=>{
    console.log(conts);

    for(var i=0; i<conts.length; i++){
        console.log(conts[i].path);
        ghocto.contents(conts[i].path,'master',(err,conts, head)=>{
            if(err) console.log(err);
            console.log(conts);
        });
    }
});

// ghocto.prs({state: 'closed'}, (err, pulls, head)=>{
//     if(err) throw err;
//     console.log(head);
// //    for(var i in pulls){
//     //console.log(pulls);
//     console.log();
//     //    }
//     glob_pulls = pulls;
//     fs.writeFile("file.json",  JSON.stringify(pulls), function(err){
//         if(err){console.log(err);} else {console.log("save 1..");}
//     });
//     //head.link
//     //head.rel = next/last
//     //pulls[i].user.login /avatar_url
//     //pulls[i].merged_at - null or date
//     // title, author_association: 'CONTRIBUTOR'
//     //console.log(pulls);
// });

// if(glob_pulls){
//     console.log(glob_pulls[i].commits_url);
// }


// ghocto.contributors((err, contributers, head)=>{
//     console.log(contributers);
//     console.log(typeof(contributers));
//     fs.writeFile("contributers.json",  JSON.stringify(contributers), function(err){
//         if(err){console.log(err);} else {console.log("save..");}
//     });

// });

//             client.get('/user', {}, function (err, status, body, headers) {
//                 console.log(body); //json object
// //                res.render(body);
//             });
            //res.end(token);
