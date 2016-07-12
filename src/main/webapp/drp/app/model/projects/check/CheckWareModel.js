Ext.define("drp.app.model.projects.check.CheckWareModel", {
    extend : "drp.app.model.AbstractModel",    
    fields : [{
        name : "ware"
    }, {
        name : "wareAmount"
    }, {
        name : 'checkInvoice'
    }, {
        name : "checkAmount"
    }, {
        name : 'difference'
    }, {
        name : 'weight'
    }, ],
    proxy : {
        type : 'rest',
        url : 'checkware/in',
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