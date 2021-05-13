const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 5000;
const allUsers=require('./data.json');

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
   let users=allUsers;
   res.render("index", {users});
  });

app.get("/userProfile/:userID", async (req, res) => {  
    let userId=req.params.userID;
    let user=findUser(userId);
    let friendsIDs=user.friends;   
    let friends = friendsIDs.map(x=>findUser(parseInt(x)));
    let friendsOfFriends=[];
    friends.forEach(function(user) {
      user.friends.forEach(function(listItem){
        if(listItem!=userId && friendsIDs.includes(listItem)==false){
           friendsOfFriends.push(listItem);
        }
      });
    });
    let friendsReduced=[... new Set(friendsOfFriends.map(x=>findUser(parseInt(x))))];  
    let duplicates  = []
    const tempArray = [...friendsOfFriends].sort()   
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i + 1] === tempArray[i]) {
        duplicates .push(tempArray[i])
      }
    }
    let sugestedFriends=duplicates.map(x=>findUser(parseInt(x)));
    return res.render("oneUser", {user,friends,friendsReduced,sugestedFriends});
});

function findUser(userID){
 let selectedUser=allUsers.find(item => item.id === parseInt(userID));  
  return selectedUser;
}

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
});