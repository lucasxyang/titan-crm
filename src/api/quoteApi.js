/////////////////////////////////////////////////
// RESTful API module for quotes.
//
// @file:    quoteApi.js
// @authors: Dinesh Shenoy <astroshenoy@gmail.com>
/////////////////////////////////////////////////

/* jshint shadow:true */

var quoteApi = function (knex) {
    // Get a reference to data layer module
    //
    var quoteController = require('../controllers/quoteController')(knex);

    // API methods
    // ==========================================
    //
    // POST /api/quotes
    // 
    // Methods:  addQuote, addQuoteNote
    //
    var addQuote = function (req, res) {

        // POST /api/quotes
        // 
        // addQuote:  the default if no property for adding a note
        if (Object.keys(req.query).length === 0) {

            // NEXT THREE LINES ARE PURELY PLACEHOLDER, REPLACE WITH YOUR CODE
            res.json({
                'message': 'addQuote functionality is under construction...',
                'reachedOn': 'This was reached on POST route /api/quotes'
            });
        }

        // POST /api/quotes?note
        // 
        // addQuoteNote 
        else if (req.query.hasOwnProperty('note')) {

            // NEXT THREE LINES ARE PURELY PLACEHOLDER, REPLACE WITH YOUR CODE
            res.json({
                'message': 'addQuoteNote functionality is under construction...',
                'reachedOn': 'This was reached on POST route /api/quotes?note'
            });
        }

        // no other POST routes, return error message so the app does not hang
        else {
            res.json({
                'message': 'ERROR:  No such route to POST to...',
            });
        }
    };

    // PUT /api/quotes/
    // 
    // Methods:  updateQuote, updateQuoteItem
    //
    var updateQuote = function (req, res) {

        // PUT /api/quotes
        // 
        // updateQuote:  the default if req has no property for updating an item
        if (Object.keys(req.query).length === 0) {


            // VERY TEMPORARY CALL TO CONTROLLER JUST TO CONFIRM NEW SECURITY GROUP PERMISSION
            // IS BEING CHECK FOR THIS USER-- REWRITE THIS FUNCTION CALL SOON!  I WILL NO
            var resultsForUser = quoteController.updateQuote(req.user);
            
            if (resultsForUser === null) {
                res.json({
                    'message': 'You do not have permission to PUT to /api/quotes'
                });
            } else {
                // TEMPORARY MESSAGE ONLY FOR SECURITY CHECKING, ULTIMATELY REPLACE WITH
                // .then ON THE RETURNED PROMISE, AS IN OTHER MODULES' APIs
                res.json({
                    'message': 'Congratulations, you have permission to PUT to /api/quotes'
                });
            }
        }

        // PUT /api/quotes?item
        // 
        // updateQuoteItem
        else if (req.query.hasOwnProperty('item')) {

            // NEXT THREE LINES ARE PURELY PLACEHOLDER, REPLACE WITH YOUR CODE
            res.json({
                'message': 'updateQuoteItem functionality is under construction...',
                'reachedOn': 'This was reached on PUT route /api/quotes?item'
            });
        }

        // no other PUT routes, return error message so the app does not hang
        else {
            res.json({
                'message': 'ERROR:  No such route to PUT to...'
            });
        }
    };

    // GET /api/quotes
    // 
    // Methods:  getQuotesByOwner, findQuotes
    //
    var getQuotes = function (req, res) {

        // GET /api/quotes
        // 
        // getQuotesByOwner:  The default if req has no property for findQuotes by SOME_PROPERTY
        //
        if (Object.keys(req.query).length === 0) {

            // NEXT THREE LINES ARE PURELY PLACEHOLDER, REPLACE WITH YOUR CODE
            res.json({
                'message': 'getQuotesByOwner functionality is under construction...',
                'reachedOn': 'This was reached on GET route /api/quotes'
            });
        }

        // GET /api/quotes?SOME_PROPERTY
        // 
        // findQuotes
        else if (req.query.hasOwnProperty('SOME_PROPERTY')) {

            // NEXT THREE LINES ARE PURELY PLACEHOLDER, REPLACE WITH YOUR CODE
            res.json({
                'message': 'findQuotes functionality is under construction...',
                'reachedOn': 'This was reached on GET route /api/quotes?SOME_PROPERTY'
            });
        }

        // no other GET routes, return error message so the app does not hang
        else {
            res.json({
                'message': 'ERROR:  No such route to GET from...',
            });
        }
    };

    // GET /api/quotes/:id
    var getQuoteById = function (req, res) {

        // NEXT THREE LINES ARE PURELY PLACEHOLDER, REPLACE WITH YOUR CODE
        res.json({
            'message': 'getQuotesById functionality is under construction...'
        });
    };

    return {
        addQuote: addQuote,
        updateQuote: updateQuote,
        getQuotes: getQuotes,
        getQuoteById: getQuoteById
    };
};

module.exports = quoteApi;
