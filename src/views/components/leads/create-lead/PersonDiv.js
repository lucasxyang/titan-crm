/////////////////////////////////////////////////
// A person info div on Add Lead page.
//
// @file:   PersonDiv.js
// @author: Xiaosiqi Yang <yang4131@umn.edu>
/////////////////////////////////////////////////

var React = require('react');

var PersonDiv = React.createClass({
    render: function () {
        /* jshint ignore:start */
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Person Info </h2>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6 col-xs-12">
                        <div className="form-group">
                            <label htmlFor="salutation">Salutation</label>
                            <div className="input-group">
                                <div className="input-group-addon"><i className="fa fa-file-text-o" aria-hidden="true"></i></div>
                                <input type="text" className="form-control" id="salutation" placeholder="Salutation" onChange={ this.props.onChange } value={ this.props.lead.salutation} />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-xs-12">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name *</label>
                            <div className="input-group">
                                <div className="input-group-addon"><i className="fa fa-file-text-o" aria-hidden="true"></i></div>
                                <input type="text" className="form-control" id="firstName" placeholder="First Name"
                                pattern="^[\x20-\x7E\u00C0-\u00FC]{1,100}$"
                                data-error="Required; max length 100 characters"
                                onChange={ this.props.onChange } value={ this.props.lead.firstName} required />
                            </div>
                            <div className="help-block with-errors"></div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6 col-xs-12">
                        <div className="form-group">
                            <label htmlFor="middleName">Middle Name</label>
                            <div className="input-group">
                                <div className="input-group-addon"><i className="fa fa-file-text-o" aria-hidden="true"></i></div>
                                <input type="text" className="form-control" id="middleName" placeholder="Middle Name"
                                pattern="^[\x20-\x7E\u00C0-\u00FC]{1,80}$"
                                data-error="Required; max length 80 characters"
                                onChange={ this.props.onChange } value={ this.props.lead.middleName} />
                            </div>
                            <div className="help-block with-errors"></div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-xs-12">
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name *</label>
                            <div className="input-group">
                                <div className="input-group-addon"><i className="fa fa-file-text-o" aria-hidden="true"></i></div>
                                <input type="text" className="form-control" id="lastName" placeholder="Last Name"
                                pattern="^[\x20-\x7E\u00C0-\u00FC]{1,100}$"
                                data-error="Required; max length 100 characters"
                                onChange={ this.props.onChange } value={ this.props.lead.lastName} required/>
                            </div>
                            <div className="help-block with-errors"></div>
                        </div>
                    </div>
                </div>


                <div className="row">
                    <div className="col-lg-6 col-xs-12">
                        <div className="form-group">
                            <label htmlFor="birthDate">Birth Date</label>
                            <div className="input-group">
                                <div className="input-group-addon"><i className="fa fa-calendar" aria-hidden="true"></i></div>
                                <input type="date" className="form-control" id="birthDate" onChange={ this.props.onChange } value={ this.props.lead.birthDate} />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-xs-12">
                        <div className="form-group">
                            <label htmlFor="comments">Comments</label>
                            <div className="input-group">
                                <div className="input-group-addon"><i className="fa fa-file-text-o" aria-hidden="true"></i></div>
                                <textarea className="form-control" id="comments" rows="4" placeholder="Comments of a person" onChange={ this.props.onChange } value={ this.props.lead.comments}></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
        /* jshint ignore:end */
    }

});

module.exports = PersonDiv;