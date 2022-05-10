const Announcement = require("../models/announcement");
const formidable = require('formidable')
const fs = require('fs')
/* exports.create = (req, res) => {
  console.log("im here");
  const announcement = new Announcement(req.body);
  announcement.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({ data });
  });
}; */


exports.create = (req,res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
      if(err) {
          return res.status(400).json({
              error: 'Image could not be uploaded'
          })
      }
      let announcement = new Announcement(fields)

      if(files.photo) {
          /* //check all fields
          const { name, description, price, category, quantity, shipping } = fields;

          if (!name || !description || !price || !category || !quantity || !shipping) {
              return res.status(400).json({
                  error: 'All fields are required'
              })
          } */
          //console.log(files.photo)
          if(files.photo.size > 3000000){
              return res.status(400).json({
                  error: "Image should be less than 3mb in size"
              })
          }
          announcement.photo.data = fs.readFileSync(files.photo.filepath)
          announcement.photo.contentType = files.photo.mimetype
      }

      announcement.save((err, result) =>{
          if(err){
              return res.status(400).json({
                  error: err
              })
          }
          res.json(result)
      })
  })
}
// Get all announcements
exports.getAllAnnouncements = (req, res) => {
  // Sort by the last element
  let order = req.query.order ? req.query.order : "desc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Announcement.find()
    .populate(["categoryId", "userId"])
    .sort([[sortBy, order]])
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};
