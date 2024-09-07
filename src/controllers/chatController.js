const ChatUser=require('../models/chatSchema')
const authUser=require('../models/authSchema')
const chatIdUser=require('../models/chatIdSchema')
const moment = require('moment-timezone');
// const dotenv=require('dotenv')
// dotenv.config()
// const {Configuration,OpenAIApi}=require('openai')
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration)



exports.addSendMessage = async (req, res) => {
    try {
      const { id: loginId } = req.params;
      const { senderId, recieverId, message,senderName,images } = req.body;
  
      // Fetch the chatIdArray
      const chatIdArray = await chatIdUser.find();
  
      // Find an existing chat where the sender and receiver match the given IDs
      const existingChat = chatIdArray.find(chat =>
        (chat.loginId === loginId && chat.anotherId === recieverId) ||
        (chat.loginId === recieverId && chat.anotherId === loginId)
      );
      const indianTime = moment().tz('Asia/Kolkata').toISOString();
      // Create a new ChatUser object
      const chatData = new ChatUser({
        loginId,
        senderId,
        recieverId,
        message,
        chatId: existingChat ? existingChat._id : undefined, // Assign chatId if a matching chat was found
        timestamp: indianTime 
      });
  
      // Save the new chat data
      const chat = await chatData.save();
      const recieverObj = await authUser.findById(recieverId);

      if (recieverObj) {
        // Push the new notification
        recieverObj.messageNotify.push({ loginId: loginId, senderId:senderId,recieverId:recieverId, message:message, chatId:existingChat ? existingChat._id : undefined, timestamp: indianTime,senderName:senderName,images:images });
        recieverObj.recordChat.push({ loginId: loginId, senderId:senderId,recieverId:recieverId, message:message, chatId:existingChat ? existingChat._id : undefined, timestamp: indianTime });
        recieverObj.postTyping=null
        // Save the updated receiver object
        await recieverObj.save();
        console.log("Notification added successfully");
      } else {
        console.log("Receiver not found");
      }
      // Respond with success
      res.status(201).send({ mssg: 'Chat data added successfully', chatUser: chat,
      senderUser:{ loginId: loginId, senderId:senderId,recieverId:recieverId, message:message, chatId:existingChat ? existingChat._id : undefined, timestamp: indianTime,senderName:senderName,images:images },
      recordChat:{ loginId: loginId, senderId:senderId,recieverId:recieverId, message:message, chatId:existingChat ? existingChat._id : undefined, timestamp: indianTime,senderName:senderName,images:images }
     })

    } catch (e) {
      console.error(e);
      res.status(500).send({ mssg: 'Message does not exist' });
    }
  };
  
//only getSendMessage func works on the basis of loginId and recieverId
// exports.getSendMessage=async(req,res)=>{
// try{
//     const id=req.params.id
//     const allChatArray=await ChatUser.find()
//     console.log('login chat data obj',allChatArray)
//     let filterChatArray
//     filterChatArray=allChatArray.filter((item)=>item.loginId===id || item.recieverId===id)
//     // let recieverChatArray
//     // recieverChatArray=allChatArray.filter((item)=>item.recieverId===id)
//     res.status(201).send({ mssg: 'get chat Array', chatUserArray:filterChatArray });

// }catch(e){
//     console.error(e)
    
//     res.status(500).send({mssg:'message does not exist'})
// }
// }


//new  getSendMessage func works on the basis of loginId and recieverId and automatic delete after 5 min 
exports.getSendMessage=async(req,res)=>{
  try{
      const id=req.params.id
      const fiveMinutesAgo = moment().subtract(5, 'minutes').toDate();
    await ChatUser.deleteMany({ timestamp: { $lt: fiveMinutesAgo } });
    console.log('Old messages deleted successfully');
      const allChatArray=await ChatUser.find()
      console.log('login chat data obj',allChatArray)
      let filterChatArray
      filterChatArray=allChatArray.filter((item)=>item.loginId===id || item.recieverId===id)
      // let recieverChatArray
      // recieverChatArray=allChatArray.filter((item)=>item.recieverId===id)
      res.status(201).send({ mssg: 'get chat Array', chatUserArray:filterChatArray });
  
  }catch(e){
      console.error(e)
      
      res.status(500).send({mssg:'message does not exist'})
  }
  }
  


exports.addChat = async (req, res) => {
    try {
      const { id, anotherId, loginName, anotherName } = req.body;
  
      // Fetch all existing chat records
      const chatIdArray = await chatIdUser.find();
  
      // Check if a chat already exists between these two users
      const chatExists = chatIdArray.some(
        (item) =>
          (item.loginId === id && item.anotherId === anotherId) ||
          (item.loginId === anotherId && item.anotherId === id)
      );
  
      if (chatExists) {
        // If a chat already exists, send a response without saving
        return res.status(409).send({ mssg: 'Chat already exists' });
      }
  
      // If no matching chat is found, create and save the new chat
      const chat = new chatIdUser({
        loginId: id,
        anotherId: anotherId,
        loginName: loginName,
        anotherName: anotherName,
      });
  
      await chat.save();
      res.status(201).send({ mssg: 'Chat Data added Successfully', chatUser: chat });
    } catch (e) {
      console.error(e);
      res.status(500).send({ mssg: 'message does not exist' });
    }
  };
  exports.getChat = async (req, res) => {
    try {
      const id = req.query.loginId;
      const anotherId = req.query.anotherId;
      console.log('id in get chat',id)
      console.log('another id in get chat',anotherId)
  
      const chatIdArray = await chatIdUser.find();
      console.log('chat id array', chatIdArray);
  
      let found = false;
  
      for (let i = 0; i < chatIdArray.length; i++) {
        if (
          (chatIdArray[i].loginId === id && chatIdArray[i].anotherId === anotherId) || 
          (chatIdArray[i].loginId === anotherId && chatIdArray[i].anotherId === id)
        ) {
          res.status(201).send({ mssg: 'Chat id data fetched successfully', chatIdUser: chatIdArray[i] });
          found = true;
          break; // Exit the loop after sending the response
        }
      }
  
      if (!found) {
        res.status(404).send({ mssg: 'No matching chat found' });
      }
  
    } catch (e) {
      console.error(e);
      res.status(500).send({ mssg: 'An error occurred while fetching chat data' });
    }
  }
  exports.showIndicator=async(req,res)=>{
    try {
      const chatId=req.body.chatId
      console.log('chat id in indicator is',chatId)
      const chatIdArray=await chatIdUser.find()
      const chatIdObj=chatIdArray.filter((chatItem)=>chatItem._id.toString()===chatId)
      const chatIdObjData=chatIdObj[0]
      console.log('chat id data obj',chatIdObj)
      res.status(201).send({ mssg: 'Chat id data fetched successfully', chatIdObjData: chatIdObjData });

    }
    catch(e){
      console.error(e);
      res.status(500).send({ mssg: 'An error occurred while fetching chat data' });
    }
  }
  // exports.chatWithExpert = async (req, res) => {
  //   try {
  //     const prompt=req.body.prompt
  //     const response = await openai.createChatCompletion({
  //       model: 'gpt-3.5-turbo',
  //       messages: [{ role: 'user', content: prompt }],
  //     });
  //     return {
  //       success: true,
  //       data: response.data.choices[0].message.content,
  //     };
  //   } catch (error) {
  //     console.error('Error fetching response from OpenAI:', error);
  //     return {
  //       success: false,
  //       message: 'Failed to get response from OpenAI',
  //     };
  //   }
  // };
  exports.deleteChat=async(req,res)=>{
    try{
   const chatId=req.body.chatId
   const message=req.body.message
   const time=req.body.timestamp
   const deleteFindChatObj=await ChatUser.findOne({chatId:chatId,message:message,timestamp:time})
   const deleteChatObj=await ChatUser.findByIdAndDelete(deleteFindChatObj._id)
   const io = req.app.locals.io;
   io.emit('messageDeleted', deleteChatObj);

  res.status(200).json({ msg: "User deleted successfully" ,deleteChat:deleteChatObj,time:time});

    }catch(e){
      console.error(e);
      res.status(500).send({ mssg: 'An error occurred while fetching chat data' });
    }
  }

  exports.getAllChatId = async (req, res) => {
    try {
   const AllChatIdArray=await chatIdUser.find()
   res.status(200).send({mssg:'all chats fetch succesfully',chatIdArray:AllChatIdArray
  })
  
    } catch (e) {
      console.error(e);
      res.status(500).send({ mssg: 'An error occurred while fetching chat data' });
    }
  }
  exports.postTyping = async (req, res) => {
    try {
      const { loginId, senderId, recieverId, message } = req.body;
  
      // Find the receiver's object in the database
      const recieverObj = await authUser.findById(recieverId);
  
      if (!recieverObj) {
        return res.status(404).send({ mssg: 'Receiver not found' });
      }
  
      // Update the postTyping field with the new values
      recieverObj.postTyping = {
        loginId,
        senderId,
        recieverId,
        message
      };
  
      // Save the updated receiver object
      const recieverObjData = await recieverObj.save();
  
      res.status(200).send({ mssg: 'Typing message updated', data: recieverObjData.postTyping });
  
    } catch (e) {
      console.error(e);
      res.status(500).send({ mssg: 'An error occurred while updating typing message' });
    }
  };
  exports.getTyping=async(req,res)=>{
  try{
const id=req.params.id
const loginObj=await authUser.findById(id)
const typeData=loginObj.postTyping
res.status(200).send({mssg:'get type successfully',typeData:typeData})
  }
  catch (e) {
    console.error(e);
    res.status(500).send({ mssg: 'An error occurred while updating typing message' });
  }
  }