//app setup
var express         =   require("express"),
    app             =   express(),
    mongoose        =   require("mongoose"),
    methodOverride  =   require("method-override"),
    bodyParser      =   require("body-parser");




var url = process.env.DATABASEURL;
    mongoose.connect(url, { useNewUrlParser: true });


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var postSchema = new mongoose.Schema({
    title: String,
    image: String,
text: String,
    created: {type: Date, default: Date.now}
})

var Post = mongoose.model("Post", postSchema);

//index route
app.get("/posts", (req, res)=>{
    Post.find({}).sort("-created").find((err, allPosts)=>{
        if(err){
            console.log(err)
        } else {
            res.render("index", {blogpost: allPosts})
        }
    })
})

//new route
app.get("/posts/new", (req, res)=>{
    res.render("new")
})

//create route
app.post("/posts", (req, res)=>{
    Post.create(req.body.post, (err, newBlogPost)=>{
    if(err){
        console.log(err)
    }else{
        res.redirect("/posts")
    }
    })
})

//show route
app.get("/posts/:id", (req, res)=>{
    Post.findById(req.params.id, (err, foundPost)=>{
        if(err){
            console.log(err)
        }else{
            res.render("show", {blogPost: foundPost})
        }
    })
})

//edit route
app.get("/posts/:id/edit", (req, res)=>{
    Post.findById(req.params.id, (err, foundBlogPost)=>{
        if(err){
            console.log(err)
        }else {
            res.render("edit", {editBlogPost: foundBlogPost})
        }
    })
})

//update route
app.put("/posts/:id", (req, res)=>{
    Post.findOneAndUpdate(req.params.id, req.body.post, (err, updatedPost)=>{
        if(err){
            res.redirect("/posts")
        }else {
            res.redirect("/posts/" + req.params.id)
        }
    })
})


app.delete("/posts/:id", (req, res)=>{
    Post.findOneAndDelete(req.params.id, (err)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect("/posts")
        }
    })
})

app.listen(8080, ()=>{
    console.log("SERVER IS RUNNING...")
})