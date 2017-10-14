var bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();
    
//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));  //in order to serve our custom style sheet
app.use(bodyParser.urlencoded( {extended:true} ) );
app.use(methodOverride("_method"));  //tell the app to look for "_method" in the query string

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created: {type: Date, default: Date.now()}
});

var Blog = mongoose.model("Blog", blogSchema);


//RESTFUL ROUTES

//it's conventional to set the root route to the index page
//ROOT ROUTE
app.get("/", function(req,res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req,res){
    Blog.find({}, function(err,blogs){
        if(err){
            console.log(err);
        }else{
             res.render("index", {blogs: blogs});
        }
    });
   
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new"); 
});

//CREATE ROUTE
app.post("/blogs", function(req,res){
    //create a new blog
    Blog.create(req.body.blog,function(err, newBlog){
        if(err){
            res.render("new");  //send the user to the new form page again
        }else{
            //redirect to the index page
            res.redirect("/blogs");
        }
    });
   
});

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("show", {blog: foundBlog});
       }
   });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
             res.render("edit", {blog: foundBlog});
        }
    });
   
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           //res.redirect("/blogs/"+req.params.id);  //redirect the user to the SHOW page
           res.send("Update route");
       }
   });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs");
       }
   });
   //redirect to index page
});
app.listen(process.env.PORT, process.env.IP,function(){
    
    console.log("Server is running");
});