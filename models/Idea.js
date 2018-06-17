const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const IdeaSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    }

});

mongoose.model('ideas',IdeaSchema);
