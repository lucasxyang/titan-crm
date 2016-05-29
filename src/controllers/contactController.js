/////////////////////////////////////////////////
// Business logic module for contacts.
//
// @file:    contactController.js
// @authors: William T. Berg <william.thomas.berg@gmail.com>
/////////////////////////////////////////////////

/* jshint camelcase: false */
/* jshint maxcomplexity: false */
/* jshint shadow:true */

var winston = require('winston');
var Contact = require('../entities/contact');
var User = require('../entities/user');
var ContactMechController = require('../controllers/contactMechController');
var ContactMech = require('../entities/contactMech');
var _ = require('lodash');

var contactController = function (knex) {
    // Get a reference to data layer module
    //
    var contactData = require('../data/contactData')(knex);
    var contactMechData = require('../data/contactMechData')(knex);

    // CONTROLLER METHODS
    // ==========================================
    //

    /**
     * Add a new contact  
     * @param {Object} contact - The new contact to be added
     * @param {Object} user - The logged in user
     * @return {Object} promise - Fulfillment value is id of new contact
     */
    var addContact = function (contact, user) {

        // Check user's security permission to add contacts:  At least one of this user's 
        // user_login_security_group.permission_group_id entries (group permissions)
        // must include 'CRMSFA_CONTACT_CREATE'.  To determine which of the 17 possible groups
        // have this permission, you can query the db:
        // SELECT * FROM security_group_permission WHERE permission_id LIKE "%CONTACT_CREATE%"
        var hasPermission = _.indexOf(user.securityPermissions, 'CRMSFA_CONTACT_CREATE');

        if (hasPermission !== -1) {
            var now = (new Date()).toISOString();
            // Convert the received objects into entities (protect the data layer)
            //
            // Contact mechanisms
            var contactMechEntities = [];
            if (contact.emailAddress) {
                var emailContactMech = new ContactMech(
                    null,
                    'EMAIL_ADDRESS',
                    contact.emailAddress,
                    now,
                    now
                );
                contactMechEntities.push(emailContactMech);
            }
            if (contact.webAddress) {
                var webContactMech = new ContactMech(
                    null,
                    'WEB_ADDRESS',
                    contact.webAddress,
                    now,
                    now
                );
                contactMechEntities.push(webContactMech);
            }
            if (contact.contactNumber) {
                var phoneContactMech = new ContactMech(
                    null,
                    'TELECOM_NUMBER',
                    null,
                    now,
                    now,
                    contact.countryCode,
                    contact.areaCode,
                    contact.contactNumber,
                    contact.askForName
                );
                contactMechEntities.push(phoneContactMech);
            }
            if (contact.countryGeoId) {
                var addressContactMech = new ContactMech(
                    null,
                    'POSTAL_ADDRESS',
                    null,
                    now,
                    now,
                    null,
                    null,
                    null,
                    null,
                    contact.toName,
                    contact.attnName,
                    contact.address1,
                    contact.address2,
                    contact.directions,
                    contact.city,
                    contact.zipOrPostalCode,
                    contact.stateProvinceGeoId,
                    contact.countryGeoId
                );
                contactMechEntities.push(addressContactMech);
            }

            // Contact entity
            var contactEntity = new Contact(
                null,
                contact.partyTypeId,
                contact.preferredCurrencyUomId,
                contact.description,
                contact.statusId,
                user.userId,
                now,
                now,
                contact.salutation,
                contact.firstName,
                contact.middleName,
                contact.lastName,
                contact.birthDate,
                contact.comments
            );


            // Validate the contact and user data before going ahead
            var validationErrors = [];
            var contactValidationErrors = contactEntity.validateForInsert();
            //Errors are non-empty validation results
            for (var i = 0; i < contactValidationErrors.length; i++) {
                if (contactValidationErrors[i]) {
                    validationErrors.push(contactValidationErrors[i]);
                }
            }

            if (validationErrors.length === 0) {
                // Pass on the entities with info to be added to the data layer
                var promise = contactData.addContact(contactEntity, user)
                    .then(function (partyId) {
                        var addContactMechPromises = [];
                        for (var i = 0; i < contactMechEntities.length; i++) {
                            addContactMechPromises.push(
                                ContactMechController.addContactMech(addContactMechPromises[i])
                            );
                                
                        }
                        addContactMechCallback(addContactMechPromises, partyId);
                        return partyId;
                    });
                promise.catch(function (error) {
                    winston.error(error);
                });
                return promise;
            } else {
                return validationErrors;
            }
        } else {
            // user does not have permissions of a contact owner, return null
            return null;
        }
    };
    
    var addContactMechCallback = function(addContactMechPromises, partyId) {
        if (addContactMechPromises.length > 0) {
            var promise = addContactMechPromises.pop();
            promise.then(function(contactMechId) {
                return ContactMechController.linkContactMechToParty(partyId, contactMechId)
                .then(function() {
                    return addContactMechCallback(partyId);
                });
            });
        }
        else {
            return partyId;
        }
    };

    /**
     * Gets one contact by its id
     * @param {Number} contactId - Unique id of the contact to be fetched
     * @return {Object} promise - Fulfillment value is a contact entity
     */
    var getContactById = function (contactId) {
        var promise = contactData.getContactById(contactId)
            .then(function (contacts) {
                var contactEntity;
                if (contacts.length > 0) {
                    // Map the retrieved result set to corresponding entity
                    contactEntity = new Contact(
                        contacts[0].party_id,
                        contacts[0].party_type_id,
                        contacts[0].currency_uom_id,
                        contacts[0].description,
                        contacts[0].status_id,
                        contacts[0].created_by,
                        contacts[0].created_date,
                        contacts[0].updated_date,
                        contacts[0].salutation,
                        contacts[0].first_name,
                        contacts[0].middle_name,
                        contacts[0].last_name,
                        contacts[0].birth_date,
                        contacts[0].comments
                    );
                } else {
                    contactEntity = new Contact();
                }
                return contactEntity;
            });
        promise.catch(function (error) {
            // Log the error
            winston.error(error);
        });
        return promise;
    };

    /**
     * Gets contacts owned by the user/owner
     * @return {Object} promise - Fulfillment value is an array of contact entities
     */
    var getContactsByOwner = function (user) {
        // Check user's security permission to own contacts
        var hasPermission = _.indexOf(user.securityPermissions, 'CRMSFA_CONTACT_CREATE');
        if (hasPermission !== -1) {
            // user has permission, proceed to the data layer
            var promise = contactData.getContactsByOwner(user.partyId)
                .then(function (contacts) {
                    // Map the retrieved result set to corresponding entities
                    var contactEntities = [];
                    for (var i = 0; i < contacts.length; i++) {
                        var contact = new Contact(
                            contacts[i].party_id,
                            contacts[i].party_type_id,
                            contacts[i].currency_uom_id,
                            contacts[i].description,
                            contacts[i].status_id,
                            contacts[i].created_by,
                            contacts[i].created_date,
                            contacts[i].updated_date,
                            contacts[i].salutation,
                            contacts[i].first_name,
                            contacts[i].middle_name,
                            contacts[i].last_name,
                            contacts[i].birth_date,
                            contacts[i].comments
                        );
                        contactEntities.push(contact);
                    }
                    return contactEntities;
                });
            promise.catch(function (error) {
                // Log the error
                winston.error(error);
            });
            return promise;
        } else {
            // user does not have permissions of a contact owner, return null
            return null;
        }
    };

    /** 
     * Gets contacts by identity (see opentaps' Find Contact feature)
     * @param {String} firstName - portion of a first name to search for
     * @param {String} firstName - portion of a last name to search for
     * @return {Object} promise - Fulfillment value is an array of contact entities
     */
    var getContactsByIdentity = function (query, user) {
        // Check security permissions of user against accepted permissions for this function
        var hasPermission = _.indexOf(user.securityPermissions, 'CRMSFA_CONTACT_CREATE');
        if (hasPermission !== -1) {
            // user has permission, proceed to the data layer
            var promise = contactData.getContactsByIdentity(query.firstName, query.lastName)
                .then(function (contacts) {

                    // Map the retrieved result set to corresponding entities
                    var contactEntities = [];
                    for (var i = 0; i < contacts.length; i++) {
                        var contact = new Contact(
                            contacts[i].party_id,
                            contacts[i].party_type_id,
                            contacts[i].currency_uom_id,
                            contacts[i].description,
                            contacts[i].status_id,
                            contacts[i].created_by,
                            contacts[i].created_date,
                            contacts[i].updated_date,
                            contacts[i].salutation,
                            contacts[i].first_name,
                            contacts[i].middle_name,
                            contacts[i].last_name,
                            contacts[i].birth_date,
                            contacts[i].comments
                        );
                        contactEntities.push(contact);
                    }
                    return contactEntities;
                });
            promise.catch(function (error) {
                // Log the error
                winston.error(error);
            });
            return promise;
        } else {
            // user does not have permissions of a contact owner, return null
            return null;
        }
    };

    /**
     * Update a contact in database
     * @param {Number} contactId - Unique id of the contact to be updated
     * @param {Object} contact - The object that contains updated data
     * @return {Object} promise - Fulfillment value is number of rows updated
     */
    var updateContact = function (contactId, contact) {
        //Convert contact to entity
        var contactEntity = new Contact(
            contactId,
            contact.partyTypeId,
            contact.preferredCurrencyUomId,
            contact.description,
            contact.statusId,
            contact.createdBy,
            contact.createdDate,
            contact.updatedDate,
            contact.salutation,
            contact.firstName,
            contact.middleName,
            contact.lastName,
            contact.birthDate,
            contact.comments,
            contact.countryCode
        );

        var validationErrors = contactEntity.validateForUpdate();
        if (validationErrors.length === 0) {
            // Pass on the entity to be added to the data layer
            var promise = contactData.updateContact(contact)
                .then(function (numRows) {
                    return numRows;
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
     * Delete a contact
     * @param {Number} contactId - Unique id of the contact to be deleted
     * @return {Object} promise - Fulfillment value is number of rows deleted
     */
    var deleteContact = function (contactId) {
        var promise = contactData.deleteContact(contactId)
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
        getContactById: getContactById,
        getContactsByOwner: getContactsByOwner,
        getContactsByIdentity: getContactsByIdentity,
        addContact: addContact,
        updateContact: updateContact,
        deleteContact: deleteContact
    };
};

module.exports = contactController;
