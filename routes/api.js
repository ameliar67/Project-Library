/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {

  const mongoose = require('mongoose')
  mongoose.connect(process.env.Mongo);

  const Schema = mongoose.Schema;

  const bookSchema = new Schema(
    {
      title: { type: String },
      commentcount: { type: Number },
      comments: [{ type: String }]
    });

  const Book = mongoose.model("Book", bookSchema);


  app.route('/api/books')
    .get(function (req, res) {

      //to reset database
      // Book.deleteMany()
      // .then (function (models)  {
      // })
      // .catch (function (err)  {
      // })


      Book.find()
        .then(function (models) {
          console.log(models)
          res.send(models)
        })
        .catch(function (err) {
          console.log(err)
          res.send('error')
        })


      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function (req, res) {
      let title = req.body.title;


      if (!title) {
        res.send('missing required field title')
      } else {

        const book = new Book({
          title: title,
          commentcount: 0
        });

        book.save()
          .then(function (models) {
            console.log(models)
            res.send({ "_id": models._id, "title": models.title })
          })
          .catch(function (err) {
            console.log(err)
            res.send('error')
          })
      }
      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'

      Book.deleteMany()
        .then(function (models) {
          res.send('complete delete successful')
        })
        .catch(function (err) {
          res.send('err')
        })
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;

      if (bookid == undefined) {
        res.send('no book exists')
      } else {

        Book.find({ _id: bookid })
          .then(function (models) {
            if (models[0] == undefined) {
              res.send('no book exists')
            } else {
              console.log(models[0], 'hi')
              res.send(models[0])
            }
          })
          .catch(function (err) {
            console.log(err)
            res.send('no book exists')
          })
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        res.send('missing required field comment')
      } else {

        // {commentcount: commentcount + 1}

        Book.findByIdAndUpdate(bookid, { $inc: { "commentcount": 1 }, $push: { "comments": comment } })
          .then(function (models) {
            res.json(
              {
                "comments": [...models.comments, comment],
                "_id": models._id,
                "title": models.title,
                "commentcount": models.commentcount + 1,
                "__v": models.__v
              }
            )

          }
          )
          .catch(function (err) {
            res.send('no book exists')
          })
      }
      //json res format same as .get
    })


    .delete(function (req, res) {
      let bookid = req.params.id;

      Book.deleteOne({ _id: bookid })
        .then(function (models) {
          console.log(models[0], 'models[0]', models, 'models')
          if (models.deletedCount == 0) {
            res.send('no book exists')
          } else {
            res.send('delete successful')
          }
        })
        .catch(function (err) {
          res.send('no book exists')
        })
      //if successful response will be 'delete successful'
    });

};
