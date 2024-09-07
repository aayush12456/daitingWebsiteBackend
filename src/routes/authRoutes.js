
const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/authController');

// Set storage engine for Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/uploads/'); // Store uploaded files in the 'public/uploads/' directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Rename uploaded files
//   }
// });

const storage = multer.diskStorage({});

// Initialize multer middleware
const upload = multer({
  storage: storage,
  // limits:{fileSize:500000}
});

router.use(express.static('public'));

// Use Multer middleware for image uploads in these routes
// router.post('/signup', upload.single('images'), userController.register); // for single file uploaded in a backend folder
// router.post('/signup', upload.single('cloudImages'), userController.register); // for single file uploaded in a cloudinary
// router.post('/signup', upload.array('images',4), userController.register); // Up to 4 images can be uploaded in a cloudinary
// router.post('/signup', upload.array('images', 4), userController.register); // Up to 4 images can be uploaded in a backend folder
router.post('/signup', upload.fields([{ name: 'images', maxCount: 4 }, { name: 'videoUrl', maxCount: 1 }]), userController.register);
router.post('/login', userController.login)
router.post('/loginWithOtp', userController.loginWithOtp)
router.post('/verifyOtp', userController.compareLoginWithOtp)
router.get('/allUsers/:id', userController.allUser);
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
router.post('/addCountUser/:id', userController.counterUser);
router.get('/getCountUser/:id', userController.getCounterUser);
router.delete('/deleteCountUser/:id', userController.deleteCounterUser);
router.post('/addNotifyUser/:id', userController.addNotifyUser);
router.get('/getNotifyUser/:id', userController.getNotifyUser);
router.post('/addLikeNotifyUser/:id', userController.addLikeNotifyUser);
router.get('/getLikeNotifyUser/:id', userController.getLikeNotifyUser);
router.post('/addLikeCountUser/:id', userController.addLikeCounterUser);
router.get('/getLikeCountUser/:id', userController.getLikeCounterUser);
router.delete('/deleteLikeCountUser/:id', userController.deleteLikeCounterUser);
router.post('/addVisitorLikeUser/:id', userController.addVisitorPlusLikesUser);
router.get ('/getVisitorPlusLikeUser/:id', userController.getVisitorPlusLikesUser);
router.post('/addVisitorPlusSkipUser/:id', userController.addVisitorPlusSkipUser);
router.get('/getVisitorPlusSkipUser/:id', userController.getVisitorPlusSkipUser);
router.post('/addMatchUser/:id', userController.addMatchUser);
router.get('/getMatchUser/:id', userController.getMatchUser);
// router.post('/addOnlineUser/:id', userController.addOnlineUser);
// router.get('/getOnlineUser/:id', userController.getOnlineUser);
// router.post('/addLikeMatch/:id', userController.addLikeMatchUser);
router.post('/smsText/:id', userController.addSmsTextUser);
router.post('/visitorSendEmail/:id', userController.addVisitorSendEmailUser);
router.post('/matchSendEmail/:id', userController.addMatchSendEmailUser);
router.post('/sidebarAvailability/:id', userController.addSidebarAvailable);
router.get('/getSidebarAvailability/:id', userController.getSidebarAvailable);
router.post('/addPersonalProfileModalHeading/:id', userController.addPersonalProfileModalHeading);
router.get('/getPersonalProfileModalHeading/:id', userController.getPersonalProfileModalHeading);
router.post('/addOnlineSkipUser/:id', userController.addOnlineSkipUser);
router.post('/addOnlineLikeUser/:id', userController.addOnlineLikeUser);
router.get('/getOnlineLikeUser/:id', userController.getOnlineLikeUser);
router.get('/skipProfileUser/:id', userController.skipProfileUser);
router.delete('/deleteSkippedProfile/:id', userController.deleteSkipProfileUser); // delete skip profile id from an array
router.post('/updatePasswordUser/:id', userController.addUpdatePasswordUser);
router.delete('/deleteProfileUser/:id', userController.deleteProfileUser);
router.post('/deactivateUser/:id', userController.deactivationUser);
router.get('/getDeactivateUser/:id', userController.getDeactivateUser);
router.delete('/getActivateUser/:id', userController.getActivateUser);
router.post('/forgotUpdatePasswordUser', userController.addForgotUpdatePasswordUser);
router.get('/compareNumber/:id', userController.compareNumber);
router.get('/allRegisterUser/:id', userController.allRegisterUser);
router.post('/admin/register', userController.adminRegister)
router.post('/admin/login', userController.adminLogin)
router.get('/allFieldRegisterUser/:id', userController.allFieldRegisterUser);
router.delete('/deleteProfileFromAdminArray/:id', userController.deleteProfileFromAdminArray);
router.post('/addSpotifySong/:id', userController.addSpotifySong);
router.get('/getSpotifySong/:id', userController.getSpotifySong);
router.post('/updateSpotifySong/:id', userController.updateSpotifySong);
router.post('/uploadSong', upload.fields([{ name: 'songImage', maxCount: 1 }, { name: 'songUrl', maxCount: 1 }]), userController.uploadSongs);
router.get('/getUploadSong/:id', userController.getUploadSong);
router.post('/addNoneSong/:id', userController.addNoneSong);
router.get('/getloginIdUser/:id', userController.getLoginIdUsers);
router.delete('/deleteLoginIdUser/:id', userController.deleteLoginIdUser);
router.post('/addBlockIdUser/:id', userController.blockChatUser);
router.get('/getBlockIdUser/:id', userController.getBlockChatUser);
router.post('/deleteBlockIdUser/:id', userController.deleteBlockUser );
router.get('/getMessageNotify/:id', userController.getMessageNotifyUser);
router.get('/getRecordChat/:id', userController.getRecordChatData);
router.post('/deleteRecordData/:id', userController.deleteRecordData );
module.exports = router;