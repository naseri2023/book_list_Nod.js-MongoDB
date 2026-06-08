express = require('express');
const mongoose  = require("mongoose");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/bookListDB')
    .then(() => console.log("Mongo Connected"))
    .catch(err => console.log(err));

const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    year: Number
});

const Book = mongoose.model('Book', BookSchema);

app.get('/api/books', async (req, res) => {
    const books = await Book.find()
    res.json(books);
});

app.post('/api/new-book',async (req,res)=>{
    console.log('Body =>', req.body);
    const { title, author, year } = req.body;

    const book = new Book({
        title,
        author,
        year
    });

    await book.save();
    res.json(book);
})

app.delete('/api/books/:id',async (req,res)=>{
    const id = req.params.id;
    await Book.findByIdAndDelete(id);
    res.json({ message: "book deleted" });
})

app.put('/api/books/:id', async (req, res) => {
    console.log(req.params);
    const book = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(book);
});

app.listen(3000, (err) =>{
    if(err){
        console.error(err);
    }else {
        console.log('Server started on port 3000');
    }
})