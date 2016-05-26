/////////////////////////////////////////////////
// RESTful API module for accounts.
//
// @file:   accountApi.js
// @author: Eric Brichetto <brichett13@gmail.com>
/////////////////////////////////////////////////

var accountApi = function (knex) {
    //Not yet functional
    var accountController = require('../controllers/accountController')();
    //Not yet functional
    var middleware = function (req, res, next) {
        next();
    };
    
    
    // API methods
    // ==========================================
    //
    // POST /api/accounts
    var addAccount = function (req, res) {
        var account = req.body;
        var result = accountController.addAccount(account);
        // An array in result means it's array of validation errors
        if( Object.prototype.toString.call(result) === '[object Array]' ) {
            res.json(result);
        }
        // An object in result means it's a promise
        // (which is returned only if validation succeeds)
        else {
            result.then(function(partyId) {
               res.json({partyId: partyId}); 
            });
        }
    };

    /* getAccountsByIdentity use the value of req.user for passing API methoads by authentication.
       IdentityId didn't read from the API. So, I take user function and response the security loop.
       This forum are really helpful to me. http://www.ofssam.com/forums/showthread.php?tid=37*/
    // GET /api/accounts/?identity=
    var getAccountsByIdentity = function (req, res) {
        var identityId = req.user.partyId;
        var userSecurityPerm = req.user.securityPermissions;
        accountController.getAccountsByIdentity(identityId, userSecurityPerm)
        .then(function (accounts){
            res.json(accounts);
        });
        
    };
    
    // GET /api/accounts/?owner=
    var getAccountsByOwner = function (req, res) {
        var ownerId = req.params.owner;
        accountController.getAccountsByOwner(ownerId)
            .then(function (accounts) {
                res.json(accounts);
            });
    };
    
    // GET /api/accounts
    var getAccounts = function (req, res) {
        accountController.getAccounts()
            .then(function (accounts) {
                res.json(accounts);
            });
    };
    /*This function also same like the Identity. Identity need to first_name and last_name and Company_Name.
      PhoneNumber also exist from user part. So, firstly, check out the primary key(user.partyID), and call the phoneNumber data.
    */
    // GET /api/accounts/?phoneNumber=
    var getAccountByPhoneNumber = function (req, res) {
        var phoneNumberId = req.user.partyId;
        var userSecurityPerm = req.user.securityPermissions;
        accountController.getAccountByPhoneNumber(phoneNumberId, userSecurityPerm)
        .then(function (accounts){
            res.json(accounts);
        });
        
    };

    // GET /api/accounts/:id
    var getAccountById = function (req, res) {
         var partyId = req.params.id;
        accountController.getAccountById(partyId)
            .then(function(party) {
                res.json(party);
            });
    };
    
    // PUT /api/accounts/:id
    var updateAccount = function (req, res) {
        var partyId = req.params.id;
        var accounts = req.body;
        accountController.updateAccount(partyId, accounts)
            .then(function(result) {
               res.json({updated: result}); 
            });
    };
    
    // DELETE /api/accounts/:id
    var deleteAccount = function (req, res) {
        var partyId = req.params.id;
        accountController.deleteAccount(partyId)
            .then(function(result) {
               res.json({deleted: result}); 
            });
    };

    return {
        addAccount: addAccount,
<<<<<<< HEAD
        getAccountsByIdentity: getAccountsByIdentity,
        getAccountByPhoneNumber:getAccountByPhoneNumber.
=======
        getAccountsByOwner: getAccountsByOwner,
        getAccounts: getAccounts,
        getAccountByPhoneNumber: getAccountByPhoneNumber,
>>>>>>> a31afd8ded91e90418387957111c63cc9e1d9208
        getAccountById: getAccountById,
        updateAccount: updateAccount,
        deleteAccount: deleteAccount
    };
};

//Discussion with Dinesh indicates that we may want to heavily consider placing conditions into our
//getAccounts method so that we centralize all requests to get accounts by different attributes 
//under the one getAccounts method. This would help avoid the proliferation of different API method URLs. 
    
module.exports = accountApi;