const path = require('path');
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
router.post('/create/:id', chatController.createChat)
router.get('/get-chats/:id' , chatController.fetchChats)
module.exports=router