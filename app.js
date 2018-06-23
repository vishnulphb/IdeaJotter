const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const app = express();



//get rid of warning-map global promise
mongoose.Promise=global.Promise;
//connect to mongoose
mongoose.connect('mongodb://localhost/ideajot-dev',{
    useMongoClient:true
})
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');
//handlebar middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


//Index Route
app.get('/',(req,res)=>{
    const title = "Vishnu Flash Cards";
 res.render('index',{
     title : title
 });
});
//about route
app.get('/about',(req,res)=>{
    res.render('about');
});

//ideas Page routing
app.get('/ideas/add',(req,res)=>{
    res.render('ideas/add');
});

//get
app.get('/ideas',(req,res)=>{
    //console.log(Idea.find({}));
    Idea.find({})
    .sort({date:"descending"})
    .then(x=>{
        res.render('ideas/index',{
            ideas:x
        });
    });
});

//post
app.post('/ideas',(req,res)=>{
    let errors = [];
    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if(!req.body.description){
        errors.push({text:'Please add a description'});
    }
    if(errors.length>0){
        console.log(errors);
        res.render('ideas/add',{
            errors:errors,
            title:req.body.title, //to retain values after postback 
            description:req.body.description 
        });
    }
    else { 
        const newUser = {
            title:req.body.title,
            details:req.body.description
        };
        new Idea(newUser).save().then(idea=>{
            res.redirect('/ideas');
        })
    }
   
});

//edit idea get

app.get('/ideas/edit/:id',(req,res)=>{
    //console.log(req.params.id);
    Idea.findById(req.params.id)
    .then(x=>{
        res.render('ideas/edit',{
           idea:x 
        })
    });
});

app.put('/ideas/:id',(req,res)=>{
    //res.send("put request success?")
    console.log("req: ",req.body.title);
    Idea.findByIdAndUpdate(req.params.id,
        {
            title:req.body.title,
            details:req.body.description
        })
    .then(res.redirect('/ideas'));
});

const port = 5000;
app.listen(port, () =>{
    console.log(`Server started on ${port}`);
});