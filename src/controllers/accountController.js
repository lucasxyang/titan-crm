/////////////////////////////////////////////////
// Business logic module for Account.
//
// @file:   accountController.js
// @author: DukJin Ahn <ahnxx089@gmail.com>
/////////////////////////////////////////////////

/* jshint camelcase: false */

var winston = require('winston');
var Account = require('../entities/account');
var userController = require('../controllers/userController');
var contactInfoHelper = require('../controllers/helpers/contactInfoHelper');
var addContactMechCallback = require('../controllers/helpers/addContactMechCallbackHelper');

var accountController = function (knex) {
    // Get a reference to data layer module
    //
    var accountData = require('../data/accountData')(knex);
    var contactMechController = require('../controllers/contactMechController')(knex);

    // CONTROLLER METHODS
    // ==========================================
    //
    /**
     * Add a new account
     * @param {Object} account - The new account to be added
     * @return {Object} promise - Fulfillment value is id of new account
    */
    var addAccount = function (account, user, contact) {
        //Check user's security permissions to add account
        //var hasPermission = _.indexOf(user.securityPermissions, 'CRMSFA_ACCOUNT_CREATE'); <-- using lodash library
        var hasSecurityPermissions = user.securityPermissions; //should be an array of sec groups, with
        //each one having an array of granular permissions pulled from the database, e.g. secPermissions = [ 'Contact_Owner': [1, 2, 3], 'FullAdmin': [...], ...];. 
        //So only someone with permission CRMSFA_ACCOUNT_CREATE to add a new Account, in this example.
        //if (hasSecurityPermissions !== -1) { the below code }
        var now = (new Date()).toISOString();
        var contactMechEntities = contactInfoHelper(account);
        console.log(contactMechEntities);
        var typeofCME = Object.prototype.toString.call(contactMechEntities);
        console.log("contactMechEntities type should be an array: " + typeofCME);
        // Convert the received object into an entity
        var accountEntity = new Account(
            null,
            account.partyTypeId,
            account.preferredCurrencyUomId,
            account.description,
            account.statusId,
            user.userId,
            now,
            now,
            account.orgName,
            account.officeSiteName,
            account.annualRevenue,
            account.numEmployees,
            account.tickerSymbol,
            account.comments,
            account.logoImgURL,
            account.partyParentId,
            account.industryEnumId,
            account.ownershipEnumId,
            account.importantNote,
            account.primaryPostalAddress,
            account.primaryTelecomNumber,
            account.primaryEmail,
            account.primaryPostalAddressId, //creating new properties on the account object, for database write purposes only
            account.primaryTelecomNumberId,
            account.primaryEmailId
        );
        // Validate the data before going ahead
        var validationErrors = accountEntity.validateForInsert();
        //MUST I ALSO VALIDATE THE USER CREDENTIALS AS WELL? I'M PASSING IT TO THE DB...
        //var userEntity = userController.getUserById(user.userId);
        if (validationErrors.length === 0) {
            // Pass on the entity to be added to the data layer
            
            var promise = accountData.addAccount(accountEntity, user);

            var addContactMechPromises = [];
            var mechPromise;
            for (var i = 0; i < contactMechEntities.length; i++) {
                mechPromise = contactMechController.addContactMech(contactMechEntities[i]);
                // Make sure we have promise,
                // and not array of errors
                if ('then' in mechPromise) {
                    addContactMechPromises.push(mechPromise);
                }
            }
            promise.catch(function (error) {
                winston.error(error);
            });

            if (addContactMechPromises.length > 0) {
                return promise.then(function (partyId) {
                    return addContactMechCallback(addContactMechPromises, contactMechEntities, partyId);
                });
            } else {
                return promise;
            }
            promise.catch(function (error) {
                winston.error(error);
            });
            return promise;
        } else {
            return validationErrors;
        }
    };
    /**
     * Gets all account.
     * @return {Object} promise - Fulfillment value is an array of account entities
     */
    var getAccounts = function () {
        var promise = accountData.getAccounts()
            .then(function (accounts) {
                // Map the retrieved result set to corresponding entities
                var accountEntities = [];
                for (var i = 0; i < accounts.length; i++) {
                    var account = new Account();
                    account.partyId = accounts[i].party_id;
                    account.partyTypeId = accounts[i].party_type_id;
                    account.preferredCurrencyUomId = accounts[i].preferred_currency_uom_id;
                    account.description = accounts[i].description;
                    account.statusId = accounts[i].status_id;
                    account.createdBy = accounts[i].created_by;
                    account.createdDate = accounts[i].created_date;
                    account.updatedDate = accounts[i].updated_date;
                    account.orgName = accounts[i].organization_name;
                    account.officeSiteName = accounts[i].office_site_name;
                    account.annualRevenue = accounts[i].annual_revenue;
                    account.numEmployees = accounts[i].num_employees;
                    account.tickerSymbol = accounts[i].ticker_symbol;
                    account.comments = accounts[i].comments;
                    account.logoImgURL = accounts[i].logo_image_url;
                    account.partyParentId = accounts[i].party_parent_id;
                    account.industryEnumId = accounts[i].industry_enum_id;
                    account.ownershipEnumId = accounts[i].ownership_enum_id;
                    account.importantNote = accounts[i].important_note;
                    account.primaryPostalAddressId = accounts[i].primary_postal_address_id;
                    account.primaryTelecomNumberId = accounts[i].primary_telecom_number_id;
                    account.primaryEmailId = accounts[i].primary_email_id;
                    
                    accountEntities.push(account);
                }
                return accountEntities;
            });
        promise.catch(function (error) {
            // Log the error
            winston.error(error);
        });
        return promise;
    };

    /**
     * Gets one account by its id
     * @param {Number} partyId - Unique id of the party to be fetched
     * @return {Object} promise - Fulfillment value is a account entity
     */
    var getAccountById = function (partyId) {
        var promise = accountData.getAccountById(partyId)
            .then(function (accounts) {
                // Map the retrieved result set to corresponding entity
                var accountEntity;
                if (accounts.length > 0) {
                    accountEntity = new Account(
                        accounts[0].party_id,
                        accounts[0].party_type_id,
                        accounts[0].preferred_currency_uom_id,
                        accounts[0].description,
                        accounts[0].status_id,
                        accounts[0].created_by,
                        accounts[0].created_date,
                        accounts[0].updated_date,
                        accounts[0].organization_name,
                        accounts[0].office_site_name,
                        accounts[0].annual_revenue,
                        accounts[0].num_employees,
                        accounts[0].ticker_symbol,
                        accounts[0].comments,
                        accounts[0].logo_image_url,
                        accounts[0].party_parent_id,
                        accounts[0].industry_enum_id,
                        accounts[0].ownership_enum_id,
                        accounts[0].important_note,
                        accounts[0].primary_postal_address_id,
                        accounts[0].primary_telecom_number_id,
                        accounts[0].primary_email_id
                    );
                }
                return accountEntity;
            });
        promise.catch(function (error) {
            // Log the error
            winston.error(error);
        });
        return promise;
    };
    /**
     * Gets all accounts associated with a given owner from the database
     * @param {Number} ownerId - Unique party_id of the owner
     * @return {Object} promise - Fulfillment value is a raw data object
     */
    var getAccountsByOwner = function (ownerId) {
        var promise = accountData.getAccountsByOwner(ownerId)
        .then(function(accounts) {
            var ownedAccounts = [];
            for (var i = 0; i < accounts.length; i++) {
                var accountEntity = new Account(
                    accounts[i].party_id,
                    accounts[i].party_type_id,
                    accounts[i].preferred_currency_uom_id,
                    accounts[i].description,
                    accounts[i].status_id,
                    accounts[i].created_by,
                    accounts[i].created_date,
                    accounts[i].updated_date,
                    accounts[i].organization_name,
                    accounts[i].office_site_name,
                    accounts[i].annual_revenue,
                    accounts[i].num_employees,
                    accounts[i].ticker_symbol,
                    accounts[i].comments,
                    accounts[i].logo_image_url,
                    accounts[i].party_parent_id,
                    accounts[i].industry_enum_id,
                    accounts[i].ownership_enum_id,
                    accounts[i].important_note,
                    accounts[i].primary_postal_address_id,
                    accounts[i].primary_telecom_number_id,
                    accounts[i].primary_email_id
                );
                ownedAccounts.push(accountEntity);
            }
        })
        promise.catch(function(error) {
            // Log the error
            winston.error(error);
        });
        return promise;
    };
    /**
     * Gets one account by its associated phone number from database
     * @param {Number} phoneNumber - Unique phone number associated with the account to be fetched
     * @return {Object} promise - Fulfillment value is a raw data object
     */

    var getAccountByPhoneNumber = function (phoneNumberId, userSecurityPerm) {
        var promise = accountData.getAccountByPhoneNumber(phoneNumberId);
        Account.find(phoneNumberId, function (err, accounts) {
                if (err) {
                    console.log('Account phoneNumber did not find' + err);
                } 
                // ERIC, I COMMENTED THIS ELSE IF BLOCK OUT DUE TO req NOT DEFINED,
                // TRYING TO GET THE APP TO NOT CRASH, NOT SURE IF THIS IS DOING IT 
                //else if (accounts) {
                //    req.account = accounts;
                //}

            })
            .then(function (accounts) {
                // Map the retrieved result set to corresponding entity
                var accountEntity = new Account(
                    accounts[0].party_id,
                    accounts[0].organization_name,
                    accounts[0].office_site_name,
                    accounts[0].annual_revenue,
                    accounts[0].num_employees,
                    accounts[0].ticker_symbol,
                    accounts[0].comments,
                    accounts[0].logo_image_url,
                    accounts[0].created_date,
                    accounts[0].updated_date
                );
                return accountEntity;
            });
        promise.catch(function (error) {
            // Log the error
            winston.error(error);
        });
        return promise;
    };
    /**
     * Gets one account by <SOME ACCOUNT ATTRIBUTE OR COMBINATION OF ATTRIBUTES> from database
     * @param {String????? Multi-property JSON Object???} identity - The identity/identities of the account to be retrieved
     * @return {Object} promise - Fulfillment value is a raw data object
     */
    
    var getAccountsByIdentity = function (identityId, userSecurityPerm) {
        var promise = accountData.getAccountsByIdentity(identityId);
        Account.find(identityId, function (err, accounts) {
                if (err) {
                    console.log('Account Identity did not find' + err);
                } 
                // ERIC, I COMMENTED THIS ELSE IF BLOCK OUT DUE TO req NOT DEFINED,
                // TRYING TO GET THE APP TO NOT CRASH, NOT SURE IF THIS IS DOING IT 
                //else if (accounts) {
                //   req.accounts = accounts;
                //}

            })
            .then(function (accounts) {
                var identityAccounts = [];
                for (var i = 0; i < accounts.length; i++) {
                    var accountEntity = new Account(
                        accounts[i].party_id,
                        accounts[i].organization_name,
                        accounts[i].office_site_name,
                        accounts[i].annual_revenue,
                        accounts[i].num_employees,
                        accounts[i].ticker_symbol,
                        accounts[i].comments,
                        accounts[i].logo_image_url,
                        accounts[i].created_date,
                        accounts[i].updated_date
                    );
                    identityAccounts.push(accountEntity);   // ERIC, I EDITED THIS TO SEE IF
                                                            // WAS CAUSING APP CRASH
                }
                promise.catch(function (error) {
                    // Log the error
                    winston.error(error);
                });
                return identityAccounts;
            });
    };

    /**
     * Gets one account by its owner
     * @param {Number} ownerId - Unique id of the account to be fetched
     * @return {Object} promise - Fulfillment value is a account entity
     */
    var getAccountByOwner = function (ownerId) {
        var promise = accountData.getAccountByOwner(ownerId)
            .then(function (accounts) {
                // Map the retrieved result set to corresponding entity
                var accountEntity = new Account(
                        accounts[0].party_id,
                        accounts[0].party_type_id,
                        accounts[0].preferred_currency_uom_id,
                        accounts[0].description,
                        accounts[0].status_id,
                        accounts[0].created_by,
                        accounts[0].created_date,
                        accounts[0].updated_date,
                        accounts[0].organization_name,
                        accounts[0].office_site_name,
                        accounts[0].annual_revenue,
                        accounts[0].num_employees,
                        accounts[0].ticker_symbol,
                        accounts[0].comments,
                        accounts[0].logo_image_url,
                        accounts[0].party_parent_id,
                        accounts[0].industry_enum_id,
                        accounts[0].ownership_enum_id,
                        accounts[0].important_note,
                        accounts[0].primary_postal_address_id,
                        accounts[0].primary_telecom_number_id,
                        accounts[0].primary_email_id
                );
                return accountEntity;
            });
        promise.catch(function (error) {
            // Log the error
            winston.error(error);
        });
        return promise;
    };
    /**
     * Update a account in database
     * @param {Number} partyId - Unique id of the account to be updated
     * @param {Object} account - The object that contains updated data
     * @return {Object} promise - Fulfillment value is number of rows updated
     */
    var updateAccount = function (partyId, account) {
        // Convert the received object into an entity
        var accountEntity = new Account(
            partyId,
            account.orgName,
            account.officeSiteName,
            account.annualRevenue,
            account.numEmployees,
            account.tickerSymbol,
            account.comments,
            account.logoImgURL,
            null, (new Date()).toISOString()
        );
        // Validate the data before going ahead
        var validationErrors = accountEntity.validateForUpdate();
        if (validationErrors.length === 0) {
            // Pass on the entity to be added to the data layer
            var promise = accountData.updateAccount(accountEntity)
                .then(function (partyId) {
                    return partyId;
                });
            promise.catch(function (error) {
                winston.error(error);
            });
            return promise;
        } else {
            return null;
        }
    };

    /**
     * Delete a Account
     * @param {Number} partyId - Unique id of the account to be deleted
     * @return {Object} promise - Fulfillment value is number of rows deleted
     */
    var deleteAccount = function (partyId) {
        var promise = accountData.deleteAccount(partyId)
            .then(function (result) {
                return result;
            });
        promise.catch(function (error) {
            // Log the error
            winston.error(error);
        });
        return promise;
    };

    return {
        addAccount: addAccount,
        getAccounts: getAccounts,
        getAccountById: getAccountById,
        updateAccount: updateAccount,
        deleteAccount: deleteAccount
    };
};

module.exports = accountController;
