const bcrypt=require('bcrypt')
const authUser=require('../models/authSchema')
const io=require('../../app')
const twilio=require('twilio')
const dotenv=require('dotenv')
dotenv.config()
// TWILIO_SID='ACab6a89563b4aa0ba601c2cf58046a505'
// TWILIO_AUTH_TOKEN='5175dc65377efd59cc24ab38da379f17'
const client = twilio(process.env.TWILIO_SID,process.env. TWILIO_AUTH_TOKEN);
exports.register=async (req,res)=>{
    
const file=req.files.map(file=>file.filename)
    try{
        const UserData=new authUser({
            firstName:req.body.firstName,
            email:req.body.email,
            phone:req.body.phone,
            password:req.body.password,
            gender:req.body.gender,
            DOB:req.body.DOB,
            city:req.body.city,
            aboutUser:req.body.aboutUser,
       
        // images:req.file.filename, // for single file to show name
            images:file,
            interest:req.body.interest,
            education:req.body.education,
            drinking:req.body.drinking,
            smoking:req.body.smoking,
            eating:req.body.eating,
            interest:req.body.interest.split(','),
            profession:req.body.profession,
            looking:req.body.looking,
            relationship:req.body.relationship,
            zodiac:req.body.zodiac,
            language:req.body.language
    
        })
    console.log('user is',UserData)
       const token = await UserData.generateAuthToken()
    console.log('token is',token)
    const User = await UserData.save()
    res.status(201).send({mssg:'Data registered Successfully',user:User,token:token})
    }catch(e){
    res.status(401).send({mssg:'Data does not added'})
    }
}

exports.login=async (req,res)=>{
    try{
    const email=req.body.email
    const password=req.body.password
    const userEmail=await authUser.findOne({email:email})
     const isMatch=await bcrypt.compare(password,userEmail.password)
     const token = await userEmail.generateAuthToken();
     console.log('login token is',token)
     if(isMatch){
        const data = await authUser.findOne({email : email}) // user ne jo  login email dala hai usne database me pade email se match hua or pura object dikha diya 
      res.status(201).send({mssg:'Login Successfully',response:201,loginData:{email:email,password:password},token:token,userId:userEmail._id,completeData:data})
    }
    else{
        res.status(400).send({mssg:"invalid password",response:400 }) 
        return 
            }
            if(!userEmail){
                   res.status(400).send({mssg:"email does not exist"})
             }
    }catch(e){
        res.status(400).send({mssg:"Data does not match",response:400})
    }
}

exports.allUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await authUser.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const city = user.city;
        const gender = user.gender;
        const visitors = user.visitors.map(visitor => visitor.visitorId.toString()); // Assuming visitors is an array of ObjectIds
        const likes = user.likes.map(like => like.toString());
        const users = await authUser.find();

        // Filter out users with the same city and opposite gender
        let filteredUsers = users.filter(u => u.city !== city);

        if (gender === 'Male') {
            filteredUsers = filteredUsers.filter(u => u.gender === 'Female');
        } else {
            filteredUsers = filteredUsers.filter(u => u.gender === 'Male');
        }

        // Remove users from filteredUsers if they are present in the visitors array
        filteredUsers = filteredUsers.filter(u => !visitors.includes(u._id.toString()));
        filteredUsers = filteredUsers.filter(u => !likes.includes(u._id.toString()));

        res.json({
            users: filteredUsers
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// exports.getFilterUser = async (req, res) => { // now show all updated user on the basis of gender and not show like and ulike user 
//     try {                                     // on the basis of id
//         const userId = req.params.id; // Assuming the user ID is passed as a parameter in the URL
//         console.log('get filter data',userId) // login user id
//         // Find the user with the specified ID
//         const user = await authUser.findById(userId);
//         console.log('user is data',user)
//         const filterUserArray = user.filterData;
//         console.log('filter user array ', filterUserArray);

//         const likeFilterUserArray=user.likeFilterData
//         console.log('like filter user Array',likeFilterUserArray)
        
//         if (!user) {
//             return res.status(404).json({ mssg: "User not found" });
//         }

//         const userInterests = user.interest; // Get interests of the user
//         const userGender = user.gender;
//         console.log('gender is', userGender);

//         let interestUsers;

//         if (userGender === 'Male') {
//             // Find females with at least one similar interest and not in filterUserArray or likeFilterUserArray
//             interestUsers = await authUser.find({ 
//                 gender: 'Female', 
//                 interest: { $in: userInterests },
//                 // _id: { $nin: filterUserArray } // Exclude IDs in filterUserArray
//                 _id: { $nin: [...filterUserArray, ...likeFilterUserArray] } 
//             });
//         } else if (userGender === 'Female') {
//             // Find males with at least one similar interest and not in filterUserArray or likeFilterUserArray
//             interestUsers = await authUser.find({ 
//                 gender: 'Male', 
//                 interest: { $in: userInterests },
//                 // _id: { $nin: filterUserArray } // Exclude IDs in filterUserArray
//                 _id: { $nin: [...filterUserArray, ...likeFilterUserArray] } 
//             });
//         } else {
//             return res.status(400).json({ mssg: "Invalid gender" });
//         }

//         if (!interestUsers || interestUsers.length === 0) {
//             return res.status(404).json({ mssg: "No users found with matching interest" });
//         }
        
//         res.json({ interestUsers });
//         console.log('interest user is',interestUsers)
//     } catch (error) {
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// };

// exports.getFilterUser = async (req, res) => {
//     try {
//         const userId = req.params.id; // Assuming the user ID is passed as a parameter in the URL
//         console.log('get filter data', userId); // login user id

//         // Find the user with the specified ID
//         const user = await authUser.findById(userId);
//         console.log('user is data', user);

//         if (!user) {
//             return res.status(404).json({ mssg: "User not found" });
//         }

//         const filterUserArray = user.filterData;
//         console.log('filter user array ', filterUserArray);

//         const likeFilterUserArray = user.likeFilterData;
//         console.log('like filter user array', likeFilterUserArray);

//         const userInterests = user.interest; // Get interests of the user
//         const userGender = user.gender;
//         const userCity = user.city; // Get city of the user
//         console.log('gender is', userGender);
//         console.log('city is', userCity);
//        const hideRemainMatchArray=user.hideRemainMatch
//        const hideRemainMatchUsers = await authUser.find({
//         _id: { $in: hideRemainMatchArray }
//     });
//         let interestUsers;
        
//         if (userGender === 'Male') {
//             // Find females with at least one similar interest, matching city, and not in filterUserArray or likeFilterUserArray
//             interestUsers = await authUser.find({ 
//                 gender: 'Female', 
//                 interest: { $in: userInterests },
//                 city: userCity,
//                 _id: { $nin: [...filterUserArray, ...likeFilterUserArray] }
//             });
//         } else if (userGender === 'Female') {
//             // Find males with at least one similar interest, matching city, and not in filterUserArray or likeFilterUserArray
//             interestUsers = await authUser.find({ 
//                 gender: 'Male', 
//                 interest: { $in: userInterests },
//                 city: userCity,
//                 _id: { $nin: [...filterUserArray, ...likeFilterUserArray] }
//             });
//         } else {
//             return res.status(400).json({ mssg: "Invalid gender" });
//         }

//         if (!interestUsers || interestUsers.length === 0) {
//             return res.status(404).json({ mssg: "No users found with matching interest and city" });
//         }

//         res.json({ interestUsers });
//         console.log('interest user is', interestUsers);
//     } catch (error) {
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// };

exports.getFilterUser = async (req, res) => {
    try {
        const userId = req.params.id; // Assuming the user ID is passed as a parameter in the URL
        console.log('get filter data', userId); // login user id

        // Find the user with the specified ID
        const user = await authUser.findById(userId);
        console.log('user is data', user);

        if (!user) {
            return res.status(404).json({ mssg: "User not found" });
        }

        const filterUserArray = user.filterData;
        console.log('filter user array ', filterUserArray);

        const likeFilterUserArray = user.likeFilterData;
        console.log('like filter user array', likeFilterUserArray);

        const userInterests = user.interest; // Get interests of the user
        const userGender = user.gender;
        const userCity = user.city; // Get city of the user
        console.log('gender is', userGender);
        console.log('city is', userCity);

        const hideRemainMatchArray = user.hideRemainMatch;
        console.log('hide remain match array', hideRemainMatchArray);

        // Fetch the full user objects for the IDs in hideRemainMatchArray
        const hideRemainMatchUsers = await authUser.find({
            _id: { $in: hideRemainMatchArray }
        });
        console.log('hide remain match users', hideRemainMatchUsers);

        let interestUsers;
        
        if (userGender === 'Male') {
            // Find females with at least one similar interest, matching city, and not in filterUserArray or likeFilterUserArray
            interestUsers = await authUser.find({ 
                gender: 'Female', 
                interest: { $in: userInterests },
                city: userCity,
                _id: { $nin: [...filterUserArray, ...likeFilterUserArray] }
            });
        } else if (userGender === 'Female') {
            // Find males with at least one similar interest, matching city, and not in filterUserArray or likeFilterUserArray
            interestUsers = await authUser.find({ 
                gender: 'Male', 
                interest: { $in: userInterests },
                city: userCity,
                _id: { $nin: [...filterUserArray, ...likeFilterUserArray] }
            });
        } else {
            return res.status(400).json({ mssg: "Invalid gender" });
        }

        if (!interestUsers || interestUsers.length === 0) {
            return res.status(404).json({ mssg: "No users found with matching interest and city" });
        }

        // Filter out users from interestUsers who are in hideRemainMatchUsers
        const hideRemainMatchUserIds = hideRemainMatchUsers.map(user => user._id.toString());
        interestUsers = interestUsers.filter(user => !hideRemainMatchUserIds.includes(user._id.toString()));

        res.json({ interestUsers });
        console.log('interest user is', interestUsers);
    } catch (error) {
        res.status(500).json({ mssg: "Internal server error" });
    }
};


exports.addFilterUser = async (req, res) => { // if you want to unlike user that unlike user id store in a database with the help of these func
    try {
        const userId = req.params.id; // login person  userId
        console.log('user id is', userId);

        // Fetch the user object based on the provided userId
        const userObj = await authUser.findById(userId);
        if (!userObj) {
            return res.status(404).json({ mssg: "User not found" });
        }

        const addUserId = req.body.userId; // unlike person user id
        console.log('add id is', addUserId);

        // Update the user object to add the new ID to the filterData array
        userObj.filterData.push(addUserId); // Assuming filterData is an array in your User model

        // Save the updated user object
        const updatedUser = await userObj.save();

        res.json({ user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
};

// exports.addVisitorUser=async(req,res)=>{
//     try{
//         const userId = req.params.id;
//         console.log('user id is', userId);

//         // Fetch the user object based on the provided userId
//         const userObj = await authUser.findById(userId);
//         if (!userObj) {
//             return res.status(404).json({ mssg: "User not found" });
//         }
//         const addVisitorUserId = req.body.visitorUserId;
//         console.log('add id is', addVisitorUserId)
        
//         userObj.visitors.push(addVisitorUserId)

//         const visitorsUser=await userObj.save()
//         res.json({visitor:visitorsUser})
//     }catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// }

// purane visitor wala func

// exports.addVisitorUser=async(req,res)=>{ // function of store id of visitor user in a login User
//     try{
     
//         const personUserId=req.body.userId // login user id
//         const visitorUserId = req.params.id; // visitor id
//         const userObj = await authUser.findById(personUserId);
//         console.log('user obj is',userObj)
//         if (!userObj) {
//                  return res.status(404).json({ mssg: "User not found" });
//              }
//              userObj.visitors.push(visitorUserId)
//              const visitorsUser=await userObj.save()
//              res.json({visitor:visitorsUser})
//     }catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// }
exports.addVisitorUser = async (req, res) => {
    try {
        const personUserId = req.body.userId; // login user id
        const visitorUserId = req.params.id; // visitor id
        const userObj = await authUser.findById(personUserId);
        
        if (!userObj) {
            return res.status(404).json({ mssg: "User not found" });
        }
        
        const visitorData = {
            visitorId: visitorUserId,
            visitedAt: new Date()
        };
        
        userObj.visitors.push(visitorData);
        const visitorsUser = await userObj.save();
        
        res.json({ visitor: visitorsUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
};

// exports.getVisitorUser=async(req,res)=>{
//     try{
//         const userId = req.params.id; 
//         const user = await authUser.findById(userId);
//         console.log('user is',user)
//         const visitorUserArray=user.visitors
//         console.log('visitors is',visitorUserArray)
//         let getVisitors;
//         getVisitors = await authUser.find({  
//             _id: { $in: visitorUserArray }, 
            
//         });
//         res.json({ getVisitors });
//     }catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// }

//purane getVisitor wala func 

// exports.getVisitorUser=async(req,res)=>{ // function to show visitor user in a login user
//     try{
//         const userId = req.params.id; // login user id
//         const user = await authUser.findById(userId);
//         console.log('user is',user)
//         const visitorUserArray=user.visitors
//         console.log('visitors is',visitorUserArray)
//         let getVisitors;
//         getVisitors = await authUser.find({  
//             _id: { $in: visitorUserArray }, 
            
//         });
//         const lastVisitor = getVisitors[0];
//         console.log('Last visitor:', lastVisitor);
//         res.json({ getVisitors,data:lastVisitor });
//     }catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// }
// const formatTimeDifference = (date) => {
//     const now = new Date();
//     const diffMs = now - date;
//     const diffSec = Math.floor(diffMs / 1000);
//     const diffMin = Math.floor(diffSec / 60);
//     const diffHrs = Math.floor(diffMin / 60);
//     const diffDays = Math.floor(diffHrs / 24);
    
//     if (diffMin < 60) return `${diffMin} minutes ago`;
//     if (diffHrs < 24) return `${diffHrs} hours ago`;
//     if (diffDays === 1) return `yesterday`;
//     return `${date.toDateString()}`;
// };

// second modication
// const formatTimeDifference = (date) => {
//     const now = new Date();
//     const diffMs = now - date;
//     const diffSec = Math.floor(diffMs / 1000);
//     const diffMin = Math.floor(diffSec / 60);
//     const diffHrs = Math.floor(diffMin / 60);
//     const diffDays = Math.floor(diffHrs / 24);

//     if (diffMin < 60) return `${diffMin} minutes ago`;
//     if (diffHrs < 24) return `${diffHrs} hours ago`;
//     if (diffHrs ===24) return `yesterday`;
//     if (diffHrs > 28 ) return `${diffDays} days ago`;

//     // Format the date as DD MMM YYYY
//     const options = { day: 'numeric', month: 'long', year: 'numeric' };
//     return date.toLocaleDateString('en-US', options);

// };

// // Example usage
// const visitDate = new Date('2024-06-08T10:00:00Z');
// console.log('format date',formatTimeDifference(visitDate));

const formatTimeDifference = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    if (diffHrs === 1) return `yesterday`;
    
    if (diffHrs > 28) {
        // Format the date as 'Month Day, Year'
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    return `${diffDays} days ago`;
};

// Example usage
const visitDate = new Date('2024-06-08T10:00:00Z');
console.log('format date', formatTimeDifference(visitDate));
exports.getVisitorUser = async (req, res) => {
    try {
        const userId = req.params.id; // login user id
        const user = await authUser.findById(userId);
        
        if (!user) {
            return res.status(404).json({ mssg: "User not found" });
        }
        
        const visitorUserArray = user.visitors.map(visitor => visitor.visitorId);
        const getVisitors = await authUser.find({ _id: { $in: visitorUserArray } });

        // Combine visitor details with the formatted time
        const visitorsWithTime = user.visitors.map(visitor => {
            const visitorInfo = getVisitors.find(u => u._id.toString() === visitor.visitorId.toString());
            return {
                visitor: visitorInfo,
                visitedAt: formatTimeDifference(new Date(visitor.visitedAt))
            };
        });

        res.json({ visitors: visitorsWithTime });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
};
// exports.addLikesUser=async(req,res)=>{ // function to store login user id in a like user
//     try{
//         const personUserId=req.body.likeUserId // like user id
//         const likesUserId = req.params.id; // login user id
//         console.log(personUserId, 'fjdkff',likesUserId)
//         const userObj = await authUser.findById(personUserId);
//         console.log('user obj is',userObj)
//         if (!userObj) {
//                  return res.status(404).json({ mssg: "User not found" });
//              }
//              userObj.likes.push(likesUserId)
//              const likeUser=await userObj.save()
//              res.json({likes:likeUser})

//     }catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// }
// purane wala addLikeUser func 
// exports.addLikesUser = async (req, res) => {
//     try {
//         const personUserId = req.body.likeUserId; // like user id
//         const likesUserId = req.params.id; // login user id
//         console.log(personUserId, 'fjdkff', likesUserId);

//         const userObj = await authUser.findById(personUserId);
//         console.log('user obj is', userObj);

//         if (!userObj) {
//             return res.status(404).json({ mssg: "User not found" });
//         }

//         // Check if likeUserId is already present in userObj.visitors
//         if (userObj.visitors.includes(likesUserId)) {
//             return res.status(400).json({ mssg: "User already visited" });
//         }

//         // If likeUserId is not present in visitors, add it to likes
//         userObj.likes.push(likesUserId);
//         userObj.hideRemainMatch.push(likesUserId)
//         const likeUser = await userObj.save();
//         res.json({ likes: likeUser });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// };
// add like user
exports.addLikesUser = async (req, res) => {
    try {
        const personUserId = req.body.likeUserId; // like user id
        const likesUserId = req.params.id; // login user id
        console.log(personUserId, 'fjdkff', likesUserId);

        const userObj = await authUser.findById(personUserId);
        console.log('user obj is', userObj);
        
        const likeUserObj = await authUser.findById(likesUserId);

        if (!userObj) {
            return res.status(404).json({ mssg: "User not found" });
        }

        // Check if likesUserId is already present in userObj.visitors
        const alreadyVisited = userObj.visitors.some(visitor => visitor.visitorId.toString() === likesUserId);
        if (alreadyVisited) {
            return res.status(400).json({ mssg: "User already visited" });
        }

        // If likesUserId is not present in visitors, add it to likes
        userObj.likes.push(likesUserId);
        userObj.hideRemainMatch.push(likesUserId);
        
        // await client.messages.create({
        //     body: 'Hello from your app!', // Your message here
        //     from: '+1234567890', // Your Twilio phone number
        //     to: likeUserObj.phone // Phone number of likeUserObj
        // });
        const likeUser = await userObj.save();
        res.json({ likes: likeUser });

     

    } catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
};






exports.getLikesUser=async(req,res)=>{ // function to get data of like user
    try{
        const userId = req.params.id; // login user id
        const user = await authUser.findById(userId);
        console.log('user is',user)
        const likeUserArray=user.likes
        console.log('visitors is',likeUserArray)
        let likeUser;
        likeUser = await authUser.find({  
            _id: { $in: likeUserArray }, 
            
        });
   

        res.json({ likeUser });
    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}
exports.likeFilterUser=async(req,res)=>{ // function to store like user id in a login user
try{
    const userId = req.params.id;
    console.log('user id is', userId);

    // Fetch the user object based on the provided userId
    const userObj = await authUser.findById(userId);
    if (!userObj) {
        return res.status(404).json({ mssg: "User not found" });
    }

    const addLikeUserId = req.body.likeUserId;
    console.log('add like id is', addLikeUserId);

    // Update the user object to add the new ID to the filterData array
    userObj. likeFilterData.push(addLikeUserId); // Assuming filterData is an array in your User model

    // Save the updated user object
    const likeUpdatedUser = await userObj.save();
    res.json({ user: likeUpdatedUser });
}catch (error) {
    console.error(error);
    res.status(500).json({ mssg: "Internal server error" });
}
}
exports.addToChatUser=async(req,res)=>{
try {
    const userId = req.params.id;
    console.log('user id is', userId);

    // Fetch the user object based on the provided userId
    const userObj = await authUser.findById(userId);
    if (!userObj) {
        return res.status(404).json({ mssg: "User not found" });
    }

    const addToChatUserId = req.body.addToChatId;
    console.log('addToChat id', addToChatUserId);

    // Update the user object to add the new ID to the filterData array
    userObj. addToChatData.push(addToChatUserId); // Assuming filterData is an array in your User model

    // Save the updated user object
    const addToChatUpdatedUser = await userObj.save();
    res.json({ user:  addToChatUpdatedUser });
}catch (error) {
    console.error(error);
    res.status(500).json({ mssg: "Internal server error" });
}
}
exports.getToChatUser=async(req,res)=>{
    try{
        const userId = req.params.id; 
        const user = await authUser.findById(userId);
        console.log('user is',user)
        const getChatUserArray=user.addToChatData
        console.log('get chat user',getChatUserArray)
        let chatUser;
        chatUser = await authUser.find({  
            _id: { $in: getChatUserArray }, 
            
        });
        res.json({ chatUser });
    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}
exports.updateauthUser=async(req,res)=>{ // function to update user
    try{
        const _id=req.params.id
        console.log('body is',req.body)
        console.log(_id)
        const updateUser=await authUser.findByIdAndUpdate(_id,req.body,{
            new:true
        })
        res.status(201).send({mssg:'update data successfully',updateData:updateUser})
        console.log('update is',updateUser)
    }catch(e){
        res.status(404).send({mssg:'internal server error'})
    }
}

// purane wala
exports.counterUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userId=req.body.userId
    const userObj = await authUser.findById(userId);
    // console.log('user data obj',userObj)

    console.log('obj counter data is',obj)
    if (userObj) {
      userObj.counter = userObj.counter ? userObj.counter + 1 : 1; // Incrementing the counter value
      await userObj.save(); // Saving the updated userObj
    //   io.emit('new counter', { userId: userId, counter: userObj.counter });
      console.log('Updated userObj:', userObj);
      res.status(200).send({ message: 'Counter incremented successfully', userObj });
    } 
 
    else {
      
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

// exports.counterUser = async (userId) => {
//     try {
//       const id = req.params.id;
//       const userId=userId
//       const userObj = await authUser.findById(userId);
//       // console.log('user data obj',userObj)
//       if (userObj) {
//         userObj.counter = userObj.counter ? userObj.counter + 1 : 1; // Incrementing the counter value
//         await userObj.save(); // Saving the updated userObj
//       //   io.emit('new counter', { userId: userId, counter: userObj.counter });
//         console.log('Updated userObj:', userObj);
//         // res.status(200).send({ message: 'Counter incremented successfully', userObj });
//         return userObj.counter
//       } else {
        
//         // res.status(404).send({ message: 'User not found' });
//         return 0
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     //   res.status(500).send({ message: 'Internal server error' });
//     return 0
//     }
//   };
exports.getCounterUser=async(req,res)=>{
    try{
        const userId = req.params.id; 
        const user = await authUser.findById(userId);
        console.log('get count user is',user.counter)
        res.json({ getCount:user.counter });
     
    } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
}
exports.deleteCounterUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await authUser.findById(userId);
        
        if (user) {
            // Delete the counter property from the user object
            user.counter = null; // or delete user.counter;

            // Save the updated user object
            await user.save();

            console.log('Counter deleted for user:', user);
            res.status(200).send({ message: 'Counter deleted successfully', user });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
exports.addNotifyUser = async (req, res) => {
    try {
      const id = req.params.id;
      const userId=req.body.userId
      const userObj = await authUser.findById(userId);
      userObj.notify=id
      await userObj.save()
      res.status(200).send({ message: 'notify user updated',user:userObj });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  };

  exports.getNotifyUser = async (req, res) => {
    try {
      const userId = req.params.id; 
      const user = await authUser.findById(userId);
  
      // Check if the user is found
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
     const obj=await authUser.findById(user.notify)
      // Respond with the user's notification data
      res.status(200).send({data:obj});
      setTimeout(async () => {
        user.notify = null; // Clear the notification
        await user.save(); // Save the changes
      }, 5000);
      // Optionally, clear the user's notification after a certain duration
     
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  };
  
  exports.addLikeNotifyUser = async (req, res) => {
    try {
      const id = req.params.id;
      const userId=req.body.userId
      const userObj = await authUser.findById(userId);
      userObj.likeNotify=id
      await userObj.save()
      res.status(200).send({ message: 'notify like user updated',user:userObj });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  };

  exports.getLikeNotifyUser = async (req, res) => {
    try {
      const userId = req.params.id; 
      const user = await authUser.findById(userId);
  
      // Check if the user is found
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
     const obj=await authUser.findById(user.likeNotify)
     const matchObj=await authUser.findById(user.matchNotify)
     const match= obj && matchObj && obj._id.toString()===matchObj._id.toString()
      // Respond with the user's notification data
      if (match) {
        res.status(200).send({});
    } else {
        res.status(200).send({ data: obj });
    }

      setTimeout(async () => {
        user.likeNotify = null; // Clear the notification
        await user.save(); // Save the changes
      }, 5000);
      // Optionally, clear the user's notification after a certain duration
     
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  };

  exports.addLikeCounterUser = async (req, res) => {
    try {
      const id = req.params.id;
      const userId = req.body.userId;
      const userObj = await authUser.findById(userId);
  
      if (userObj) {
        // Check if the id is present in the visitors array
        // const isVisitor = userObj.visitors && userObj.visitors.includes(id);
        const isVisitor =  userObj.visitors && userObj.visitors.some(visitor => visitor.visitorId.toString() === id);
        if (!isVisitor) {
          userObj.likeCounter = userObj.likeCounter ? userObj.likeCounter + 1 : 1; // Incrementing the counter value
          await userObj.save(); // Saving the updated userObj
          console.log(' add like count Updated userObj:', userObj);
          res.status(200).send({ message: 'Like Counter incremented successfully', userObj });
        } else {
          console.log('User is a visitor, like counter not incremented');
          res.status(200).send({ message: 'User is a visitor, like counter not incremented', userObj });
        }
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  };
  
  exports.getLikeCounterUser=async(req,res)=>{
    try{
        const userId = req.params.id; 
        const user = await authUser.findById(userId);
        console.log('get like count user is',user.likeCounter)
        res.json({ getLikeCount:user.likeCounter });
     
    } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
}

exports.deleteLikeCounterUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await authUser.findById(userId);
        
        if (user) {
            // Delete the counter property from the user object
            user.likeCounter = null; // or delete user.counter;

            // Save the updated user object
            await user.save();

            console.log('like Counter deleted for user:', user);
            res.status(200).send({ message: 'like Counter deleted successfully', user });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
exports.addVisitorPlusLikesUser=async(req,res)=>{ // function to store login user id in a like user
    try{
        const personUserId=req.body.visitorPlusLikeUserId // like user id
        const likesUserId = req.params.id; // login user id
        console.log(personUserId, 'visitorPlusLike',likesUserId)
        const userObj = await authUser.findById(likesUserId);
        if (!userObj) {
                 return res.status(404).json({ mssg: "User not found" });
             }
             userObj.likeUser.push(personUserId)
             const visitorPlusLikeUser=await userObj.save()
             console.log('visitor person like',visitorPlusLikeUser)
             res.json({visitorLikes:visitorPlusLikeUser})

    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}

exports.getVisitorPlusLikesUser=async(req,res)=>{ // function to get data of like user
    try{
        const userId = req.params.id; // login user id
        const user = await authUser.findById(userId);
        console.log('get visitor plus like user is',user)
        const likeVisitorUserArray=user.likeUser
        console.log(' like plus visitors is',likeVisitorUserArray)
        let likeUser;
        likeUser = await authUser.find({  
            _id: { $in: likeVisitorUserArray }, 
            
        });
        res.json({ likeUser });
    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}

exports.addVisitorPlusSkipUser=async(req,res)=>{ // function to store login user id in a like user
    try{
        const personUserId=req.body.visitorPlusSkipUserId // like user id
        const likesUserId = req.params.id; // login user id
        console.log(personUserId, 'visitorPlusSkip',likesUserId)
        const userObj = await authUser.findById(likesUserId);
        if (!userObj) {
                 return res.status(404).json({ mssg: "User not found" });
             }
             userObj.skipUser.push(personUserId)
             const visitorPlusSkipUser=await userObj.save()
             console.log('visitor person skip',visitorPlusSkipUser)
             res.json({visitorSkip:visitorPlusSkipUser})

    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}


exports.getVisitorPlusSkipUser=async(req,res)=>{ // function to get data of like user
    try{
        const userId = req.params.id; // login user id
        const user = await authUser.findById(userId);
        console.log('get visitor plus skip user is',user)
        const skipVisitorUserArray=user.skipUser
        console.log(' skip plus visitors is',skipVisitorUserArray)
        let skipUser;
        skipUser = await authUser.find({  
            _id: { $in: skipVisitorUserArray }, 
            
        });
        res.json({ skipUserData:skipUser });
    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}


// exports.addMatchUser=async(req,res)=>{ // function to store login user id in a like user
//     try{
//         const matchLikeId=req.body.matchLikeId // like user id
//         const loginId = req.params.id; // login user id
//         console.log(matchLikeId, 'matchPlusLike',loginId) 
//         const userObj = await authUser.findById(loginId);
//         const anotherUserObj=await authUser.findById(matchLikeId)
//         const matchUserObj=await authUser.findById(matchLikeId)


//         if (!userObj && !anotherUserObj ) {
//                  return res.status(404).json({ mssg: "User not found" });
//              }
//              userObj.matchUser.push(matchLikeId)
//              anotherUserObj.anotherMatchUser.push(loginId)
//              matchUserObj.matchNotify=loginId
//              const matchLikeUser=await userObj.save()
//              const anotherMatchLikeUser=await anotherUserObj.save()
//              const matchUser=await matchUserObj.save()
//              console.log('match person like',matchLikeUser)
//              console.log('match User',matchUser)
//              res.json({matchLikes:matchLikeUser,loginUser:userObj,anotherLoginUser:anotherUserObj,anotherMatchLikes:anotherMatchLikeUser,matchUserData:matchUser})

//     }catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// }
exports.addMatchUser = async (req, res) => {
    try {
        const matchLikeId = req.body.matchLikeId; // like user id
        const loginId = req.params.id; // login user id
        console.log(matchLikeId, 'matchPlusLike', loginId);
        const userObj = await authUser.findById(loginId);
        const anotherUserObj = await authUser.findById(matchLikeId);
        const matchUserObj = await authUser.findById(matchLikeId);
        console.log('user obj data is',userObj)
        console.log('another user obj data is',anotherUserObj)

        if (!userObj && !anotherUserObj) {
            return res.status(404).json({ mssg: "User not found" });
        }

        if (anotherUserObj.visitors.includes(loginId)) {
            anotherUserObj.counter = (anotherUserObj.counter || 0) + 1;
        }
        const index = anotherUserObj. likeUser.indexOf(loginId);
        if (index > -1) {
            anotherUserObj. likeUser.splice(index, 1);
        }
        // Check if loginId is present in anotherUserObj.likes
        if (!anotherUserObj.likes.includes(loginId)) {
            anotherUserObj.anotherMatchData.push(loginId);
        }

        userObj.matchUser.push(matchLikeId);
        anotherUserObj.anotherMatchUser.push(loginId);
        matchUserObj.matchNotify = loginId;

        const matchLikeUser = await userObj.save();
        const anotherMatchLikeUser = await anotherUserObj.save();
        const matchUser = await matchUserObj.save();

        console.log('match person like', matchLikeUser);
        console.log('match User', matchUser);

        res.json({
            matchLikes: matchLikeUser,
            loginUser: userObj,
            anotherLoginUser: anotherUserObj,
            anotherMatchLikes: anotherMatchLikeUser,
            matchUserData: matchUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
};


// exports.getMatchUser=async(req,res)=>{ // function to get data of like user
//     try{
//         const userId = req.params.id; // login user id
//         const user = await authUser.findById(userId);
//         console.log('get match user is',user)
//         const getMatchUserArray=user.matchUser
//         const anothergetMatchUserArray=user.anotherMatchUser
//         console.log(' get match data is',getMatchUserArray)

//         const obj=await authUser.findById(user.matchNotify)
//         let matchUser;
//         matchUser = await authUser.find({  
//             _id: { $in: getMatchUserArray }, 
            
//         });
//         let anotherMatchUser;
//         anotherMatchUser=await authUser.find({
//             _id: { $in:anothergetMatchUserArray }
//         })
      
       

//         res.json({matchUser: matchUser,anotherMatchUser:anotherMatchUser,lastAnotherMatchUser:obj });
//         setTimeout(async () => {
//             user.matchNotify = null; // Clear the notification
//             await user.save(); // Save the changes
//           }, 5000);
//     }catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// }

// exports.getMatchUser=async(req,res)=>{ // function to get data of like user
//     try{
//         const userId = req.params.id; // login user id
//         const user = await authUser.findById(userId);
//         console.log('get match user is',user)
//         const getMatchUserArray=user.matchUser
//         const anothergetMatchUserArray=user.anotherMatchUser
//         console.log(' get match data is',getMatchUserArray)

//         const obj=await authUser.findById(user.matchNotify)
//         let matchUser;
//         matchUser = await authUser.find({  
//             _id: { $in: getMatchUserArray }, 
            
//         });
//         let anotherMatchUser;
//         anotherMatchUser=await authUser.find({
//             _id: { $in:anothergetMatchUserArray }
//         })
      
             

//         res.json({matchUser: matchUser,anotherMatchUser:anotherMatchUser,lastAnotherMatchUser:obj });
//         setTimeout(async () => {
//             user.matchNotify = null; // Clear the notification
//             await user.save(); // Save the changes
//           }, 5000);
//     }catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// }

exports.getMatchUser=async(req,res)=>{ // function to get data of like user
    try{
        const userId = req.params.id; // login user id
        const user = await authUser.findById(userId);
        console.log('get match user is',user)
        const getMatchUserArray=user.matchUser
        const anothergetMatchUserArray=user.anotherMatchUser
        console.log(' get match data is',getMatchUserArray)
        const anothergetMatchUserData=user.anotherMatchData
        const obj=await authUser.findById(user.matchNotify)
        let matchUser;
        matchUser = await authUser.find({  
            _id: { $in: getMatchUserArray }, 
            
        });
        let anotherMatchUser;
        anotherMatchUser=await authUser.find({
            _id: { $in:anothergetMatchUserArray }
        })
        
        let anotherMatchUserData;
        anotherMatchUserData=await authUser.find({
            _id: { $in:anothergetMatchUserData }
        })
             

        res.json({matchUser: matchUser,anotherMatchUser:anotherMatchUser,lastAnotherMatchUser:obj,anotherMatchUserData:anotherMatchUserData  });
        setTimeout(async () => {
            user.matchNotify = null; // Clear the notification
            await user.save(); // Save the changes
          }, 5000);
    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}





// modifed function
// exports.addMatchUser=async(req,res)=>{ // function to store login user id in a like user
//     try{
//         const matchLikeId=req.body.matchLikeId // like user id
//         const loginId = req.params.id; // login user id
//         console.log(matchLikeId, 'matchPlusLike',loginId) 
//         const userObj = await authUser.findById(loginId);
//         const anotherUserObj=await authUser.findById(matchLikeId)
//         const matchUserObj=await authUser.findById(matchLikeId)


//         if (!userObj && !anotherUserObj ) {
//                  return res.status(404).json({ mssg: "User not found" });
//              }

//              if (anotherUserObj.visitor.includes(loginId)) {
//                 // If present, store loginId in anotherMatchData
//                 anotherUserObj.anotherMatchData.push(loginId);
//               } else {
//                 // If not present, store loginId in anotherMatchUser
//                 anotherUserObj.anotherMatchUser.push(loginId);
//               }

//              userObj.matchUser.push(matchLikeId)
//             //  anotherUserObj.anotherMatchUser.push(loginId)
//              matchUserObj.matchNotify=loginId
//              const matchLikeUser=await userObj.save()
//              const anotherMatchLikeUser=await anotherUserObj.save()
//              const matchUser=await matchUserObj.save()
//              console.log('match person like',matchLikeUser)
//              console.log('match User',matchUser)
//              res.json({matchLikes:matchLikeUser,loginUser:userObj,anotherLoginUser:anotherUserObj,anotherMatchLikes:anotherMatchLikeUser,matchUserData:matchUser})

//     }catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// }

// exports.getMatchUser=async(req,res)=>{ // function to get data of like user
//     try{
//         const userId = req.params.id; // login user id
//         const user = await authUser.findById(userId);
//         console.log('get match user is',user)
//         const getMatchUserArray=user.matchUser
//         const anothergetMatchUserArray=user.anotherMatchUser
//         const anothergetMatchUserData=user.anotherMatchData
//         console.log(' get match data is',getMatchUserArray)

//         const obj=await authUser.findById(user.matchNotify)
//         let matchUser;
//         matchUser = await authUser.find({  
//             _id: { $in: getMatchUserArray }, 
            
//         });
//         let anotherMatchUser;
//         anotherMatchUser=await authUser.find({
//             _id: { $in:anothergetMatchUserArray }
//         })
//         let anotherMatchUserData;
//         anotherMatchUserData=await authUser.find({
//             _id: { $in:anothergetMatchUserData }
//         })
    
       

//         res.json({matchUser: matchUser,anotherMatchUser:anotherMatchUser,lastAnotherMatchUser:obj,anotherMatchUserData:anotherMatchUserData });
//         setTimeout(async () => {
//             user.matchNotify = null; // Clear the notification
//             await user.save(); // Save the changes
//           }, 5000);
//     }catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// exports.addOnlineUser=async(req,res)=>{ // function to store login user id in a like user
//     try{
//         const onlinePersonUserId=req.body.OnlineUserId // like user id
//         const loginId = req.params.id; // login user id
//         console.log(onlinePersonUserId, 'add online User',loginId)
//         const userObj = await authUser.findById(onlinePersonUserId);
//         const anotherUserObj=await authUser.findById(loginId)
//         if (!userObj &&!anotherUserObj) {
//                  return res.status(404).json({ mssg: "User not found" });
//              }
//              userObj. onlineLikeUser.push(loginId)
//              anotherUserObj.anotherLikeUser.push(onlinePersonUserId)
//              const onlineLikeUser=await userObj.save()
//              const anotherOnlineLikeUser=await anotherUserObj.save()
//              console.log('online person like',onlineLikeUser)
//              res.json({onlineLikes:onlineLikeUser,anotherOnlineLikes:anotherOnlineLikeUser})

//     }catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// }

// exports.getOnlineUser=async(req,res)=>{ // function to get data of like user
//     try{
//         const userId = req.params.id; // login user id
//         const user = await authUser.findById(userId);
//         console.log('user is',user)
//         const likeUserArray=user.anotherLikeUser
//         const onlineLikeUserArray=user.onlineLikeUser
      
//         let likeUser;
//         likeUser = await authUser.find({  
//             _id: { $in: likeUserArray }, 
            
//         });
//         let onlineLikeUser;
//        onlineLikeUser = await authUser.find({  
//             _id: { $in: onlineLikeUserArray }, 
            
//         });
//         console.log('get online like user',likeUser)
//         console.log(' another get online like user',onlineLikeUser)
//         res.json({ likeUser:likeUser,onlineLikeUser:onlineLikeUser });
//     }catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// }
// exports.addLikeMatchUser = async (req, res) => {
//     try {
//         const likeId = req.body.onlineMatchLikeId; // like user id
//         const loginId = req.params.id; // login user id
//         console.log(likeId, 'matchPlusLike', loginId);
//         const userObj = await authUser.findById(loginId);
//         const anotherUserObj = await authUser.findById(likeId);
//         console.log('user obj data is',userObj)
//         console.log('another user obj data is',anotherUserObj)

//         if (!userObj && !anotherUserObj) {
//             return res.status(404).json({ mssg: "User not found" });
//         }

//       userObj.likeMatch.push(likeId)
//       anotherUserObj.anotherlikeMatch.push(loginId)
//         const onlineMatchLikeUser = await userObj.save();
      
//         const anotherOnlineMatchLikeUser = await anotherUserObj.save();

//         console.log('online match person like', onlineMatchLikeUser);
//         console.log('another online match User',anotherOnlineMatchLikeUser);

//         res.json({
//            loginOnline:userObj,
//            anotherLoginOnline:anotherUserObj
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// };
exports.addSmsTextUser = async (req, res) => {
    try {
        const smsUserId = req.body.recieverUserId; // like user id
        const senderUserId = req.params.id; // login user id
        console.log(smsUserId, 'sms id', senderUserId);

        const userObj = await authUser.findById(smsUserId);
        console.log('sms user obj is', userObj);

        const likeUserObj = await authUser.findById(senderUserId);

        if (!userObj.phone) {
            throw new Error('User phone number is missing');
        }

        await client.messages.create({
            body: `Congrats! ${likeUserObj.firstName} just liked you now on dateApp checkout your likes`, // Your message here
            from: '+12513335644', // Your Twilio phone number
            to: '+91'+userObj.phone.toString() // Phone number of likeUserObj
        });

        res.status(200).json({ mssg: "Message sent successfully" });

    } catch (error) {
        console.error('Error sending SMS:', error);
        if (error.code === 21408) {
            res.status(400).json({ mssg: "Permission to send an SMS has not been enabled for the region indicated by the 'To' number" });
        } else {
            res.status(500).json({ mssg: "Internal server error" });
        }
    }
};
