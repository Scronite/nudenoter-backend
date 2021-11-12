const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser.js')
const Note = require("../models/Notes");
const { body, validationResult } = require("express-validator");


// Route 1: Get All The Notes Of The User : GET "/api/notes/fetchallnotes" Login required
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    try {
        const notes = await Note.find({user: req.user.id})
    res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})
// Route 2:  Add A New Note: POST  "/api/notes/addnote" Login required
router.post('/addnote',fetchuser,[
    body("title",'Enter a valid title').isLength({ min: 3 }),
    body("description",'description must be atleast 5 character').isLength({min: 5}),
] ,async (req,res)=>{
    try {
        const {title,description,tag,} = req.body
        // if there are errors , return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
         const note = new Note({
             title, description, tag,user: req.user.id
         })
         const savedNote = await note.save()
         res.json(note)  
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}) 

// Route 3:  Update A Existing Note: PUT  "/api/notes/updatenote" Login required
router.put('/updatenote/:id',fetchuser, async (req,res)=>{
    const {title,description, tag} = req.body
    // create a new note object
    const newNote = {}
    if (title) {newNote.title = title}
    if (description) {newNote.description = description}
    if (tag) {newNote.tag = tag}

    // find the note to be updated 
    let note = await Note.findById(req.params.id);
    if(!note){res.status(404).send("Not Found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(req.params.id,{$set: newNote}, {new:true})
    res.json({note})
})
// Route 4:  Delete a Note: DELETE  "/api/notes/deletenote" Login required
router.delete('/deletenote/:id',fetchuser, async (req,res)=>{
    const {title,description, tag} = req.body
    // find the note to be deleted 
    let note = await Note.findById(req.params.id);
    if(!note){res.status(404).send("Not Found")}
// allow user to delete
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Sucess": "Note Has Been Deleted"})
})



module.exports = router