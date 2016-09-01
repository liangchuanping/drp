Ext.define('drp.app.controller.projects.inventories.CurrentInventoryController', {
    extend : "drp.app.controller.AbstractController",

    currentInventoryController : null,
    checkStockView : null,
    checkStockDetailView : null,
    currentCheckInvoice :null,
    showCheckInvoice : null,
    checkWareGrid :null,
    checkWareForm : null,
    wareWin : null,
    inInvoiceDetailWin : null,
    currentInventoryStore : null,
    checkInvoiceGrid : null,
    grid :  null,
    gridStore : null,
    checkWareStore : null,
    checkInvoiceStore : null,
    
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
            	     checkStockDetailView = false;
            	     wareWin = false; 
            	     checkStockView = false;
            	     inInvoiceDetailWin = false;
            	     checkInvoiceGrid = panel.down('gridpanel');
            	     checkInvoiceStore = checkInvoiceGrid.getStore();
            	     checkInvoiceStore.load();
            	     gridStore = Ext.create("drp.app.store.projects.inventories.CurrentInventoryStore");
                     gridStore.load(); 
            	}
            },
            
            'checkstockview' : {
                afterrender : function(panel) {                 	                	
                    checkwaregrid = panel.down('gridpanel');
                    checkWareForm = panel.down("#checkWare_form");
                                       
                }
            },  
            
            'checkinvoiceview > gridpanel' :{
            	itemdblclick : this.showUpdateInvoiceForm
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
            
            'checkinvoiceview button[action = deleteCheckInInvoice]' :{
            	click: function(){
            		this.deleteCheckInInvoice();
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
            
            'checkstockview button[action = deleteWareCheck]' :{
            	click : function(btn){
            		this.deleteWareCheck(btn);
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
                                    checkWareForm.down('#wareCheckMount_checkWare_tf').reset();
                                    checkWareForm.down('#wareDifferent_checkWare_nf').reset();
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
          	gridStore.load();
          	if(form.isValid()){
          		var formBean = form.getValues();
          		var model = Ext.create(modelName,formBean);

          		model.save({
          			success: function(response, operation){
//          			checkGrid.getStore().load();
          				var reader = operation.request.scope.reader;
          				checkInvoiceStore.load();
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
    	   checkWareStore = checkStockView.down("gridpanel").getStore();
    	   checkWareStore.removeAll(false);
           checkStockView.setTitle("库存盘点");
    	   checkStockView.show();
       },
       
       deleteCheckInInvoice: function(btn){
    	   this.deleteBatchModel(btn,checkInvoiceGrid,"盘点单","checkinvoices/in/deleteBatch");   
       },
       
       addWareCheck: function(btn){
    	   btn.up('checkstockview').down('#checkWare_form').getForm().reset();
    	   btn.up('checkstockview').down('#chooseWare_checkWare_btn').setDisabled(false);
    	   btn.up('checkstockview').down('#wareCheckMount_checkWare_tf').setReadOnly(false);
       },
    
       deleteWareCheck: function(btn){
    	  var selectedmodels = checkwaregrid.getSelectionModel().getSelection();
    	  
    		  Ext.MessageBox.confirm("标题","你要删除这些商品吗？",function(btn){
    			  if(btn = "yes"){
    				  for(var a = 0; a < selectedmodels.length; a++){
    					var  selectedmodel = selectedmodels[a];
    				  selectedmodel.destroy({
    					success : function(selectedmodel, operation){
    						var store =checkwaregrid.getStore();
    						var dataLength = store.data.length;
    						if(dataLength>1){
    							store.load();
    						}else{
    							store.loadPage(1);
    						}    						
    					},
    					failure: function(selectedmodel, operation){
    						Ext.Msg.alert("失败")
    					}
    			  });
    			  }
    			  }}
    		  );
    	  
       },
       
       showUpdateInvoiceForm : function(grid, record, item, index){
    	   showCheckInvoice = record;
    	   var invoiceData = record.data;
    	   
    	   
    	   var checkWin = null;
    	   if(!inInvoiceDetailWin){
    		   inInvoiceDetailWin = Ext.widget('checkwareshowview');    		   
    	   }
    	   checkWin = inInvoiceDetailWin;
    	   
    	   inInvoiceDetailWin.setTitle("查看盘点单");
    	   
    	   var store = checkWin.down("gridpanel").getStore();
    	   store.filters.clear();
    	   store.filter([
    	   {property: "invoice" ,
    		value: invoiceData.id,
    	   }])
    	   
    	   checkWin.down("#checkinvoice_form").loadRecord(record);
    	   checkWin.down("#managerName_df").setValue(record.data.manager);
    	   checkWin.down("#wareKeeperName_df").setValue(record.data.wareKeeper);
    	   checkWin.down("#regulatorName_df").setValue(record.data.regulator);
    	   checkWin.show();
       },
              
       saveCheckStock : function(btn){
    	   var modelName = "drp.app.model.projects.check.CheckWareModel";
    	   var form = btn.up("form").getForm();
    	   if(form.isValid()){
    	   var formBean = form.getValues();
    	   var model = Ext.create(modelName, formBean);
    	   if(formBean.id){
    		   model.set("ware", null);
    		   model.set("invoice", null);
    	   }else{
    		   model.set("ware",{
    		   id : formBean["wareId"] }); 
    		   
               model.set("invoice",{
               id : currentCheckInvoice.data.id });               
               model.set("checkStatus", "valid");
    	   }
    	   
    	   model.set("difference",formBean["checkAmount"] - formBean["wareAmount"]); 
    	   model.save({
    		   success : function(response, operation){
    			   var store = checkwaregrid.getStore();
    			   store.filters.clear();
    			   store.filter([{
    				   property : "invoice",
    				   value : currentCheckInvoice.data.id,
    			   }]);
    			   checkWareForm.getForm().reset();
    			   Ext.Msg.alert("成功!",operation.request.scope.reader.jsonData["message"]);
    		   },  
    		   failure : function(response, operation) {
                   Ext.Msg.alert("失败!",operation.request.scope.reader.jsonData["message"]);
               } 
    	   });   	   
    	   };    	   
       },
       
 
    views : ["drp.app.view.projects.inventories.CurrentInventoryView",
             "drp.app.view.projects.check.CheckFormView",
             "drp.app.view.resources.StockInWareWin",
             "drp.app.view.resources.WareView",
             "drp.app.view.projects.check.CheckWareShowView"
             ],
             
    models : ['drp.app.model.projects.inventories.CurrentInventoryModel',
              "drp.app.model.resources.WareModel",
              "drp.app.model.users.WareKeeperModel",
              "drp.app.model.resources.WareModel",
              "drp.app.model.projects.check.CheckInvoiceModel",
              "drp.app.model.projects.check.CheckWareModel"
              ],
    
    stores : ['drp.app.store.projects.inventories.CurrentInventoryStore',
              "drp.app.store.users.ManagerStore",
              'drp.app.store.users.WareKeeperStore',
              "drp.app.store.users.RegulatorStore",
              "drp.app.store.resources.VendorStore",
              "drp.app.store.resources.WareStore",
              "drp.app.store.resources.VendorStore",
              "drp.app.store.projects.check.CheckInvoiceStore",
              "drp.app.store.projects.check.CheckWareStore"]
});