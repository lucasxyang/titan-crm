/////////////////////////////////////////////////
// Add Lead form component. Currently loaded in CreateLeadPage.
//
// @file:   AddLeadForm.js
// @author: Xiaosiqi Yang <yang4131@umn.edu>
/////////////////////////////////////////////////

var React = require('react');

var PersonDiv = require('./PersonDiv');
var PartyDiv = require('../../common/PartyDiv');
var PartySupplementalDiv = require('../../common/PartySupplementalDiv');
var AddContactMech = require('../../common/AddContactMech');
var SubmitButton = require('../../common/SubmitButton');

var AddLeadForm = React.createClass({
    
    componentDidMount: function () {
        var thisAddLeadForm = this;
        
        // NOTE: to get bootstrap validator working, this jQuery statement to attach .on('submit',...)
        // must come after the the validations are enabled on the form (down in its children)
        // Therefore it is placed here inside componentDidMount so that the form is rendered first.
        $('#addLeadForm').validator().on('submit', function (e) {
            if (e.isDefaultPrevented()) {
                console.log('Default is Prevented');
                // Handle the invalid form: happens when HTML catches invalid input, such as required, data type.
            } else {
                console.log('Default is not Prevented');
                // Proceed with form submission if all input data is valid
                thisAddLeadForm.props.onFormSubmitBSV(e);
            }
        });
    },
    
    render: function() {
        /* jshint ignore:start */
        return (
            <div>
                <form id="addLeadForm" > 
                    <PersonDiv 
                        lead={ this.props.lead } 
                        onChange={ this.props.onChange } />
                    <PartyDiv 
                        ent={ this.props.lead } 
                        onChange={ this.props.onChange } />   
                    <PartySupplementalDiv 
                        ent={ this.props.lead } 
                        onChange={ this.props.onChange } />     
                    <AddContactMech 
                        contact={ this.props.lead } 
                        onChange={ this.props.onChange } />    
                    <SubmitButton />
                </form>
            </div>
        );
        /* jshint ignore:end */
    }
});

module.exports = AddLeadForm;