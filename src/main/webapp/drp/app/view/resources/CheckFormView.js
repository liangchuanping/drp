Ext.define('drp.app.view.resources.CheckStockView', {
    extend : 'Ext.window.Window',
    alias : 'widget.checkstockview',
    height: 510,
    width: 840,
    constrain : true,
    modal : true,
    closeAction : 'hide',
    layout : {
        type : 'border'
    },
    resizable : false,
    initComponent : function() {
        var me = this;
        
        var selModel = Ext.create('Ext.selection.CheckboxModel', {
            listeners: {
                selectionchange: function(sm, selections) {
                    me.down('#deleteStockInCost_btn').setDisabled(selections.length == 0);
                }
            }
        });

        Ext.applyIf(me, {

            items : [
               {xtype : 'gridpanel',
                region : 'center',
                height : 400,
                autoScroll : true,
                columnLines : true,
                selModel : selModel,
                store : 'drp.app.store.resources.CheckStockStore',
                columns : [
                    Ext.create('Ext.grid.RowNumberer'),
                {
                    xtype : 'gridcolumn',
                    flex : 2,
                    text : '商品名',
                    dataIndex : 'ware.name'
                }, {
                    xtype : 'gridcolumn',
                    dataIndex : 'ware.amount',
                    flex : 2,
                    text : '库存数'
                }, {
                    xtype : 'gridcolumn',
                    dataIndex : 'ware.check',
                    flex : 2,
                    text : '盘点数'
                }, {
                    xtype : 'gridcolumn',
                    dataIndex : 'difference',
                    flex : 2,
                    text : '差额'
                }, {
                    xtype : 'gridcolumn',
                    dataIndex : 'checkTime',
                    flex : 2,
                    text : '盘点时间'
                }, {
                    xtype : 'gridcolumn',
                    dataIndex : 'manager',
                    flex : 2,
                    text : '负责人'
                },{
                	xtype: 'gridcolumn',
                	dataIndex : 'wareKeeper',
                	flex: 2,
                	text: '库管员'
                }
                ],
                dockedItems : [{
                    xtype : 'toolbar',
                    dock : 'top',
                    items : [{
                        xtype : 'button',
                        icon : 'resources/images/icons/add.png',
                        action : 'addStockCheck',
                        itemId : 'addStockInCost_btn',
                        text : '新增',                      
                    }, '-', {                   	
                        xtype : 'button',
                        icon : 'resources/images/icons/delete.png',
                        action : 'deleteStockCheck',
                        itemId : 'deleteStockInCost_btn',
                        disabled : true,
                        text : '删除'
                    }]
                }],
                listeners : {
                    select : function(grid, record){
                        var cost = record.data;
                        var ware = cost.ware;
                        //设置cost的id
                        inCostForm.down('#id_stockInCost_tf').setValue(cost.id);
                        //动态设置form表单
                        inCostForm.down('#wareName_stockInCost_tf').setValue(ware.name);
                        inCostForm.down('#wareModel_stockInCost_tf').setValue(ware.model);
                        inCostForm.down('#wareUnit_stockInCost_tf').setValue(ware.unit);
                        
                        inCostForm.down('#chooseWare_stockInCost_btn').setDisabled(true);
                        
                        inCostForm.down('#wareUnitPrice_stockInCost_nf').setReadOnly(false);
                        inCostForm.down('#wareUnitPrice_stockInCost_nf').setValue(cost.unitPrice);
                        inCostForm.down('#wareQuantity_stockInCost_nf').setReadOnly(false);
                        inCostForm.down('#wareQuantity_stockInCost_nf').setValue(cost.quantity);
                    }
                }
            }, {
                xtype : 'panel',
                region : 'south',
                collapsible : true,
                height : 110,
                layout : 'fit',
                title : '商品信息',
                items : [{
                    xtype : 'form',
                    itemId : 'checkStock_form',
                    items : [{
                        xtype : 'fieldcontainer',
                        layout : 'column',
                        items : [{
                            xtype : 'textfield',
                            hidden : true,
                            name : 'id',
                            itemId : 'id_checkStock_tf'//入库单的id
                        }, {
                            xtype : 'textfield',
                            margin : '15 0 0 10',
                            itemId : 'wareName_checkStock_tf',
                            labelWidth : 50,
                            allowBlank : false,
                            readOnly : true,
                            fieldLabel : '名称<font color="red">*</font>'
                        }, {
                            xtype : 'textfield',
                            name : 'wareId',
                            itemId : 'wareId_checkStock_tf',
                            hidden : true
                        }, {
                            xtype : 'button',
                            text : '浏览...',
                            itemId : 'chooseWare_checkStock_btn',
                            disabled : true,
                            action : 'chooseWare',
                            margin : '15 0 0 5'
                        }, {
                            xtype : 'textfield',
                            margin : '15 0 0 15',
                            itemId : 'wareAmount_checkStock_tf',
                            labelWidth : 50,
                            readOnly : true,
                            fieldLabel : '库存量'
                        }, {
                            xtype : 'textfield',
                            margin : '15 0 0 15',
                            itemId : 'wareCheck_checkStock_tf',
                            labelWidth : 50,
                            name :'checkAmount',
                            allowBlank : false,
                            fieldLabel : '盘点量<font color="red">*</font>'
                        }]
                    }, {
                        xtype : 'fieldcontainer',
                        layout : 'column',
                        items : [{
                            xtype : 'textfield',
                            margin : '5 0 0 10',
                            itemId : 'wareDifferent_checkStock_nf',
                            name : 'difference',
                            labelWidth : 50,
                            readOnly : true,
                            fieldLabel : '差值',
                        }, {
                        	xtype : 'combobox',
                            margin : '5 0 0 15',
                            name : 'wareKeeper',
                            valueField : 'name',
                            displayField : 'name',
                            allowBlank: false,
                            itemId : 'WareKeeper_checkStock_cb',
                            store : 'drp.app.store.users.WareKeeperStore',
                            fieldLabel : '库管员<font color="red">*</font>'
                        }, {
                            xtype : 'combobox',
                            width : 200,
                            labelWidth: 60,
                            margin : '5 0 0 15',
                            name : 'regulator',                           
                            itemId : 'Regulator_checkStock_cb',
                            store : 'drp.app.store.users.RegulatorStore',
                            fieldLabel : '经手人'
                        }, {
                            xtype : 'button',
                            formBind : true,
                            text : '确定盘点',
                            action : 'saveCheckStock',
                            icon : 'resources/images/icons/add2.png',
                            margin : '5 0 0 20'
                        }]
                    }]
                }]
            }]
        });
        me.callParent(arguments);
    }

});