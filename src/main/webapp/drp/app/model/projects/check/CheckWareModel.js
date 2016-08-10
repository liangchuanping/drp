Ext.define("drp.app.model.projects.check.CheckWareModel", {
    extend : "drp.app.model.AbstractModel",    
    fields : [
       {
        name : "invoice"
    },
       {
    	name : "ware"
    }, 
      {
    	name : 'forDate'    	
    },{
        name : "wareAmount"
    }, {
        name : "checkAmount"
    }, {
        name : 'difference'
    },    
    ],
    
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