const Message=require('../models/messageSchema')
const Chat=require('../models/chatSchema')
const authUser=require('../models/authSchema')
exports.createMessage = async ( req , res ) => {
    try{
        let messageData = await Message.create(req.body) 
        messageData = await Chat.populate(messageData,{
            path : 'chat'
        })
        messageData = await authUser.populate(messageData , {
            path : 'chat.users'
        })
        console.log('messages is',messageData)
        res.json({
            message : messageData
        })
    }
    catch(error)
    {
        return res.status(500).json({
            message : 'error occured'
        })
    }
}
exports.fetchMessage = async ( req , res ) => {
    try{
        const {sender , chat} = req.body
        console.log('sender and chat',sender,chat)
        const messageData = await Message.find({ chat : chat})
        return res.json(
            {
                message : messageData
            }
        )
    }
    catch(error)
    {
        return res.status(500).json({
            message : 'error occured'
        })
    }
}
