const express = require('express')
const app = express()
const ejs =  require('ejs')
const bodyParser = require('body-parser')
const  mongoose = require('mongoose');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String

};

const Article = mongoose.model("Article", articleSchema); 

////////////////////////////request targatting all the articles////////////////////////////

app.route("/articles")

.get(function(req,res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles)
        } else{
            res.send(err);
        }
    })
})

.post(function(req,res){
    console.log();
    console.log();

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new articles");
        }else{
            res.send(err);
        }
    });
})

.delete( function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all the articles");

        }else{
            res.send(err);
        }
    })
});

///////////////////////request targetting specific articles///////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
        res.send(foundArticle);
    } else{
        res.send(err);
    }
    });
})

.put(function(req,res){
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Succesfully update article");

            }
        }
    )
})

.patch(function(req,res){
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("sucessfuly update the data");
            }else{
                res.send(err);
            }
        }

    )
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("successfully");
            }else {
                res.send(err);
            }
        }
    )
})

app.listen(3300, function(){
    console.log("Server started on port 3300");
})
// //Set up default mongoose connection
// var mongoDB = 'mongodb://127.0.0.1/wikiDB';

