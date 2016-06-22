/////////////////////////////////////////////////
// Add Quote form component.
//
// @file:   AddQuoteForm.js
// @author: Dinesh Shenoy <astroshenoy@gmail.com>
/////////////////////////////////////////////////

var React = require('react');
var QuoteTypeOption = require('./QuoteTypeOption');
var AccountPartyOption = require('./AccountPartyOption');
var CurrencyOption = require('../../common/CurrencyOption');
var CommonStore = require('../../../stores/CommonStore');
var CommonActions = require('../../../actions/CommonActions');

var AddQuoteForm = React.createClass({

    getInitialState: function () {
        return {
            quoteTypesObjArray: [],
            accountPartiesObjArray: [],
            currenciesObjArray: []
        };
    },

    componentDidMount: function () {
        CommonStore.addGetQuoteTypesListener(this._onGetQuoteTypes);
        CommonStore.addGetAccountPartiesListener(this._onGetAccountParties);
        CommonStore.addGetAllCurrenciesListener(this._onGetCurrencies);
        CommonActions.getQuoteTypes();
        CommonActions.getAccountParties();
        CommonActions.getAllCurrencies();

        $('#addQuoteForm').validator().on('submit', function (e) {
            if (e.isDefaultPrevented()) {
                // Handle the invalid form
            } else {
                // Proceed with form submission if all input data is valid
                this.AddQuoteForm.props.onFormSubmit(e);
            }
        });
    },

    componentWillUnmount: function() {
        CommonStore.removeListener('getQuoteTypes', this._onGetQuoteTypes);
        CommonStore.removeListener('getAccountParties', this._onGetAccountParties);
        CommonStore.removeListener('getAllCurrencies', this._onGetCurrencies);
    },

    _onGetQuoteTypes: function () { this.setState({ quoteTypesObjArray: CommonStore.getQuoteTypesObjArray() }); },
    _onGetAccountParties: function () { this.setState({ accountPartiesObjArray: CommonStore.getAccountPartiesObjArray() }); },
    _onGetCurrencies: function () { this.setState({ currenciesObjArray: CommonStore.getCurrenciesObjArray() }); },

    render: function () {
        /* jshint ignore:start */

        // UP HERE MAKE MENU TO USE BELOW AS { contactPartyIdsJSX }
        // UP HERE MAKE MENU TO USE BELOW AS { salesChannelsJSX }

        // make quoteTypeId drop-down menu
        var quoteTypes = this.state.quoteTypesObjArray;        
        var quoteTypesJSX = [];
        for (var i = 0; i < quoteTypes.length; i++) {
            quoteTypesJSX.push(<QuoteTypeOption key={ 'quoteType_' + i } quoteType={ quoteTypes[i] }/>);
        }  

        // make AccountPartyId drop-down menu  -- these are the rows generated by query:
        // SELECT party_role.party_id FROM party_role WHERE role_type_id = 'ACCOUNT';
        var accountParties = this.state.accountPartiesObjArray;        
        var accountPartiesJSX = [];
        for (var i = 0; i < accountParties.length; i++) {
            accountPartiesJSX.push(<AccountPartyOption key={ 'accountParty_' + i } accountParty={ accountParties[i] }/>);
        }  

        // make currency drop-down menu
        var currencies = this.state.currenciesObjArray;        
        var currenciesJSX = [];
        var noCurrency = { uom_id: null, abbreviation: '', description:'' };
        currenciesJSX.push(<CurrencyOption key={ 'currency_' } currency={ noCurrency }/>);
        for (var i = 0; i < currencies.length; i++) {
            currenciesJSX.push(<CurrencyOption key={ 'currency_' + i } currency={ currencies[i] }/>);
        }

        return (
            <div>
                <form id="addQuoteForm">

                    <div className="row">
                        <div className="col-lg-6 col-xs-12">
                            <div className="form-group">
                                <label htmlFor="quoteTypeId">Quote Type</label>
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <i className="fa fa-bars" aria-hidden="true"></i>
                                    </div>
                                    <select 
                                        className="form-control"
                                        id="quoteTypeId"
                                        onChange={ this.props.onChange }
                                        value={ this.props.quote.quoteTypeId }>
                                        { quoteTypesJSX }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xs-12">
                            <div className="form-group">
                                <label htmlFor="AccountPartyId">Account Party Id</label>
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <i className="fa fa-bars" aria-hidden="true"></i>
                                    </div>
                                    <select 
                                        className="form-control"
                                        id="partyId"
                                        onChange={ this.props.onChange }
                                        value={ this.props.quote.partyId }>
                                        { accountPartiesJSX }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6 col-xs-12">
                            <div className="form-group">
                                <label htmlFor="currency">Currency</label>
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <i className="fa fa-usd" aria-hidden="true"></i>
                                    </div>
                                    <select 
                                        className="form-control"
                                        id="preferredCurrencyUomId"
                                        onChange={ this.props.onChange }
                                        value={ this.props.quote.preferredCurrencyUomId }>
                                        { currenciesJSX }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xs-12">
                            <div className="form-group">
                                <label htmlFor="ContactPartyId">Contact Party Id</label>
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <i className="fa fa-bars" aria-hidden="true"></i>
                                    </div>
                                    <select 
                                        className="form-control"
                                        id="contactPartyId"
                                        onChange={ this.props.onChange }
                                        value={ this.props.quote.contactPartyId }>
                                        {/* contactPartyIdsJSX */}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6 col-xs-12">
                            <div className="form-group">
                                <label htmlFor="salesChannel">Sales Channel</label>
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <i className="fa fa-bars" aria-hidden="true"></i>
                                    </div>
                                    <select 
                                        className="form-control"
                                        id="salesChannelEnumId"
                                        onChange={ this.props.onChange }
                                        value={ this.props.quote.salesChannelEnumId }>
                                        {/* salesChannelsJSX */}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xs-12">
                            <div className="form-group">
                                <label htmlFor="quoteName">Quote Name</label>
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <i className="fa fa-file-text-o" aria-hidden="true"></i>
                                    </div>
                                <input type="text" 
                                    className="form-control" 
                                    id="quoteName" 
                                    placeholder="New parts for factory"
                                    onChange={ this.props.onChange } 
                                    value={ this.props.quote.quoteName } />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6 col-xs-12">
                            <div className="form-group">
                                <label htmlFor="validFromDate">Valid From Date</label>
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <i className="fa fa-calendar" aria-hidden="true"></i>
                                    </div>
                                    <input type="date" 
                                        className="form-control" 
                                        id="validFromDate" 
                                        onChange={ this.props.onChange } 
                                        value={ this.props.quote.validFromDate }/>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xs-12">
                            <div className="form-group">
                                <label htmlFor="validThruDate">Valid Thru Date</label>
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <i className="fa fa-calendar" aria-hidden="true"></i>
                                    </div>
                                    <input type="date" 
                                        className="form-control" 
                                        id="validThruDate" 
                                        onChange={ this.props.onChange } 
                                        value={ this.props.quote.validThruDate }/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                         <div className="col-lg-12 col-xs-12">
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <div className="input-group">
                                    <div className="input-group-addon">
                                        <i className="fa fa-file-text-o" aria-hidden="true"></i>
                                    </div>
                                    <textarea 
                                        className="form-control" 
                                        id="description" 
                                        rows="2"
                                        placeholder="(255 characters or less)" 
                                        onChange={ this.props.onChange } 
                                        value={ this.props.quote.description } ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <button className="btn btn-primary" type="submit" data-disable="true">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        );
        /* jshint ignore:end */
    }
});

module.exports = AddQuoteForm;