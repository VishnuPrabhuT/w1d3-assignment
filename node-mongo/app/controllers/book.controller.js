const mongoose = require("mongoose");

const Book = mongoose.model("Book");

exports.createBook = (req, res) => {
    const book = new Book({
        id: req.body.id,
        title: req.body.title,
        author: req.body.author,
    });

    book.save()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({
                message: "Fail!",
                error: eer.message,
            });
        });
};

exports.getBook = (req, res) => {
    Book.findById(req.params.id)
        .select("-__v-_id")
        .then((Book) => {
            console.log(Book);
            res.status(200).json(Book);
        })
        .catch((err) => {
            if (err.kind == "ObjectId") {
                return res.status(404).send({
                    message: "Book not found with id " + req.params.id,
                    error: err,
                });
            }

            return res.status(500).send({
                message: "Error retrieving Book with id " + req.params.id,
                error: err,
            });
        });
};

exports.books = (req, res) => {
    Book.find()
        .select("-__v")
        .then((BookInfos) => {
            res.status(200).json(BookInfos);
        })
        .catch((error) => {
            console.log(error);

            res.status(500).json({
                message: "Error!",
                error: error,
            });
        });
};

exports.deleteBook = (req, res) => {
    Book.findByIdAndRemove(req.params.id)
        .select("-__v-_id")
        .then((Book) => {
            if (!Book) {
                res.status(404).json({
                    message: "No Book found with id = " + req.params.id,
                    error: "404",
                });
            }
            res.status(200).json({});
        })
        .catch((err) => {
            return res.status(500).send({
                message: "Error -> Can't delete Book with id " + req.params.id,
                error: err.message,
            });
        });
};

exports.updateBook = (req, res) => {
    Book.findByIdAndUpdate(
        req.body._id,
        {
            id: req.body.id,
            title: req.body.title,
            author: req.body.author,
        },
        { new: false }
    )
        .select("-__v-_id")
        .then((Book) => {
            if (!Book) {
                res.status(404).json({
                    message:
                        "Error -> Can't update Book with id " + req.params.id,
                    error: "Not Found!",
                });
            }
            res.status(200).json(Book);
        })
        .catch((err) => {
            return res.status(500).send({
                message:
                    "Error -> Can't update a Book with id " + req.params.id,
                error: err.message,
            });
        });
};
