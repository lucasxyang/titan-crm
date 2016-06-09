/////////////////////////////////////////////////
// Business logic module for contacts.
//
// @file:    contactController.js
// @authors: Dinesh Shenoy <astroshenoy@gmail.com>
/////////////////////////////////////////////////

/* jshint camelcase: false */
/* jshint maxcomplexity: false */
/* jshint shadow:true */

var winston = require('winston');
var Quote = require('../entities/quote');
var QuoteItem = require('../entities/quoteItem');
var QuoteItemOption = require('../entities/quoteItemOption');
var _ = require('lodash');

var quoteController = function (knex) {
    // Get a reference to data layer module
    //
    var quoteData = require('../data/quoteData')(knex);

    // CONTROLLER METHODS
    // ==========================================
    //

    /**
     * Add a new quote  
     * @param {Object} quote - The new quote to be added
     * @param {Object} user - The logged in user
     * @return {Object} promise - Fulfillment value is id of new contact
     */
    var addQuote = function (quote, user) {
        // NOTE TO DUKJIN: should the premission be CRMSFA_QUOTE_CREATE?
        var hasPermission = _.indexOf(user.securityPermissions, 'CRMSFA_CASE_CREATE');
        if (hasPermission !== -1) {
            var now = (new Date()).toISOString();

            var quoteEntity = new Quote(
                null,
                quote.quoteTypeId,
                quote.partyId,
                quote.issueDate,
                quote.statusId,
                quote.currencyUomId,
                quote.salesChannelEnumId,
                quote.validFromDate,
                quote.validThruDate,
                quote.quoteName,
                quote.description,
                quote.contactPartyId,
                quote.createdByPartyId,
                now,
                now
            );

            // Validate the quoteItem data before going ahead
            var validationErrors = [];
            var quoteValidationErrors = quoteEntity.validateForInsert();
            for (var i = 0; i < quoteValidationErrors.length; i++) {
                if (quoteValidationErrors[i]) {
                    validationErrors.push(quoteValidationErrors[i]);
                }
            }
            if (validationErrors.length === 0) {
                // Pass on the entity to be added to the data layer
                var promise = quoteData.addQuote(quote)
                    .then(function (quoteId) {
                        return quoteData.addQuoteRole(quoteId);
                    });
                promise.catch(function (error) {
                    winston.error(error);
                });

                return promise;
            } else {
                return validationErrors;
            }
        } else {
            // user does not have permissions to add a quote, return null
            return null;
        }
    };

    /**
     * Add a new item to a quote
     * @param {Object} quoteItem - entity containing item to add onto a quote
     * @param {Object} user - The logged in user
     * @return {Object} promise - Fulfillment value is number of rows updated
     */
    var addQuoteItem = function (quoteItem, user) {

        // Check user's security permission to own contacts
        var hasPermission = _.indexOf(user.securityPermissions, 'CRMSFA_QUOTE_CREATE');
        if (hasPermission !== -1) {
            // proceed towards data layer
            var now = (new Date()).toISOString();

            // QuoteItem entity
            var quoteItemEntity = new QuoteItem(
                quoteItem.quoteId,
                quoteItem.quoteItemSeqId,
                quoteItem.productId,
                quoteItem.quantity,
                quoteItem.selectedAmount,
                quoteItem.quoteUnitPrice,
                quoteItem.estimatedDeliveryDate,
                quoteItem.comments,
                quoteItem.isPromo,
                quoteItem.description,
                now,
                now
            );

            // Validate the quoteItem data before going ahead
            var validationErrors = [];
            var quoteItemValidationErrors = quoteItemEntity.validateForInsert();
            //Errors are non-empty validation results
            for (var i = 0; i < quoteItemValidationErrors.length; i++) {
                if (quoteItemValidationErrors[i]) {
                    validationErrors.push(quoteItemValidationErrors[i]);
                }
            }
            if (validationErrors.length === 0) {
                // Pass on the entity to be added to the data layer
                var promise = quoteData.addQuoteItem(quoteItemEntity)
                    .then(function (quoteItemInserted) {
                        return quoteItemInserted;
                    });
                promise.catch(function (error) {
                    winston.error(error);
                });
                return promise;
            } else {
                return validationErrors;
            }
        } else {
            // user does not have permissions to add a quote, return null
            return null;
        }
    };

    /**
     * Add a new option to an item of a quote
     * @param {Object} quoteItemOption - entity containing option to add to an item of a quote
     * @param {Object} user - The logged in user
     * @return {Object} promise - Fulfillment value is number of rows updated
     */
    var addQuoteItemOption = function(quoteItemOption, user) {
        // Check user's security permission to own contacts
        var hasPermission = _.indexOf(user.securityPermissions, 'CRMSFA_QUOTE_CREATE');
        if (hasPermission !== -1) {
            // proceed towards data layer
            var now = (new Date()).toISOString();

            // QuoteItem entity
            var quoteItemOptionEntity = new QuoteItemOption(
                quoteItemOption.quoteId,
                quoteItemOption.quoteItemSeqId,
                quoteItemOption.quoteItemOptionSeqId,
                quoteItemOption.quantity,
                quoteItemOption.quoteUnitPrice,
                now,
                now
            );

            // Validate the quoteItem data before going ahead
            var validationErrors = [];
            var quoteItemValidationErrors = quoteItemOptionEntity.validateForInsert();
            //Errors are non-empty validation results
            for (var i = 0; i < quoteItemValidationErrors.length; i++) {
                if (quoteItemValidationErrors[i]) {
                    validationErrors.push(quoteItemValidationErrors[i]);
                }
            }
            if (validationErrors.length === 0) {
                // Pass on the entity to be added to the data layer
                var promise = quoteData.addQuoteItemOption(quoteItemOptionEntity)
                    .then(function (quoteItemInserted) {
                        return quoteItemInserted;
                    });
                promise.catch(function (error) {
                    winston.error(error);
                });
                return promise;
            } else {
                return validationErrors;
            }
        } else {
            // user does not have permissions to add a quote, return null
            return null;
        }
    };
    
    /**
     * Update a quote in database (equiv to Opentaps' Edit Quote & Accept/Send/Finalize/Reject/Cancel)
     * @param {Number} quoteId - Unique quote_id of the quote to update
     * @param {Object} quote - The object that contains the item to update quote with
     * @param {Object} user - The logged in user
     * @return {Object} promise - Fulfillment value is number of rows updated
     */
    var updateQuote = function (quoteId, quote, user) {

        // Check user's security permission to own contacts
        var hasPermission = _.indexOf(user.securityPermissions, 'CRMSFA_QUOTE_CREATE');
        if (hasPermission !== -1) {
            // proceed towards data layer
            var now = (new Date()).toISOString();

            // build Quote Entity.  (Reminder to self on how created_by column will not
            // be affected:  UI will be filling quote.createdDate with the value that this
            // quote already has.  Only updated_date column is receiving new value called "now")
            var quoteEntity = new Quote(
                quoteId,
                quote.quoteTypeId,
                quote.partyId,
                quote.issueDate,
                quote.statusId,
                quote.currencyUomId,
                quote.salesChannelEnumId,
                quote.validFromDate,
                quote.validThruDate,
                quote.quoteName,
                quote.description,
                quote.contactPartyId,
                quote.createdByPartyId,
                quote.createdDate,
                now
            );

            // Validate the quoteItem data before going ahead
            var validationErrors = [];
            var quoteValidationErrors = quoteEntity.validateForUpdate();
            //Errors are non-empty validation results
            for (var i = 0; i < quoteValidationErrors.length; i++) {
                if (quoteValidationErrors[i]) {
                    validationErrors.push(quoteValidationErrors[i]);
                }
            }
            if (validationErrors.length === 0) {
                // Pass on the entity to be added to the data layer
                var promise = quoteData.updateQuote(quoteEntity)
                    .then(function (quoteUpdated) {
                        return quoteUpdated;
                    });
                promise.catch(function (error) {
                    winston.error(error);
                });
                return promise;
            } else {
                return validationErrors;
            }
        } else {
            // user does not have permissions to add a quote, return null
            return null;
        }
    };
    
    /**
     * Update an item of a quote 
     * @param {Object} quoteItem - entity containing info of item to be updated
     * @param {Object} user - The logged in user
     * @return {Object} promise - Fulfillment value is number of rows updated
     */
    var updateQuoteItem = function (quoteItem, user) {
        
        // Check user's security permission to own contacts
        var hasPermission = _.indexOf(user.securityPermissions, 'CRMSFA_QUOTE_CREATE');
        if (hasPermission !== -1) {
            // proceed towards data layer
            var now = (new Date()).toISOString();

            // QuoteItem entity
            var quoteItemEntity = new QuoteItem(
                quoteItem.quoteId,
                quoteItem.quoteItemSeqId,
                quoteItem.productId,
                quoteItem.quantity,
                quoteItem.selectedAmount,
                quoteItem.quoteUnitPrice,
                quoteItem.estimatedDeliveryDate,
                quoteItem.comments,
                quoteItem.isPromo,
                quoteItem.description,
                quoteItem.createdDate,
                now
            );

            // Validate the quoteItem data before going ahead
            var validationErrors = [];
            var quoteItemValidationErrors = quoteItemEntity.validateForUpdate();
            //Errors are non-empty validation results
            for (var i = 0; i < quoteItemValidationErrors.length; i++) {
                if (quoteItemValidationErrors[i]) {
                    validationErrors.push(quoteItemValidationErrors[i]);
                }
            }
            if (validationErrors.length === 0) {
                // Pass on the entity to be added to the data layer
                var promise = quoteData.updateQuoteItem(quoteItemEntity)
                    .then(function (quoteItemUpdated) {
                        return quoteItemUpdated;
                    });
                promise.catch(function (error) {
                    winston.error(error);
                });
                return promise;
            } else {
                return validationErrors;
            }
        } else {
            // user does not have permissions to add a quote, return null
            return null;
        }
    };

    /**
     * Update an option of an item of a quote 
     * @param {Object} quoteItemOption - entity containing info of option of item to be updated
     * @param {Object} user - The logged in user
     * @return {Object} promise - Fulfillment value is number of rows updated
     */
    var updateQuoteItemOption = function (quoteItemOption, user) {
        // Check user's security permission to own contacts
        var hasPermission = _.indexOf(user.securityPermissions, 'CRMSFA_QUOTE_CREATE');
        if (hasPermission !== -1) {
            // proceed towards data layer
            var now = (new Date()).toISOString();

            // QuoteItem entity
            var quoteItemOptionEntity = new QuoteItemOption(
                quoteItemOption.quoteId,
                quoteItemOption.quoteItemSeqId,
                quoteItemOption.quoteItemOptionSeqId,
                quoteItemOption.quantity,
                quoteItemOption.quoteUnitPrice,
                quoteItemOption.createdDate,
                now
            );

            // Validate the quoteItem data before going ahead
            var validationErrors = [];
            var quoteItemValidationErrors = quoteItemOptionEntity.validateForUpdate();
            //Errors are non-empty validation results
            for (var i = 0; i < quoteItemValidationErrors.length; i++) {
                if (quoteItemValidationErrors[i]) {
                    validationErrors.push(quoteItemValidationErrors[i]);
                }
            }
            if (validationErrors.length === 0) {
                // Pass on the entity to be added to the data layer
                var promise = quoteData.updateQuoteItemOption(quoteItemOptionEntity)
                    .then(function (quoteItemOptionUpdated) {
                        return quoteItemOptionUpdated;
                    });
                promise.catch(function (error) {
                    winston.error(error);
                });
                return promise;
            } else {
                return validationErrors;
            }
        } else {
            // user does not have permissions to add a quote, return null
            return null;
        }
    };
    
    /**
     * Add a new quote note
     * @param {Number} quoteId - Unique quote_id of the quote to add a note to
     * @param {String} quoteNote - Note to be added
     * @param {Object} user - The logged in user
     * @return {Object} promise - Fulfillment value is note_id of new note
     */
    var addQuoteNote = function (quoteId, quoteNote, user) {

    };

    /**
     * Gets one quote by its id
     * @param {Number} quoteId - Unique id of the quote to be fetched
     * @param {Object} user - The logged in user
     * @return {Object} promise - Fulfillment value is a quote entity
     */
    var getQuoteById = function (quoteId, user) {

    };

    /**
     * Gets quotes owned by the user/owner
     * @return {Object} promise - Fulfillment value is an array of quote entities
     */
    var getQuotesByOwner = function (user) {
        // Check user's security permission to own quotes
        var hasPermission = _.indexOf(user.securityPermissions, 'CRMSFA_QUOTE_CREATE');
        if (hasPermission !== -1) {
            // user has permission, proceed to the data layer
            var promise = quoteData.getQuotesByOwner(user.partyId)
                .then(function (quotes) {
                    // Map the retrieved result set to corresponding entities
                    var quoteEntities = [];
                    for (var i = 0; i < quotes.length; i++) {
                        var quote = new Quote(
                            quotes[i].quoteId,
                            quotes[i].quoteTypeId,
                            quotes[i].partyId,
                            quotes[i].issueDate,
                            quotes[i].statusId,
                            quotes[i].currencyUomId,
                            quotes[i].salesChannelEnumId,
                            quotes[i].validFromDate,
                            quotes[i].validThruDate,
                            quotes[i].quoteName,
                            quotes[i].description,
                            quotes[i].contactPartyId,
                            quotes[i].createdByPartyId,
                            quotes[i].createdDate,
                            quotes[i].updatedDate
                        );
                        quoteEntities.push(quote);
                    }
                    return quoteEntities;
                });
            promise.catch(function (error) {
                // Log the error
                winston.error(error);
            });
            return promise;
        } else {
            // user does not have permissions of a contact owner, return null
            return;
        }
    };
    
    
    /** 
     * Gets quotes by advanced search
     * @param {String} query - query string: SOME ARGUMENT
     * @param {Object} user - The logged in user
     * @return {Object} promise - Fulfillment value is an array of quote entities
     */
    var getQuotesByAdvanced = function (query, user) {
        //Check security permission of user
        var hasPermission = _.indexOf(user.securityPermissions, 'CRMSFA_QUOTE_CREATE');
        if (hasPermission !== -1) {
            
            // these variables are strings if were set, or object if null
            var quoteId = query.quoteId || null;
            var quoteName = query.quoteName || null;
            var status = query.status || null;
            var account = query.account || null;
            var salesChannel = query.salesChannel || null; 
            
            var promise = quoteData.getQuotesByAdvanced(quoteId, quoteName, status, account, salesChannel)
            .then(function (quotes) {
                var quoteEntities = [];
                for (var i = 0; i < quotes.length; i++) {
                    
                    // quotes[i].quote_id is Number
                    var test1 = quoteId == null ? true : quotes[i].quote_id === +quoteId;
                    
                    
                    // quotes[i].quote_name is varchar(100), and is NULLABLE
                    var emptyString = quoteName == null;
                    var emptyColumn = quotes[i].quote_name == null;
                    // If we search for something, in null columns, then we will never find it
                    var test2 = (!emptyString && emptyColumn) ? false : true;
                    // If we search for something, in some columns, we need to compare
                    // the first attempt is to do complete string match, the second attempt is to do substring match.
                    test2 = (!emptyString && !emptyColumn) ? (quotes[i].quote_name.toUpperCase().indexOf(quoteName.toUpperCase()) > -1) : test2;

                    
                    // quotes[i].status_id is varchar(20), and is NULLABLE
                    // status_id will be shown in a drop-down menu. There is no need to do substring match here. 
                    var emptyString = status == null;
                    var emptyColumn = quotes[i].status_id == null;
//                    console.log(emptyString);
//                    console.log(emptyColumn);
                    // If we search for something, in null columns, then we will never find it
                    var test3 = (!emptyString && emptyColumn) ? false : true;
                    // If we search for something, in some columns, we need to compare
                    test3 = (!emptyString && !emptyColumn) ? quotes[i].status_id.toUpperCase() === status.toUpperCase() : test3;
//                    The line above is same as 
//                    if(!emptyString && !emptyColumn) {
//                        test3 = quotes[i].status_id.toUpperCase() == status.toUpperCase();
//                    }
                    
                    // quotes[i].party_id is Number, and is NULLABLE
                    var test4 = account == null ? true : quotes[i].party_id === +account;
                    
                    // quotes[i].sales_channel_enum_id is varchar(20)
                    // Good column! I love it. 
                    var test5 = salesChannel == null ? true: quotes[i].sales_channel_enum_id.toUpperCase() === salesChannel.toUpperCase();


                    if(test1 && test2 && test3 && test4 && test5) {
                        // build quote from returned columns
                        var quote = new Quote(
                            quotes[i].quote_id,
                            quotes[i].quote_type_id,
                            quotes[i].party_id,
                            quotes[i].issue_date,
                            quotes[i].status_id,
                            quotes[i].currency_uom_id,
                            quotes[i].sales_channel_enum_id,
                            quotes[i].valid_from_date,
                            quotes[i].valid_thru_date,
                            quotes[i].quote_name,
                            quotes[i].description,
                            quotes[i].contact_party_id,
                            quotes[i].created_by_party_id,
                            quotes[i].created_date,
                            quotes[i].updated_date
                        );
                        quoteEntities.push(quote);
                    }
                    else {
                        continue;
                    }
                }
                return quoteEntities;
            });
            promise.catch(function (error) {
                // Log the error
                winston.error(error);
            });
            return promise;
        } else {
            return null;
        }
    };
    return {
        addQuote: addQuote,
        addQuoteItem: addQuoteItem,
        addQuoteItemOption: addQuoteItemOption,
        updateQuote: updateQuote,
        updateQuoteItem: updateQuoteItem,
        updateQuoteItemOption: updateQuoteItemOption,
        addQuoteNote: addQuoteNote,
        getQuoteById: getQuoteById,
        getQuotesByOwner: getQuotesByOwner,
        getQuotesByAdvanced: getQuotesByAdvanced
    };
};

module.exports = quoteController;