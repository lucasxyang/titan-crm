/////////////////////////////////////////////////
// Data access layer module for leads.
//
// @file:   leadData.js
// @author: Xiaosiqi Yang <yang4131@umn.edu>
/////////////////////////////////////////////////

/* jshint camelcase: false */

// WARNING!
// updateLead, deleteLead may not behave as expected! 
// addLead, getLeadById, getLeadsByOwner are tested and functional. 
// getLeads may need revision. It is not used now. Don't remove yet. 

var leadData = function (knex) {


    // DATA METHODS
    /**
     * Methods in XXXdata.js are called from Controller layer,
     * They accept lead entities from controllers, and insert them into database.
     * They also query the database based on the creteria from controllers, and giving back (queried) columns to controllers. 
     */
    // ==========================================
    //


    // Lucas's taking this
    /**
     * Add a new lead in database
     * @param {Object} lead - The new lead entity to be added
     * @return {Object} promise - Fulfillment value is id of row inserted
     */
    var addLead = function (lead) {
        // this achieves goals mentioned on slide # 17
        // #1, 2, 3, 4, 5, 6: good
        // #7(party_relationship) is NOT implemented at this moment. Lucas has no plan on doing this in the near future. 


        //NOTE TO LUCAS AND DIVINE: Below changes to this function were made by Eric to resolve errors crashing the app
        //Thank you from Lucas and Divine.
        return knex('party')
            .returning('party_id')
            .insert({
                // ok to put dummy data here
                party_type_id: lead.partyTypeId,
                preferred_currency_uom_id: lead.currencyUomId,
                description: lead.description,
                status_id: lead.statusId,
                created_by: lead.createdBy,
                created_date: lead.createdDate,
                updated_date: lead.updatedDate
            })
            .then(function (res) {
                return knex('person')
                    .returning('party_id')
                    .insert({
                        party_id: res[0],
                        salutation: lead.salutation,
                        first_name: lead.firstName,
                        middle_name: lead.middleName,
                        last_name: lead.lastName,
                        birth_date: lead.birthDate,
                        comments: lead.comments,
                        created_date: lead.createdDate,
                        updated_date: lead.updatedDate
                    })
            .then(function () { // maybe change the param to res? ABSOLUTELY NO! Requiring numeric param while passing a promiss is not right 
                return knex('party_supplemental_data')
                    //.returning('party_id')
                    .insert({
                        party_id: res[0],
                        parent_party_id: lead.parentPartyId,
                        company_name: lead.companyName,
                        annual_revenue: lead.annualRevenue,
                        currency_uom_id: lead.currencyUomId, // the same. Was renamed.
                        num_employees: lead.numEmployees,
                        created_date: lead.createdDate,
                        updated_date: lead.updatedDate, 
                        
                        industry_enum_id: lead.industryEnumId,
                        ownership_enum_id: lead.ownershipEnumId,
                        ticker_symbol: lead.tickerSymbol,
                        important_note: lead.importantNote
//                        primary_postal_address_id: lead.primaryPostalAddressId,
//                        primary_telecom_number_id: lead.primaryTelecomNumberId,
//                        primary_email_id: lead.primaryEmailId
                    })
            .then(function () {
                return knex('party_role')
                    .insert({
                        party_id: res[0],
//                        role_type_id: lead.roleTypeId,
                        role_type_id: 'LEAD', // just so
                        created_date: lead.createdDate,
                        updated_date: lead.updatedDate
                    })
             .then(function() {
                   return res[0];
                    });
            });
            });
            });
    };

    // Lucas's taking this
    /**
     * Gets all leads from database
     * @return {Object} promise - Fulfillment value is an array of raw data objects
     * THIS FUNCTION IS OBSOLETE. Need revision or removal. Possibly will be used once getLeads is to be implemeted in controller and API layer. 
     */
    var getLeads = function () {
        return knex.select('party_id', 'salutation', 'first_name', 'middle_name', 'last_name', 'birth_date', 'comments', 'created_date', 'updated_date')
            .from('person');
    };

    // Lucas's taking this
    /**
     * Gets one lead by its id from database. This GET will JOIN more than 3 tables and contain many details. 
     * @param {Number} partyId - Unique id of the party (grandparent of lead) to be fetched
     * @return {Object} promise - Fulfillment value is a raw data object
     */
    var getLeadById = function (id) {
        return knex.select('person.party_id', 'person.salutation', 'person.first_name', 'person.middle_name',
                           'person.last_name', 'person.birth_date', 'person.comments', 'person.created_date', 'person.updated_date',
                           'party.party_type_id', 'party.preferred_currency_uom_id', 'party.description', 'party.status_id', 
                           'party.created_by', 
                           'party_supplemental_data.parent_party_id', 'party_supplemental_data.company_name', 
                           'party_supplemental_data.annual_revenue', 'party_supplemental_data.num_employees',
                           'party_supplemental_data.industry_enum_id', 'party_supplemental_data.ownership_enum_id',
                           'party_supplemental_data.ticker_symbol', 'party_supplemental_data.important_note',
                           'party_role.role_type_id' /*,
                           'party_contact_mech.contact_mech_id', 'party_contact_mech.contact_mech_purpose_type_id', 
                           'party_contact_mech.from_date', 'party_contact_mech.thru_date', 'party_contact_mech.verified',
                           'party_contact_mech.comments',
                           'contact_mech.contact_mech_id', 'contact_mech.contact_mech_type_id', 'contact_mech.info_string',
                           'telecom_number.country_code', 'telecom_number.area_code', 'telecom_number.contact_number', 'telecom_number.ask_for_name',
                           'postal_address.to_name', 'postal_address.attn_name', 'postal_address.address1',
                           'postal_address.address2', 'postal_address.directions', 'postal_address.city',
                           'postal_address.postal_code', 'postal_address.country_geo_id', 'postal_address.state_province_geo_id'*/
                          )
            .from('person')
            .innerJoin('party', 'person.party_id', 'party.party_id')
            .innerJoin('party_supplemental_data', 'person.party_id', 'party_supplemental_data.party_id')
            .innerJoin('party_role', 'person.party_id', 'party_role.party_id')
            /*.innerJoin('party_contact_mech', 'person.party_id', 'party_contact_mech.party_id')
            .leftJoin('contact_mech', 'party_contact_mech.contact_mech_id', '=', 'contact_mech.contact_mech_id')
            .leftJoin('telecom_number', 'contact_mech.contact_mech_id', '=', 'telecom_number.contact_mech_id')
            .leftJoin('postal_address', 'contact_mech.contact_mech_id', '=', 'postal_address.contact_mech_id')*/
            .where('person.party_id', id)
            .andWhere('party_role.role_type_id', 'LEAD');
        // potential TODO: limit results to LEAD type (party_role.role_type_id)
        
        
        
//        return knex.from('person')
//            .innerJoin('party', 'person.party_id', 'party.party_id')
//            .innerJoin('party_supplemental_data', 'person.party_id', 'party_supplemental_data.party_id')
//            .innerJoin('party_role', 'person.party_id', 'party_role.party_id')
//            .innerJoin('party_contact_mech', 'person.party_id', 'party_contact_mech.party_id')
//            .leftJoin('contact_mech', 'party_contact_mech.contact_mech_id', '=', 'contact_mech.contact_mech_id')
//            .leftJoin('telecom_number', 'contact_mech.contact_mech_id', '=', 'telecom_number.contact_mech_id')
//            .leftJoin('postal_address', 'contact_mech.contact_mech_id', '=', 'postal_address.contact_mech_id')
//            .where('person.party_id', id);
    };


    // Lucas's taking this
    /**
     * Gets leads by its owner (the one by whom they are created) from database
     * @param {Number} ownerId - Unique id of the owner of leads
     * @return {Object} promise - Fulfillment value is a raw data object
     */
    var getLeadsByOwner = function (ownerId) {
        return knex.from('person')
            .innerJoin('party', 'person.party_id', 'party.party_id')
            .innerJoin('party_supplemental_data', 'person.party_id', 'party_supplemental_data.party_id')
            .innerJoin('party_role', 'person.party_id', 'party_role.party_id')
//            .innerJoin('party_contact_mech', 'person.party_id', 'party_contact_mech.party_id')
            .where('party.created_by', ownerId);
    };



    // getLeadbyIdentity
    //@params {string} firstName -  The first name of the lead you want
    //@params {string} lastName - The last name of the lead you want
    //@return {object} promise - The fulfilmment object is an array of searched values
    var getLeadByIdentity = function (firstName, lastName){
        var leadByIdentity = ['party.party_id', 'party.party_type_id',
                              'party.preferred_currency_uom_id',
                              'party.description', 'party.status_id', 
                              'party.created_by', 'party.created_date', 
                              'party.updated_date', 'person.salutation', 
                              'person.first_name', 'person.middle_name', 
                              'person.last_name', 'person.birth_date', 
                              'person.comments'
        ];
    var firstNameLike = '%' + firstName + '%';
    var lastNameLike = '%' + lastName + '%';
    //search with only the first name
    if (firstName.length > 0 && lastName.length === 0) {
            firstNameLike = '%' + firstName + '%';
            return knex.select(leadByIdentity)
                .from('party_relationship')
                .innerJoin('person', 'person.party_id', 'party_relationship.party_id_from')
                .innerJoin('party', 'party.party_id', 'person.party_id')
                .andWhere('role_type_id_from', 'LEAD')
                .andWhere('first_name', 'like', firstNameLike);
        }
    //search with only the last name
    if (firstName.length === 0 && lastName.length > 0) {
            lastNameLike = '%' + lastName + '%';
            return knex.select(leadByIdentity)
                .from('party_relationship')
                .innerJoin('person', 'person.party_id', 'party_relationship.party_id_from')
                .innerJoin('party', 'party.party_id', 'person.party_id')
                .andWhere('role_type_id_from', 'LEAD')
                .andWhere('last_name', 'like', lastNameLike);
        }
    // search using both the first name and the last name
    if (firstName.length > 0 && lastName.length > 0) {
            firstNameLike = '%' + firstName + '%';
            lastNameLike = '%' + lastName + '%';
            return knex.select(leadByIdentity)
                .from('party_relationship')
                .innerJoin('person', 'person.party_id', 'party_relationship.party_id_from')
                .innerJoin('party', 'party.party_id', 'person.party_id')
                .andWhere('role_type_id_from', 'LEAD')
                .andWhere('first_name', 'like', firstNameLike)
                .andWhere('last_name', 'like', lastNameLike);
        }
    
    // if nothing is entered
    else {
            return knex.select(leadByIdentity)
                .from('party_relationship')
                .innerJoin('person', 'person.party_id', 'party_relationship.party_id_from')
                .innerJoin('party', 'party.party_id', 'person.party_id')
                .andWhere('role_type_id_from', 'Lead')
                .andWhere('first_name', 'like', '')
                .andWhere('last_name', 'like', '');
        }
        
    };

    /**
     * Update a lead in database
     * @param {Object} lead - The lead entity that contains updated data
     * @return {Object} promise - Fulfillment value is number of rows updated
     */
    var updateLead = function (leadId) {
        return knex('party_contact_mech')
            .where({
                party_id: leadId
            })
            .update()
            .then(function (partyLinkRows) {
                return knex('contact_mech')
                    .where({
                        party_id: leadId
                    })
                    .update()
                    .then(function (contactMechRows) {
                        return knex('party_role')
                            .where({
                                party_id: leadId

                            })
                            .update()
                            .then(function (partyRoleRows) {
                                return knex('party_supplemental_data')
                                    .where({
                                        party_id: leadId
                                    })
                                    .update()
                                    .then(function (partySuppRows) {
                                        return knex('person')
                                            .where({
                                                party_id: leadId

                                            })
                                            .update()
                                            .then(function (personRows) {
                                                return knex('party')
                                                    .where({
                                                        party_id: leadId
                                                    })
                                                    .update()
                                                    .then(function (partyRows) {
                                                        return partyRows + personRows + partyRoleRows + partySuppRows + contactMechRows + partyLinkRows;
                                                    });

                                            });
                                    });
                            });
                    });
            });
    };
    // Divine: Follow my example of adding leads. 
    // You need to delete the leads from Party_supplemental_data, Person and serveral other tables, 
    // before deleting (the rest of) that lead in Party table
    /**
     * Delete a lead from database
     * @param {Number} leadId - Unique id (actually partyId) of the lead to be deleted
     * @return {Object} promise - Fulfillment value is number of rows deleted
     */
    var deleteLead = function (leadId) {
        return knex('party_contact_mech')
            .where({
                party_id: leadId
            })
            .del()
            .then(function (partyLinkRows) {
                return knex('contact_mech')
                    .where({
                        party_id: leadId
                    })
                    .del()
                    .then(function (contactMechRows) {
                        return knex('party_role')
                            .where({
                                party_id: leadId

                            })
                            .del()
                            .then(function (partyRoleRows) {
                                return knex('party_supplemental_data')
                                    .where({
                                        party_id: leadId
                                    })
                                    .del()
                                    .then(function (partySuppRows) {
                                        return knex('person')
                                            .where({
                                                party_id: leadId

                                            })
                                            .del()
                                            .then(function (personRows) {
                                                return knex('party')
                                                    .where({
                                                        party_id: leadId
                                                    })
                                                    .del()
                                                    .then(function (partyRows) {
                                                        return partyRows + personRows + partyRoleRows + partySuppRows + contactMechRows + partyLinkRows;
                                                    });

                                            });
                                    });
                            });
                    });
            });
    };

    return {
        addLead: addLead,
        getLeadsByOwner: getLeadsByOwner,
        getLeads: getLeads,
        getLeadById: getLeadById,
        updateLead: updateLead,
        deleteLead: deleteLead
    };

};

module.exports = leadData;