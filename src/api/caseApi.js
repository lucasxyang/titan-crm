/////////////////////////////////////////////////
// RESTful API module for cases.
//
// @file:    caseApi.js
// @author: Dinesh Shenoy <astroshenoy@gmail.com>
/////////////////////////////////////////////////

var caseApi = function (knex) {

    // Get a reference to data layer module
    //
    var caseController = require('../controllers/caseController')(knex);

    // API methods
    // ==========================================
    //
    // POST /api/cases
    var addCase = function (req, res) {

    };

    // GET /api/cases
    // 
    // Methods:  there are specific methods for getting Cases on this route /api/cases/ 
    //
    // They are handled in this "meta" function called getCases() with IF ELSE IF blocks that 
    // test whether user entered a query string seeking to get Cases by Owner or by Advanced Search
    // (but not getCaseById, which is on a separate route).
    var getCases = function (req, res) {

        // GET /api/cases?owner
        //
        // getCasesByOwner:  The default if no query string for advanced search
        // 
        if (Object.keys(req.query).length === 0) {
            var resultsForThisUser = caseController.getCasesByOwner(req.user);
            if (resultsForThisUser === null) {
                res.json('You do not have permission to get cases!');
            } else {
                resultsForThisUser.then(function (case_) {
                    res.json(case_);
                });
            }
        }

        // GET /api/cases?<MAYBE A QUERY STRING OF SOME KIND TO TRIGGER ADVANCED SEARCH?>
        //
        // getCasesByAdvancedSearch: 
        //
        /* DUK JIN, THE ELSE IF BLOCK IS COMMENTED OUT FOR NOW, ACTIVATE WHEN YOU ARE READY.
            ELSE IF ensures there is only one response to API layer!
            See: http://www.ofssam.com/forums/showthread.php?tid=43 
            
        else if (  ) {
            
        }
        */
        
        // If the request did not properly pass any of the various if tests
        // above, it is not a valid query, make the reponse null.
        else {
            res.json(null);
        }
    };

    // GET /api/cases/:id
    var getCaseById = function (req, res) {

    };

    // PUT /api/cases/:id
    var updateCase = function (req, res) {

    };

    // DELETE /api/cases/:id
    var deleteCase = function (req, res) {

    };

    return {
        addCase: addCase,
        getCases: getCases,
        getCaseById: getCaseById,
        updateCase: updateCase,
        deleteCase: deleteCase
    };
};

module.exports = caseApi;