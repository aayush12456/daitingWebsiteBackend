const mongoose = require('mongoose')
const chatModelSchema = new mongoose.Schema({
    users : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'UserData'
    },
    isGroupChat : {
        type : Boolean,
    },
    chatName : {
        type : [String],
    },
    groupAdmin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'UserData'
    },
    latestMessage : {
        type : String
    }
},
{
    timestamps : true
}
)

const chat = mongoose.model('Chat',chatModelSchema)
module.exports = chat