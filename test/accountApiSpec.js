/////////////////////////////////////////////////
// Jasmine spec (test suite) for Accounts APIs.
//
// @file:   accountApiSpec.js
// @author: Eric Brichetto <brichett13@gmail.com>
//          DukJin Ahn <ahnxx089@gmail.com>
/////////////////////////////////////////////////

/*

var request = require('request');
var apiBaseUrl = 'http://localhost:5000/api/account';
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbiIsInBhc3N3b3JkIjoiJDJhJDEwJEExUVFja2dRL2hoZnZ4V1RUM3Z4bHV1WlEvRWVweUY1NzBlQnh4SDd4ZDNxT0NwbWpHU2JDIiwicGFzc3dvcmRIaW50IjpudWxsLCJlbmFibGVkIjoxLCJkaXNhYmxlZERhdGUiOm51bGwsInBhcnR5SWQiOjIsImNyZWF0ZWREYXRlIjoiMjAxNi0wNS0xM1QwNjoxNjozNS4wMDBaIiwidXBkYXRlZERhdGUiOiIyMDE2LTA1LTEzVDA2OjE2OjM1LjAwMFoiLCJpYXQiOjE0NjM3Nzk3MDgsImV4cCI6MTQ5NTMxNTcwOH0.ZT9kcx1WiMxfsftVIxbvIn_1Mt5nYKAvl-duY7Vd7qM'; // token for "admin" user account, expires May 19, 2017
var baseRequest = request.defaults({
    headers: {
        'x-access-token': token
    }
});
*/


describe('Accounts API', function () {
    xit('is inaccessible without a valid token', function (done) {
        request.get(apiBaseUrl, function (err, res, body) {
            // Check the HTTP status code of response
            expect(res.statusCode).toBe(403);
            // Call done to finish the async function
            done();
        });
    });
    xit('getAccount returns all Accounts in system as an array', function (done) {
        baseRequest.get(apiBaseUrl, function (err, res, body) {
            var typeofAccounts = Object.prototype.toString.call(JSON.parse(body));
            // Check whether the return value is an array
            expect(typeofAccounts).toBe('[object Array]');
            // Call done to finish the async function
            done();
        });
    });
    xit('getAccount returns a valid Accounts entity', function (done) {
        baseRequest.get(apiBaseUrl + '/2', function (err, res, body) {
            expect(JSON.parse(body).hasOwnProperty('partyId')).toBeTruthy();
            // Call done to finish the async function
            done();
        });
    });
    
});