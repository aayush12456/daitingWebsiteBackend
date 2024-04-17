
const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/authController');

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Store uploaded files in the 'public/uploads/' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Rename uploaded files
  }
});

// Initialize multer middleware
const upload = multer({
  storage: storage
});

router.use(express.static('public'));

// Use Multer middleware for image uploads in these routes
// router.post('/signup', upload.single('images'), userController.register); // for single file uploaded
router.post('/signup', upload.array('images', 4), userController.register); // Up to 4 images can be uploaded
router.post('/login', userController.login)
router.get('/allUsers', userController.allUser);
router.get('/filterUsers/:id', userController.getFilterUser);
router.post('/addFilterUser/:id',userController.addFilterUser)
router.post('/addVisitorUser/:id',userController.addVisitorUser)
router.get('/getVisitorUser/:id', userController.getVisitorUser);
router.post('/addLikeUser/:id', userController.addLikesUser);
router.get('/getLikeUser/:id', userController.getLikesUser);
router.post('/likeFilterUser/:id', userController.likeFilterUser);
router.post('/addToChatUser/:id', userController.addToChatUser);
router.get('/getChatUser/:id', userController.getToChatUser);
router.post('/updateUser/:id', userController.updateauthUser);
module.exports = router;