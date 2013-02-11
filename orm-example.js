/* You'll need to 
 * npm install sequelize
 * before running this example. Documentation is at http://sequelizejs.com/ 
 */

var Sequelize = require("sequelize");
var sequelize = new Sequelize("chat", "root", "");
/* TODO this constructor takes the database name, username, then password.
 * Modify the arguments if you need to */



/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */
var User = sequelize.define('users', {
  user_name: {type: Sequelize.STRING, primaryKey: true}
});

var Rooms = sequelize.define('rooms', {
  room_name: {type: Sequelize.STRING, primaryKey: true}
});

var Messages = sequelize.define('messages', {
  text: {type: Sequelize.TEXT},
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, unique: true}
});

Messages
  .hasOne(Rooms, {as: 'room_name', foreignKey: 'room_name'})
  .hasOne(User, {as: 'user_name', foreignKey: 'user_name'})



/* .sync() makes Sequelize create the database table for us if it doesn't
 *  exist already: */

User.sync().success(function() {
  /* This callback function is called once sync succeeds. */

  // now instantiate an object and save it:
  var newUser = User.build({user_name: "Jean Valjean"});
  newUser.save().success(function() {
    /* This callback function is called once saving succeeds. */

    // Retrieve objects from the database:
    User.findAll({ where: {user_name: "Jean Valjean"} }).success(function(usrs) {
      // This function is called back with an array of matches.
      for (var i = 0; i < usrs.length; i++) {
        console.log(usrs[i].user_name);
      }
    });
  });
});

Rooms.sync().success(function() {
  var newRoom = Rooms.build({room_name: "cool kids club"});

  newRoom.save().success(function(){
    Rooms.findAll({ where: {room_name: "cool kids club"} }).success(function(rooms){
      for (var i = 0; i < rooms.length; i++) {
        console.log(rooms[i].room_name);
      }
    });
  });
});


Messages.sync().success(function(){
  var newMessage = {
    text: "gosh, we're so cool",
    user_name: "Jean Valjean",
    room_name: "cool kids club"
  };

  var dbMessage = Messages.build();
  dbMessage.text = newMessage.text;

  Rooms.find({ where: {room_name: newMessage.room_name} }).success(function(room){
    dbMessage.room_name = room;
  });

  User.find({ where: {user_name: newMessage.user_name} }).success(function(user){
    dbMessage.user_name = user;
  });

  dbMessage.save().success(function(){
    Messages.findAll({ where: {text: "gosh, we're so cool"} })
      .success(function(messages){
        for (var i = 0; i < messages.length; i++) {
          console.log(messages[i].text);
        }
      }).error(function(error){
        console.log(error);
      });
  });

  // var newMessage = Messages.build({text: "gosh, we're so cool"}, room_name); //need to get foreign key for username and roomname
});



































