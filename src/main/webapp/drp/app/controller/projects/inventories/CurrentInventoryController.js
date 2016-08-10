Ext.define('drp.app.controller.projects.inventories.CurrentInventoryController', {
    extend : 'Ext.app.Controller',

    currentInventoryController : null,
    checkStockView : null,
    checkStockDetailView : null,
    currentCheckInvoice :null,
    checkWareGrid :null,
    wareWin : null,
    currentInventoryStore : null,
    checkGrid : null,
    grid :  null,
    gridStore : null,
    
    
    init : function() {
    	currentInventoryController = this;
        this.control({
            'currentinventoryview' : {
                afterrender : function(panel) {                 	                	
                    grid = panel.down('gridpanel');
                    grid.getStore().load();
                }
            },  
                        
            'checkinvoiceview' :{
            	afterrender : function(panel){
            	     checkStockView = panel.up("checkstockview");
            	     checkStockDetailView = false;
            	     wareWin = false; 
            	     checkGrid = panel.down('gridpanel');
            	     checkGrid.getStore().load();
            	     gridStore = Ext.create("drp.app.store.projects.inventories.CurrentInventoryStore");
                     gridStore.load(); 
            	}
            },
            
            'checkstockview' : {
                afterrender : function(panel) {                 	                	
                    checkwaregrid = panel.down('gridpanel');
                    
                }
            },  
            
            'currentinventoryview button[action=exportCurrentInventoryExcel]' : {
                click : function(btn) {
                    document.location = "inventories/current/export";
                }
            },
            
            'checkinvoiceview button[action = showcheckstockview]' :{
            	click: function(){
            		this.showCheckUI();
            	}
            },
            
            'checkstockview button[action = confirmCheckInvoiceHeader]' :{
            	click : function(btn){
            		this.comfirmCheckInvoiceHeader(btn);
            	}
            },
            'checkstockview button[action = addWareCheck]' :{
            	click : function(btn){
            		this.addWareCheck(btn);
            	} 
            },
            
            'checkstockview button[action = saveCheckStock]' :{
            	click : function(btn){
            		this.saveCheckStock(btn);
            	} 
            },
            
            'checkstockview button[action = chooseWare]':{
            	click : function(btn){
            		if(!wareWin){
            			wareWin = Ext.widget('stockinwarewin');
            			var WareControllerName = "drp.app.controller.resources.WareController";
            			  if (!Ext.ClassManager.isCreated(WareControllerName)) {
                              var mainController = this.application.getController("drp.base.controller.MainController");
                              mainController.application.getController(WareControllerName).init();
                          }
            		}
            		wareWin.show();
            	} 
            },
            
            'stockinwarewin gridpanel' : {
                itemcontextmenu : function(view, record, item, index, e){
                    // 禁用浏览器自带的右键菜单
                    e.preventDefault();
                    e.stopEvent();
                    
                    var wareName = record.data.name;
                    Ext.create('Ext.menu.Menu', {
                        minWidth : 0,
                        width : 62+(wareName.length)*13,
                        items : [{
                            text : '选择<font color="red">'+wareName+'</font>',
                            icon : 'resources/images/icons/ok.png',
                            listeners : {
                                click : function(item){
                                	wareWin.hide();  
                                	var wareCount = 0;
                                	for(var i = 0 ;i< gridStore.getCount(); i++ ){                                    		                               	
                                		if( gridStore.getAt(i).data.name == wareName){
                                			wareCount = gridStore.getAt(i).data.restcount; 
                                		}
                                	};
                                	
                                	
                                    var checkWareForm = checkStockView.down('#checkWare_form');
                                    checkWareForm.down('#wareId_checkWare_tf').setValue(record.data.id);
                                    checkWareForm.down('#wareName_checkWare_tf').setValue(record.data.name);
                                    checkWareForm.down('#wareAmount_checkWare_tf').setValue(wareCount);                                   
                                 //   checkWareForm.down('#wareUnit_stockInCost_tf').setValue(record.data.unit);
                                }
                            }
                        }]
                    }).showAt(e.getXY());
                }
            }
            
        });
    
    },
    
    comfirmCheckInvoiceHeader: function(btn){
    	Ext.MessageBox.confirm("标题", "确定单据头后，将无法再修改。" ,function(choose){
    		if(choose == 'yes'){
    			currentInventoryController.confirmYES(btn);
    		}
    	});    	
    },
       
    confirmYES : function(btn){
          	var modelName = "drp.app.model.projects.check.CheckInvoiceModel";
          	var form = btn.up("form").getForm();              
          	if(form.isValid()){
          		var formBean = form.getValues();
          		var model = Ext.create(modelName,formBean);

          		model.save({
          			success: function(response, operation){
//          			checkGrid.getStore().load();
          				var reader = operation.request.scope.reader;
          				
          				currentCheckInvoice = Ext.create(modelName,{
          				id : reader.jsonData["object"]});          			          				
          				
          				btn.up("form").down('#id_checkheader').setValue( reader.jsonData["object"]);
          				
          				btn.up('checkstockview').down('#addCheckWare_btn').setDisabled(false);
          				btn.up("checkstockview").down('#check_checkheader_tf').setReadOnly(true);
          				btn.up("checkstockview").down('#forDate_checkheader_df').setReadOnly(true);
          				btn.up("checkstockview").down('#code_checkheader_tf').setReadOnly(true);
          				btn.up("checkstockview").down('#Manager_checkheader_cb').setReadOnly(true);
          				btn.up("checkstockview").down('#WareKeeper_checkheader_cb').setReadOnly(true);
          				btn.up("checkstockview").down('#Regulator_checkheader_cb').setReadOnly(true);
          				btn.hide();
          				Ext.Msg.alert("成功",reader.jsonData["message"]);         
          			},
          			failure : function(response,  operation){
          				Ext.Msg.alert("失败！");
          			}
          		});
          		
          	}
    },
    
       showCheckUI: function(){
    	   if(!checkStockView){
    		   checkStockView = Ext.widget('checkstockview');
    	   }else{
    		   Ext.destroy(checkStockView);
    		   checkStockView = Ext.widget('checkstockview');
    	   }    	   
    	   //var store = checkStockView.get("gridpanel").getStore();
    	  // store.removeAll(false);
           checkStockView.down("#checkWare_form").getForm().reset();
           checkStockView.setTitle("库存盘点");
    	   checkStockView.show();
       },
    
       addWareCheck: function(btn){
    	   btn.up('checkstockview').down('#checkWare_form').getForm().reset();
    	   btn.up('checkstockview').down('#chooseWare_checkWare_btn').setDisabled(false);
    	   btn.up('checkstockview').down('#wareCheckMount_checkWare_tf').setReadOnly(false);
       },
    
       saveCheckStock : function(btn){
    	   var modelName = "drp.app.model.projects.check.CheckWareModel";
    	   var form = btn.up("form").getForm();
    	   if(form.isValid()){
    	   var formBean = form.getValues();
    	   var model = Ext.create(modelName, formBean);
    	   if(formBean.id){
    		   model.set("ware", null);
    		   model.set("checkInvoice", null);
    	   }else{
    		   model.set("ware",{
    		   id : formBean["wareId"] }); 
    		   
               model.set("checkInvoice",{
               id : currentCheckInvoice.data.id });                
    	   }
    	   
    	   model.set("difference",formBean["checkAmount"] - formBean["wareAmount"]); 
    	   model.save({
    		   success : function(response, operation){
    			   var store = checkgrid.getStore();
    			   store.filters.clear();
    			   store.filters([{
    				   property : "checkInvoice",
    				   value : currentCheckInvoice.data.id,
    			   }]);
    			   Ext.Msg.alert("成功!");
    		   },  
    		   failure : function(response, operation) {
                   Ext.Msg.alert("失败!");
               } 
    	   });   	   
    	   };    	   
       },
       
 
    views : ["drp.app.view.projects.inventories.CurrentInventoryView",
             "drp.app.view.projects.check.CheckFormView",
             "drp.app.view.resources.StockInWareWin",
             "drp.app.view.resources.WareView",
             ],
             
    models : ['drp.app.model.projects.inventories.CurrentInventoryModel',
              "drp.app.model.resources.WareModel",
              "drp.app.model.users.WareKeeperModel",
              "drp.app.model.resources.WareModel",
              "drp.app.model.projects.check.CheckInvoiceModel"
              ],
    
    stores : ['drp.app.store.projects.inventories.CurrentInventoryStore',
              "drp.app.store.users.ManagerStore",
              'drp.app.store.users.WareKeeperStore',
              "drp.app.store.users.RegulatorStore",
              "drp.app.store.resources.VendorStore",
              "drp.app.store.resources.WareStore",
              "drp.app.store.resources.VendorStore",
              "drp.app.store.projects.check.CheckInvoiceStore"]
});