const bcrypt=require('bcrypt')
const authUser=require('../models/authSchema')
const io=require('../../app')
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

exports.allUser = async (req , res) => {
    try{
        const users = await authUser.find()
        res.json({
            users : users
        })
    }
    catch(error){

    }
}
// exports.getFilterUser = async (req, res) => {
//     try {
//         const userId = req.params.id; // Assuming the user ID is passed as a parameter in the URL
        
//         // Find the user with the specified ID
//         const user = await authUser.findById(userId);
        
//         if (!user) {
//             return res.status(404).json({ mssg: "User not found" });
//         }

//         const userInterests = user.interest; // Get interests of the user
//         const userGender=user.gender
//         console.log('gender is',userGender)

//         // Find users whose interests array contains at least one of the interests of the specified user
//         const interestUsers = await authUser.find({ interest: { $in: userInterests } });

//         if (!interestUsers || interestUsers.length === 0) {
//             return res.status(404).json({ mssg: "No users found with matching interest" });
//         }

//         res.json({ interestUsers });
//     } catch (error) {
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// }

// exports.getFilterUser = async (req, res) => {
//     try {
//         const userId = req.params.id; // Assuming the user ID is passed as a parameter in the URL
        
//         // Find the user with the specified ID
//         const user = await authUser.findById(userId);
//         const filterUserArray=user.filterData
//         console.log('filter user array ',filterUserArray)
        
//         if (!user) {
//             return res.status(404).json({ mssg: "User not found" });
//         }

//         const userInterests = user.interest; // Get interests of the user
//         const userGender = user.gender;
//         console.log('gender is', userGender);

//         let interestUsers;

//         if (userGender === 'Male') {
//             // Find females with at least one similar interest
//             interestUsers = await authUser.find({ gender: 'Female', interest: { $in: userInterests } });
//         } else if (userGender === 'Female') {
//             // Find males with at least one similar interest
//             interestUsers = await authUser.find({ gender: 'Male', interest: { $in: userInterests } });
//         } else {
//             return res.status(400).json({ mssg: "Invalid gender" });
//         }

//         if (!interestUsers || interestUsers.length === 0) {
//             return res.status(404).json({ mssg: "No users found with matching interest" });
//         }
        
//         res.json({ interestUsers });
//     } catch (error) {
//         res.status(500).json({ mssg: "Internal server error" });
//     }
// }


exports.getFilterUser = async (req, res) => { // now show all updated user on the basis of gender and not show like and ulike user 
    try {                                     // on the basis of id
        const userId = req.params.id; // Assuming the user ID is passed as a parameter in the URL
        console.log('get filter data',userId) // login user id
        // Find the user with the specified ID
        const user = await authUser.findById(userId);
        const filterUserArray = user.filterData;
        console.log('filter user array ', filterUserArray);

        const likeFilterUserArray=user.likeFilterData
        console.log('like filter user Array',likeFilterUserArray)
        
        if (!user) {
            return res.status(404).json({ mssg: "User not found" });
        }

        const userInterests = user.interest; // Get interests of the user
        const userGender = user.gender;
        console.log('gender is', userGender);

        let interestUsers;

        if (userGender === 'Male') {
            // Find females with at least one similar interest and not in filterUserArray or likeFilterUserArray
            interestUsers = await authUser.find({ 
                gender: 'Female', 
                interest: { $in: userInterests },
                // _id: { $nin: filterUserArray } // Exclude IDs in filterUserArray
                _id: { $nin: [...filterUserArray, ...likeFilterUserArray] } 
            });
        } else if (userGender === 'Female') {
            // Find males with at least one similar interest and not in filterUserArray or likeFilterUserArray
            interestUsers = await authUser.find({ 
                gender: 'Male', 
                interest: { $in: userInterests },
                // _id: { $nin: filterUserArray } // Exclude IDs in filterUserArray
                _id: { $nin: [...filterUserArray, ...likeFilterUserArray] } 
            });
        } else {
            return res.status(400).json({ mssg: "Invalid gender" });
        }

        if (!interestUsers || interestUsers.length === 0) {
            return res.status(404).json({ mssg: "No users found with matching interest" });
        }
        
        res.json({ interestUsers });
        console.log('interest user is',interestUsers)
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
 
exports.addVisitorUser=async(req,res)=>{ // function of store id of visitor user in a login User
    try{
     
        const personUserId=req.body.userId // login user id
        const visitorUserId = req.params.id; // visitor id
        const userObj = await authUser.findById(personUserId);
        console.log('user obj is',userObj)
        if (!userObj) {
                 return res.status(404).json({ mssg: "User not found" });
             }
             userObj.visitors.push(visitorUserId)
             const visitorsUser=await userObj.save()
             res.json({visitor:visitorsUser})
    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}
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
exports.getVisitorUser=async(req,res)=>{ // function to show visitor user in a login user
    try{
        const userId = req.params.id; // login user id
        const user = await authUser.findById(userId);
        console.log('user is',user)
        const visitorUserArray=user.visitors
        console.log('visitors is',visitorUserArray)
        let getVisitors;
        getVisitors = await authUser.find({  
            _id: { $in: visitorUserArray }, 
            
        });
        const lastVisitor = getVisitors[0];
        console.log('Last visitor:', lastVisitor);
        res.json({ getVisitors,data:lastVisitor });
    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}
exports.addLikesUser=async(req,res)=>{ // function to store login user id in a like user
    try{
        const personUserId=req.body.likeUserId // like user id
        const likesUserId = req.params.id; // login user id
        console.log(personUserId, 'fjdkff',likesUserId)
        const userObj = await authUser.findById(personUserId);
        console.log('user obj is',userObj)
        if (!userObj) {
                 return res.status(404).json({ mssg: "User not found" });
             }
             userObj.likes.push(likesUserId)
             const likeUser=await userObj.save()
             res.json({likes:likeUser})

    }catch (error) {
        console.error(error);
        res.status(500).json({ mssg: "Internal server error" });
    }
}
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


exports.counterUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userId=req.body.userId
    const userObj = await authUser.findById(userId);
    // console.log('user data obj',userObj)
    if (userObj) {
      userObj.counter = userObj.counter ? userObj.counter + 1 : 1; // Incrementing the counter value
      await userObj.save(); // Saving the updated userObj
    //   io.emit('new counter', { userId: userId, counter: userObj.counter });
      console.log('Updated userObj:', userObj);
      res.status(200).send({ message: 'Counter incremented successfully', userObj });
    } else {
      
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
      // Respond with the user's notification data
      res.status(200).send({data:obj});
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
      const userId=req.body.userId
      const userObj = await authUser.findById(userId);
      // console.log('user data obj',userObj)
      if (userObj) {
        userObj.likeCounter = userObj.likeCounter ? userObj.likeCounter + 1 : 1; // Incrementing the counter value
        await userObj.save(); // Saving the updated userObj
        console.log(' add like count Updated userObj:', userObj);
        res.status(200).send({ message: 'Like Counter incremented successfully', userObj });
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