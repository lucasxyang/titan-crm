/////////////////////////////////////////////////
// Find Leads page component.
//
// @file:   FindLeadsPage.js
// @author: Xiaosiqi Yang <yang4131@umn.edu>
/////////////////////////////////////////////////

var React = require('react');
var withRouter = require('react-router').withRouter;

var SearchForm = require('./SearchForm');
var LeadRow = require('../my-leads/LeadRow');
var LeadsStore = require('../../../stores/LeadsStore');
var LeadsActions = require('../../../actions/LeadsActions');
var CommonStore = require('../../../stores/CommonStore');
var CommonActions = require('../../../actions/CommonActions');


var FindLeadsPage = React.createClass({

    getInitialState: function() {
        return {
            searchBy: { partyId: '' },
            leadFoundById: []
        };
    },

    componentWillMount: function () {
        CommonStore.addGetTokenValidityListener(this._onGetTokenValidity);
        CommonActions.getTokenValidity();
    },

    componentDidMount: function() {
        LeadsStore.addGetDataListener(this._onGetById);
    },

    componentWillUnmount: function() {
        LeadsStore.removeListener('getData', this._onGetById);
    },


    setSearchByState: function(event) {
        var field = event.target.id;
        var value = event.target.value;
        this.state.searchBy[ field ] = value;
        this.setState( {searchBy: this.state.searchBy} );
    },

    _onGetTokenValidity: function (){
        // if user's token is expired, redirect to login page.
        if ( CommonStore.getTokenMockMessage().tokenExpired === true ){
            this.props.router.replace('/login');
        }
    },

    _resetForm: function(){
        this.setState({
            searchBy: { partyId: '' },
            leadFoundById: []
        });
    },

    // JSX component onFormSubmit version (has [submit] event arg)
    _findLeads: function(event){
        event.preventDefault();
        LeadsActions.getLeadById(this.state.searchBy.partyId); // send out an action
    },

    // Native HTML Form onSubmit version (has no event arg)
//    _findLeads: function() {
//        console.log('find leads 2');
//        LeadsActions.getLeadById(this.state.searchBy.partyId);
//    },

    _onGetById: function() {
        var result = LeadsStore.getLeadFound();

        // If it's is an error, eg. permission error, non-existing lead, add it to ErrorBox
//        if (Object.keys(result).length === 0 && result.constructor === Object) {
        if(result.constructor === String) {
            this.props.updateErrorBox('Error getting lead');
            // to clear the old state
            // var e3 = new Event('clickss');
            this._resetForm();
        } else {
            this.props.updateErrorBox([]); // clear the ErrorBox
            this.setState({
                leadFoundById: result
            });
        }
    },


    render: function() {
        /* jshint ignore:start */

        var leadById = this.state.leadFoundById;
        var leadsJSX = [];
        leadsJSX.push(<LeadRow key={ 'lead_0' } lead={ leadById }/>)

        return(
            <div>
                <div className="container">

                    {/* First panel: holds Search Form */}
                    <div className="panel panel-default">
                        <div className="panel-heading panel-heading-custom">
                            <h2>Find Leads</h2>
                        </div>
                        <div className="panel-body">
                            <SearchForm
                                searchBy={ this.state.searchBy }
                                onChange={ this.setSearchByState }
                                onFormSubmit={ this._findLeads }
                                onFormReset={ this._resetForm }
                                // should have at least a space between */ and the next /
                                />
                        </div>
                    </div>

                    {/* Second panel:  holds Table with results */}
                    <div className="panel panel-default">
                        <div className="panel-heading panel-heading-custom">
                            <h2>Lead List</h2>
                        </div>
                        <div className="panel-body">
                            <table id="findLeadsTable" className='table'>
                                <thead>
                                    <tr>
                                        <th>Lead ID</th>
                                        <th>Salutation</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Description</th>
                                        <th>Parent Party ID</th>
                                        <th>Created Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { leadsJSX }
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        );
        /* jshint ignore:end */
    }

});

module.exports = withRouter(FindLeadsPage);