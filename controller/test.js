const Users = require('../models/users');
function createUser(dataI){
    return new Promise((resolve, reject) => {
        Users.createUser(dataI, function(err, data){
            if(err){
                reject(err);
            }
            else{
                resolve(data);
            }
        });
    });
}

module.exports = {
    createUser
}