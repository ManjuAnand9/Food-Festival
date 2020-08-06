var ArrayList = require('arraylist');
var UserConnection = require('./userConnection.js');
var connection =  require('./connection.js');


class UserProfile{

     constructor(userID,userConnections){
       this._userConnections = userConnections;
       this._userID = userID;
     }

     get userConnections(){
       return this._userConnections;
     }
     set userConnections(userConnections){
       this._userConnections = userConnections;
     }

     get userID(){
       return this._userID;
     }
     set userID(userID){
       this._userID = userID;
     }

     updateConnection(userConnection){
         this._userConnections.forEach (userConn => {
             if(userConn.connection._foodId === userConnection.connection._foodId){
               userConn._rsvp = userConnection.rsvp;
             }
       });
       return this._userconnections;
     }

     addUpdateConnection(connection,rsvp){
        var connectionExist = false;
        this._userConnections.forEach (userConnection => {
          if(userConnection._connection._foodId === connection._foodId){
            userConnection._rsvp = rsvp;
            connectionExist = true;
          }
        });
        if(!connectionExist){
           let newConnection = new UserConnection(connection,rsvp);
           this._userConnections.push(newConnection);
        }
        return this._userConnections;
      };


      getUserConnections(){
          let connectionsList = new ArrayList;
          this._userConnections.forEach (userConn => {
              connectionsList.add(userConn);
          });
          return connectionsList;
      }


      removeConnection(connection){
        let removeIndex;
          this._userConnections.forEach (userConnection => {
            if(userConnection._connection._foodId === connection._foodId){
                removeIndex = this._userConnections.indexOf(userConnection);
            }
          }); 
          this._userConnections.splice(removeIndex,1);
          return this._userConnections;
      };


      emptyProfile(){

        this._userConnections = null;
        this._userID = null;

      }

}
module.exports = UserProfile;
