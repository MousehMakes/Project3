var express   = require("express"),
    app       = express(),
    path      = require('path'),
    bodyParser= require("body-parser"),
    mongoose  = require("mongoose"),
    passport  = require("passport"),
    LocalStrategy = require("passport-local"),
    Dream    = require("./models/dream"),
    User     = require("./models/user")

mongoose.connect('mongodb://localhost:27017/vision_board', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.use(require("express-session")({
  secret: "Once again you did it!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

app.use ('/assets', express.static('assets'));
  
// Dream.create(
//   {
//     dream: "Someday I too Shall Wed",
//     image: "https://media.glamour.com/photos/59287d5250ed374309410cd1/1:1/w_352/kim-kardashian-kanye-west-wedding.jpg",
//     actionplan: "Find a valuable Man first."
    
//   }, 
//   function(err, dream){
//     if(err){
//       console.log(err);
//     } else {
//       console.log("Newly Created Dream: ");
//       console.log(dream);
//     }
//   });


app.get("/", function(req, res){
  res.render("index");
});

app.get("/dreams", function(req, res){
  Dream.find({}, function(err, allDreams){
    if(err){
      console.log(err);
    } else {
      res.render("dreams",{dreams:allDreams, currentUser: req.user});
    }
  });
    
});
  
  app.post("/dreams", function(req, res){
    var dream = req.body.dream; 
    var image = req.body.image;
    var actionplan = req.body.actionplan;
    var newDream = {dream: dream, image: image, actionplan: actionplan}
    Dream.create(newDream, function(err, newlyCreated){
      if(err){
          console.log(err);
      } else {
        res.redirect("/dreams");
      }
    });
    
  });
  
  app.get("/dreams/new", function(req, res){
    res.render("new.ejs");
  });
  
  app.get("/dreams/:id", function(req, res){
    Dream.findById(req.params.id, function(err, foundDream){
      if(err){
        console.log(err);
      } else {
        res.render("show", {dream: foundDream});
      }
    });
  });
  
  app.get("/signup", function(req, res){
    res.render("signup");
  });
  
  app.post("/signup", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
      if (err){
        console.log(err);
        return res.render("signup");
      }
      passport.authenticate("local")(req, res, function(){
        res.redirect("/dreams");
      });
    });
  });
  
  app.get("/login", function(req, res){
    res.render("login");
  });
  
  app.post("/login", passport.authenticate("local",
  { 
    successRedirect: "/dreams",
    failureRedirect: "/login"
    }), function(req, res){
  });   
    
    //
    app.get("/logout", function(req, res){
      req.logout();
      res.redirect("/");
    });
    
    
  
  app.listen(process.env.PORT, process.env.IP, function(){
      console.log("DreamCatcher Server Started!");
  });