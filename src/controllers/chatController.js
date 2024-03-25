const Chat=require('../models/chatSchema')
const authUser=require('../models/authSchema')
const socket=require('../../socket')
exports.createChat=async(req,res)=>{
    try{
        const user1=req.params.id
        const  user2  = req.body.chatId
        const isChat = await Chat.findOne({
            isGroupChat: false,
            $and : [
                {users : {$elemMatch : {$eq : user1}}},
                {users : {$elemMatch : {$eq : user2}}}
            ]
          }).populate('users' , '-password');
        if(isChat)
        {
            return res.json({
                chat : isChat
            })
        }
        else
        {
            const user1Name = await authUser.findOne({_id : user1})
            const user2Name = await authUser.findOne({_id : user2})
            console.log('user1name',user1Name)
            const chatData = {
                isGroupChat : false,
                users : [user1 , user2],
                chatName : [user1Name.firstName , user2Name.firstName]
            }
            const chat = await Chat.create(chatData)
            
            return res.json({
                chat 
            })
        }
    } catch(error)
    {
        return res.status(500).json({
            message : 'error occured'
        })
    }
}
exports.fetchChats = async ( req , res ) => {
    try{
        const userId = req.params.id
        let chats = await Chat.find({users : {$elemMatch : {$eq : userId}}})
        chats = await authUser.populate(chats,{
            path : 'users'
        })
        if(chats.length===0)
        {
            return res.json({
                message : "chat doestn't exist "
            })
        }
        else 
        {
            return res.send(chats)
    }
    }
    catch(error)
    {
        return res.status(500).json({
            message : 'error occured'
        })
    }
}