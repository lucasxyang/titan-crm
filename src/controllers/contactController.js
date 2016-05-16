/////////////////////////////////////////////////
// Business logic module for contacts.
//
// @file:   contactController.js
// @author: Anurag Bhandari <anurag@ofssam.com>
/////////////////////////////////////////////////

/* jshint camelcase: false */

var winston = require('winston');
var Contact = require('../entities/contact');

var contactController = function(knex) {
    // Get a reference to data layer module
    //
    var contactData = require('../data/contactData')(knex);
    
    
    /* ***THIS SECTION NEEDS WORK:
            1.  Are these the methods we need?
            2.  Do we need more methods?  
            3.  Each method needs code to work. */
    //
    // CONTROLLER METHODS
    // ==========================================
    //
    /**
     * Add a new contact
     * @param {Object} contact - The new contact to be added
     * @return {Object} promise - Fulfillment value is id of new contact
    */
    var addContact = function () {};

    /**
     * Gets all contacts
     * @return {Object} promise - Fulfillment value is an array of contact entities
    */
    var getContacts = function () {};
    
    /**
     * Gets one contact by its id
     * @param {Number} contactId - Unique id of the contact to be fetched
     * @return {Object} promise - Fulfillment value is a contact entity
    */
    var getContactById = function (contactId) {};

    /**
     * Update a contact in database
     * @param {Number} contactId - Unique id of the contact to be updated
     * @param {Object} contact - The object that contains updated data
     * @return {Object} promise - Fulfillment value is number of rows updated
    */
    var updateContact = function (contactId, contact) {};
    
    /**
     * Delete a contact
     * @param {Number} contactId - Unique id of the contact to be deleted
     * @return {Object} promise - Fulfillment value is number of rows deleted
    */
    var deleteContact = function (contactId) {};

    return {
        getContacts: getContacts,
        getContactById: getContactById,
        addContact: addContact,
        updateContact: updateContact,
        deleteContact: deleteContact
    };
};

module.exports = contactController;