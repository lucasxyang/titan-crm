/////////////////////////////////////////////////
// Jasmine spec (test suite) for Contact APIs.
//
// @file:   contactApiSpec.js
// @author: Dinesh Shenoy <astroshenoy@gmail.com>
/////////////////////////////////////////////////

var request = require('request');
var apiBaseUrl = 'http://localhost:5000/api/contacts';
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsInBhc3N3b3JkIjoiJDJhJDEwJEExUVFja2dRL2hoZnZ4V1RUM3Z4bHV1WlEvRWVweUY1NzBlQnh4SDd4ZDNxT0NwbWpHU2JDIiwicGFzc3dvcmRIaW50IjpudWxsLCJlbmFibGVkIjoxLCJkaXNhYmxlZERhdGUiOm51bGwsInBhcnR5SWQiOjIsImNyZWF0ZWREYXRlIjoiMjAxNi0wNS0xM1QwNjoxNjozNS4wMDBaIiwidXBkYXRlZERhdGUiOiIyMDE2LTA1LTEzVDA2OjE2OjM1LjAwMFoiLCJpYXQiOjE0NjM3Nzk3MDgsImV4cCI6MTQ5NTMxNTcwOH0.ZT9kcx1WiMxfsftVIxbvIn_1Mt5nYKAvl-duY7Vd7qM'; // token for "admin" user account, expires May 19, 2017
var baseRequest = request.defaults({
    headers: {
        'x-access-token': token
    }
});

describe('Contact API', function () {
    it('is inaccessible without a valid token', function (done) {
        request.get(apiBaseUrl, function (err, res, body) {
            // Check the HTTP status code of response
            expect(res.statusCode).toBe(403);
            // Call done to finish the async function
            done();
        });
    });
    it('getContacts returns all contacts in system as an array', function (done) {
        baseRequest.get(apiBaseUrl, function (err, res, body) {
            var typeofContacts = Object.prototype.toString.call(JSON.parse(body));
            // Check whether the return value is an array
            expect(typeofContacts).toBe('[object Array]');
            // Call done to finish the async function
            done();
        });
    });
    it('getContact returns a valid contact entity', function (done) {
        baseRequest.get(apiBaseUrl + '/2', function (err, res, body) {
            expect(JSON.parse(body).hasOwnProperty('partyId')).toBeTruthy();
            // Call done to finish the async function
            done();
        });
    });
    it('addContact adds a contact and returns a single party id', function (done) {
        var newContact = {
            partyTypeId: 'PERSON',
            preferredCurrencyUomId: 'USD',
            description: '',
            statusId: 'PARTY_ENABLED'
        };
        baseRequest.post(apiBaseUrl, { form: newContact }, function (err, res, body) {
            var result = JSON.parse(body);
            // Check whether return value is a partyId
            expect(result.hasOwnProperty('partyId')).toBeTruthy();
            // Check whether a single party id is returned
            expect(result.partyId.length).toBe(1);
            // Call done to finish the async function
            done();
        });
    });
});