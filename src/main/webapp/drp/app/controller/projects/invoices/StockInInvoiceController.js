/**
 * @author ReedMi
 */
Ext.define("drp.app.controller.projects.invoices.StockInInvoiceController", {
    extend : "drp.app.controller.AbstractController",

    inInvoiceController : null,
    inInvoiceGrid : null,
    currentInInvoice : null,
    inCostGrid : null,
    inCostForm : null,
    inInvoiceCostWin : null,//inInvoiceCostWin默认是未创建的
    inInvoiceDetailWin : null,
    wareInWin : null,
    
    
    init : function() {
        inInvoiceController = this;
        this.control({

            'stockininvoiceview' : {
                afterrender : function(panel) {
                    inInvoiceCostWin = false;
                    inInvoiceDetailWin = false;
                    currentInInvoice = null;
                    wareInWin= false;
                    inInvoiceGrid = panel.down('gridpanel');
                    inInvoiceGrid.getStore().load();
                }
            },

            //stock_in_invoice filter
            'stockininvoiceview > gridpanel' : {
                itemdblclick : this.showUpdateInInvoiceForm
            },
            
            //stock_in_invoice search
            'stockininvoiceview button[action=searchStockInInvoice]' : {
                click : this.searchStockInInvoice
            },

            //stock_in_invoice add
            'stockininvoiceview button[action=showAddInInvoiceUI]' : {
                click : this.showCreateInInvoiceForm
            },

            //stock_in_invoice delete
            'stockininvoiceview button[action=deleteInInvoice]' : {
                click : this.deleteInInvoice
            },

            //----------------------------------------------------------------
            'stockincostview' : {
                afterrender : function(panel) {
                    inCostGrid = panel.down('grid');
                    inCostForm = panel.down('#stockInCost_form');
                },
                beforehide : this.updateInvoiceTotalPrice
            },
            
            //确认单据头信息
            'stockincostview button[action=confirmInvoiceHeader]' : {
                click : this.confirmInvoiceHeader
            },
            
            //stock_in_cost save
            'stockincostview button[action=saveStockInCost]' : {
                click : this.saveStockInCost
            },
            
            //stock_in_cost add
            'stockincostview button[action=addStockInCost]' : {
                click : this.addStockInCost
            },
            
            
            //stock_in_cost delete
            'stockincostview button[action=deleteStockInCost]' : {
                click : this.deleteStockInCost
            },

             //stock_in_cost choose ware
            'stockincostview button[action=chooseWare]' : {
                click : function(btn){
                    // 加载弹窗相关的controller
                    if(!wareInWin){
                        wareInWin = Ext.widget('stockinwarewin');
                        var WareControllerName = "drp.app.controller.resources.WareController";
                        if (!Ext.ClassManager.isCreated(WareControllerName)) {
                            var mainController = this.application.getController("drp.base.controller.MainController");
                            mainController.application.getController(WareControllerName).init();
                        }
                    }
                    wareInWin.show();
                 }
            },

            //-----------------------------------------------------------
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
                                    wareInWin.hide();
                                    var costForm = inInvoiceCostWin.down('#stockInCost_form');
                                    console.log(">>>>>>>>>>>>>>>>>入库单日志.....");
                                    console.log("wareInWin", wareInWin);
                                    console.log("inInvoiceCostWin", inInvoiceCostWin);
                                    console.log("costForm", costForm);
                                    costForm.down('#wareName_stockInCost_tf').setValue(record.data.name);
                                    costForm.down('#wareId_stockInCost_tf').setValue(record.data.id);
                                    costForm.down('#wareModel_stockInCost_tf').setValue(record.data.model);
                                    costForm.down('#wareUnit_stockInCost_tf').setValue(record.data.unit);
                                    console.log("==============================");
                                }
                            }
                        }]
                    }).showAt(e.getXY());
                }
            }

        });
    },

    //入库单-查询
    searchStockInInvoice : function(btn){
        var store = inInvoiceGrid.getStore();
        var form = btn.up("form");
        store.filters.clear();
        store.filter([ {
            property : "startDate",
            value : Ext.Date.format(form.down("#startDate_filter").getValue(),'Y-m-d')
        }, {
            property : "endDate",
            value : Ext.Date.format(form.down("#endDate_filter").getValue(),'Y-m-d')
        }, {
            property : "minTotal",
            value : form.down("#minTotal_filter").getValue()
        }, {
            property : "maxTotal",
            value : form.down("#maxTotal_filter").getValue()
        }, {
            property : "wareName",
            value : form.down("#wareName_filter").getValue()
        }, {
            property : "regulatorName",
            value : form.down("#regulatorName_filter").getValue()
        }, {
            property : "wareKeeperName",
            value : form.down("#wareKeeperName_filter").getValue()
        }, {
            property : "managerName",
            value : form.down("#managerName_filter").getValue()
        } ]);
    },
     
    
    // add 
    addStockInCost : function(btn){
    	btn.up('stockincostview').down('#stockInCost_form').getForm().reset();
    	btn.up('stockincostview').down('#stockInCost_form').down('#chooseWare_stockInCost_btn').setDisabled(false);
    	btn.up('stockincostview').down('#stockInCost_form').down('#wareQuantity_stockInCost_nf').setReadOnly(false);
    	btn.up('stockincostview').down('#stockInCost_form').down('#wareUnitPrice_stockInCost_nf').setReadOnly(false);
    	btn.up('stockincostview').down('#stockInCost_form').down('#wareUnitPrice_stockInCost_nf').setValue(0);  	
    },
    
    
    
    //入库商品-删除
    deleteStockInCost : function(btn) {
        inInvoiceController.deleteModel(btn, inCostGrid, "商品条目");
        var grid = inCostGrid;
        var name = "商品条目";
        var record = grid.getSelectionModel().getSelection()[0];
        if (!record) {
            inInvoiceController.showPromptsOnDelete(name);
            return;
        } else {
            Ext.MessageBox.confirm("标题", "你要删除这个" + name + "吗？", function(btn) {
                if (btn == 'yes') {
                    record.destroy({
                        success : function(record, operation) {
                            var store = grid.getStore();
                            var dataLength = store.data.length;
                            if (dataLength > 1) {
                                store.load();
                            } else {
                                store.loadPage(1);
                            }
                            Ext.Msg.alert("成功!", operation.request.scope.reader.jsonData["message"]);
                        },
                        failure : function(record, operation) {
                            Ext.Msg.alert("失败!", operation.request.scope.reader.jsonData["message"]);
                        }
                    });
                }
            });
        }
    },

    //入库商品-提交保存
    saveStockInCost : function(btn) {
        var modelName = "drp.app.model.projects.costs.StockInCostModel";
        var form = btn.up("form").getForm();
        if (form.isValid()) {
            var formBean = form.getValues();
            var model = Ext.create(modelName, formBean);
            if(formBean.id){
                model.set("ware",null);
                model.set("invoice",null);
            }else{
                model.set("ware", {
                    id : formBean['wareId']
                });
                model.set("invoice", {
                    id : currentInInvoice.data.id
                });
            }
            if(formBean.unitPrice == ""){
                model.set("unitPrice",0);
            }
            model.save({
                success : function(response, operation) {
                    var store = inCostGrid.getStore();
                    store.filters.clear();
                    store.filter([{
                        property : "invoice",
                        value : currentInInvoice.data.id
                    }]);
                    Ext.Msg.alert("成功!", operation.request.scope.reader.jsonData["message"]);
                },
                failure : function(response, operation) {
                    Ext.Msg.alert("失败!", operation.request.scope.reader.jsonData["message"]);
                }
            });
        }
    },

    //入库单-新增
    showCreateInInvoiceForm : function() {
        if(!inInvoiceCostWin){        	
            inInvoiceCostWin = Ext.widget('stockincostview');
        }else{
        	Ext.destroy(inInvoiceCostWin);
        	 inInvoiceCostWin = Ext.widget('stockincostview');
        }
        var store = inInvoiceCostWin.down("gridpanel").getStore();
        //在弹出新建入库单的页面之前，需要做三部分工作：清空store、合价设置为0
        currentInInvoice = null;
        store.removeAll(false);
        inInvoiceCostWin.down('#addStockInCost_btn').setDisabled(true);
        inInvoiceCostWin.down('#totalPrice_stockInCost_df').setValue(0);
//        inInvoiceCostWin.down('#header_stockInCost_form').getForm().reset();
//        inInvoiceCostWin.down('#stockInCost_form').getForm().reset();

        
        
        
        inInvoiceCostWin.setTitle("新增入库单");
        inInvoiceCostWin.show();
    },

    showUpdateInInvoiceForm : function( grid, record, item, index){
        currentInInvoice = record;//在弹出更新的窗口时，保存选中的invoice
        var invoiceData = record.data;

        var costWin = null;
        //1.非材料员登陆的，只提供预览
        //2.若是材料员，则pass=true的和已经通过审核的，只提供预览
        if(user.type != "WAREKEEPER"){
            if(!inInvoiceDetailWin){
                inInvoiceDetailWin = Ext.widget('stockincostshowview');
            }
            costWin = inInvoiceDetailWin;
            inInvoiceDetailWin.setTitle("查看入库单");
            
        } else {
            if(!inInvoiceCostWin){
                inInvoiceCostWin = Ext.widget('stockincostview');
            }
            costWin = inInvoiceCostWin;
            costWin.down('#addStockInCost_btn').setDisabled(false);
            costWin.down('#stockInCost_form').getForm().reset();
            inInvoiceCostWin.setTitle("更新入库单");
        }

        var store = costWin.down("gridpanel").getStore();
        store.filters.clear();
        store.filter([{
            property : "invoice",
            value : currentInInvoice.data.id
        }]);

        costWin.down('#stockInCost_form').loadRecord(record);
        //设置bottom toolbar
        var managerName = costWin.down('#managerName_df');
        var wareKeeperName = costWin.down('#wareKeeperName_df');
        var regulatorName = costWin.down('#regulatorName_df');
        managerName.setValue(record.data['manager']);
        wareKeeperName.setValue(record.data['wareKeeper']);
        regulatorName.setValue(record.data['regulator']);

        costWin.show();
    },

    //入库单-删除
    deleteInInvoice : function(btn) {
        inInvoiceController.deleteBatchModel(btn, inInvoiceGrid, "入库单", "invoices/in/deleteBatch");
    },

    //入库单-更新总价
    updateInvoiceTotalPrice : function(panel){
        panel.down('#chooseWare_stockInCost_btn').setDisabled(true);
        var totalPrice_stockInCost = panel.down('#totalPrice_stockInCost_df').getValue();
        if(!currentInInvoice){
            return;
        }
        if(currentInInvoice.data.totalPrice == totalPrice_stockInCost){
            return;
        }

        currentInInvoice.set("forDate",panel.down('#forDate_stockInInvoice_df').getValue());
        currentInInvoice.set("code",panel.down('#code_stockInInvoice_tf').getValue());
        currentInInvoice.set("totalPrice",totalPrice_stockInCost);

        currentInInvoice.save({
            success : function(response, operation) {
                inInvoiceGrid.getStore().load();
            },
            failure : function(response, operation) {
                Ext.Msg.alert("失败!", operation.request.scope.reader.jsonData["message"]);
            }
        });
    },

    confirmInvoiceHeader : function(btn){
        Ext.MessageBox.confirm("标题","确定单据头后，将无法再修改",function(choose){
        	if(choose == 'yes'){
        		inInvoiceController.confirInvoiceHeanderYes(btn);
        	}
        });
        },
        
    confirInvoiceHeanderYes : function(btn){     
     var modelName = "drp.app.model.projects.invoices.StockInInvoiceModel";
        var form = btn.up("form").getForm();
        if (form.isValid()) {
            var formBean = form.getValues();
            var model = Ext.create(modelName, formBean);
            model.save({
                success : function(response, operation){
                    inInvoiceGrid.getStore().load();
                    var reader = operation.request.scope.reader;
                    currentInInvoice = Ext.create(modelName,{
                        id : reader.jsonData["object"]
                    });
                    btn.up("form").down('#id_stockInInvoice').setValue(reader.jsonData["object"]);
                    btn.up("stockincostview").down('#addStockInCost_btn').setDisabled(false);                   
                    
                    btn.up("stockincostview").down('#receiveMan_stockInInvoice_tf').setReadOnly(true);   
                    btn.up("stockincostview").down('#forDate_stockInInvoice_df').setReadOnly(true);
                    btn.up("stockincostview").down('#code_stockInInvoice_tf').setReadOnly(true);
                    btn.up("stockincostview").down('#Manager_stockInInvoice_cb').setReadOnly(true);
                    btn.up("stockincostview").down('#WareKeeper_stockInInvoice_cb').setReadOnly(true);
                    btn.up("stockincostview").down('#Regulator_stockInInvoice_cb').setReadOnly(true);
                    btn.hide();
                    
                    Ext.Msg.alert("成功!", reader.jsonData["message"]);
                },
                failure : function(response, operation) {
                    Ext.Msg.alert("失败!", operation.request.scope.reader.jsonData["message"]);
                }
            });
        }
    },

    submitInInvoiceToAudit : function(state){
        var records = inInvoiceGrid.getSelectionModel().getSelection();
        var ids = [];
        for(var i = 0,len = records.length;i<len;i++){
            ids[i] = records[i].data.id;
        }
        
        var data = new Object({
            invoiceIds : ids,
            userType : user.type,
            userId : user.id,
            state : state
        });
        
        Ext.Ajax.request({
            url : "stockInInvoice/updateAuditState",
            method : "GET",
            params : {
                data : Ext.encode(data)
            },
            success : function(response, operation){
                var resp = Ext.decode(response.responseText);
                Ext.Msg.alert("成功!", resp.message);
                inInvoiceGrid.getStore().load();
            },
            failure : function(resp, operation) {
                Ext.Msg.alert("失败!", operation.request.scope.reader.jsonData["message"]);
            }
        });
    },
    
    models : ["drp.app.model.projects.invoices.StockInInvoiceModel",
              "drp.app.model.projects.costs.StockInCostModel", 
              "drp.app.model.resources.WareModel"],
    stores : ["drp.app.store.projects.invoices.StockInInvoiceStore", 
              "drp.app.store.projects.costs.StockInCostStore",
              "drp.app.store.resources.WareStore",
              "drp.app.store.resources.VendorStore",
              "drp.app.store.users.ManagerStore",
              "drp.app.store.users.WareKeeperStore",
              "drp.app.store.users.RegulatorStore",
              "drp.app.store.projects.inventories.CurrentInventoryStore"],
    views : ["drp.app.view.projects.invoices.StockInInvoiceView", 
             "drp.app.view.projects.costs.StockInCostView",
             "drp.app.view.projects.costs.StockInCostShowView",
             "drp.app.view.resources.WareView",
             "drp.app.view.resources.StockInWareWin",
             "drp.app.view.resources.WareViewForm" ]
});