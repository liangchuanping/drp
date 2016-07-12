Ext.define("drp.app.model.projects.check.CheckInvoiceModel", {
    extend : "drp.app.model.AbstractModel",    
    fields : [{
        name : "code"
    }, {
        name : "forDate"
    }, {
        name : 'manager'
    }, {
        name : 'wareKeeper'
    }, {
        name : 'regulator'
    }, {
        name : "check"
    } ],
    proxy : {
        type : 'rest',
        url : 'checkinvoices/in',
        reader : {
            type : "json",
            root : "data",
            successProperty : 'success',
            totalProperty : 'total'
        },
        writer : {
            type : "json"
        }
    }
});