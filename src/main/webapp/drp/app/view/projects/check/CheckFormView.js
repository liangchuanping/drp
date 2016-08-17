Ext.define('drp.app.view.projects.check.CheckFormView', {
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
            items : [{
                xtype : 'panel',
                region : 'north',
                layout : 'fit',
                height: 70,
                items : [{
                    xtype : 'form',
                    itemId : 'header_stockInCost_form',
                    items : [{
                        xtype : 'fieldcontainer',
                        layout : 'column',
                        items : [ {
                            xtype: 'textfield',
                            fieldLabel: '盘点<font color="red">*</font>',
                            itemId : 'check_checkheader_tf',
                            allowBlank: false,
                            name : 'checkHeader',
                            margin : '5 0 0 15',
                            width : 200,
                            labelWidth: 60
                        }, {
                            xtype: 'datefield',
                            fieldLabel: '日期<font color="red">*</font>',
                            margin : '5 0 0 15',
                            labelWidth: 60,
                            itemId : 'forDate_checkheader_df',
                            name : 'forDate',
                            editable : false,
                            allowBlank: false,
                            width : 200,
                            format : 'Y-m-d',
                            listeners : {
                                afterrender : function(df) {
                                    if(df.getValue() == null) {
                                        df.setValue(new Date());
                                    }
                                }
                            }
                        }, { 
                            xtype: 'textfield',
                            fieldLabel: '编号',
                            itemId : 'code_checkheader_tf',
                            name : 'code',
                            margin : '5 0 0 15',
                            width : 200,
                            labelWidth: 60
                        }]
                    }, {
                        xtype : 'fieldcontainer',
                        layout : 'column',
                        items : [{
                            xtype : 'textfield',//入库单的id
                            itemId : 'id_checkheader',
                            hidden : true,
                            name : 'id'
                        }, { 
                            xtype : 'combobox',
                            width : 200,
                            labelWidth: 60,
                            margin : '5 0 0 15',
                            name : 'manager',
                            valueField : 'name',
                            displayField : 'name',
                            allowBlank: false,
                            itemId : 'Manager_checkheader_cb',
                            store : 'drp.app.store.users.ManagerStore',
                            fieldLabel : '负责人<font color="red">*</font>'
                        }, { 
                            xtype : 'combobox',
                            width : 200,
                            labelWidth: 60,
                            margin : '5 0 0 15',
                            name : 'wareKeeper',
                            valueField : 'name',
                            displayField : 'name',
                            allowBlank: false,
                            itemId : 'WareKeeper_checkheader_cb',
                            store : 'drp.app.store.users.WareKeeperStore',
                            fieldLabel : '库管员<font color="red">*</font>'
                        }, {
                            xtype : 'combobox',
                            width : 200,
                            labelWidth: 60,
                            margin : '5 0 0 15',
                            name : 'regulator',
                            valueField : 'name',
                            displayField : 'name',
                            itemId : 'Regulator_checkheader_cb',
                            store : 'drp.app.store.users.RegulatorStore',
                            fieldLabel : '经手人'
                        }, {
                            xtype : 'button',
                            margin : '5 0 0 65',
                            action : 'confirmCheckInvoiceHeader',
                            icon : 'resources/images/icons/ok.png',
                            text : '确认单据头'
                        }]
                    }]
                }]
            }, 
               {xtype : 'gridpanel',
                region : 'center',
                height : 330,
                autoScroll : true,
                selModel : selModel,
                columnLines : true,
                store : "drp.app.store.projects.check.CheckWareStore",
                columns : [
                    Ext.create('Ext.grid.RowNumberer'),
                {
                    xtype : 'gridcolumn',
                    flex : 2,
                    text : '商品名',
                    dataIndex : 'ware.name'
                }, {
                    xtype : 'gridcolumn',
                    dataIndex : 'wareAmount',
                    flex : 2,
                    text : '库存数'
                }, {
                    xtype : 'gridcolumn',
                    dataIndex : 'checkAmount',
                    flex : 2,
                    text : '盘点数'
                }, {
                    xtype : 'gridcolumn',
                    dataIndex : 'difference',
                    flex : 2,
                    text : '差额'
                }, {
                    xtype : 'gridcolumn',
                    dataIndex : 'weight',
                    flex : 2,
                    text : '比重'
                }
                ],
                dockedItems : [{
                    xtype : 'toolbar',
                    dock : 'top',
                    items : [{
                        xtype : 'button',
                        icon : 'resources/images/icons/add.png',
                        action : 'addWareCheck',
                        itemId : 'addCheckWare_btn',
                        disabled : true,
                        text : '新增',                      
                    }, '-', {                   	
                        xtype : 'button',
                        icon : 'resources/images/icons/delete.png',
                        action : 'deleteWareCheck',
                        itemId : 'deleteStockInCost_btn',
                        disabled : true,
                        text : '删除'
                    }]
                }],

            }, {
                xtype : 'panel',
                region : 'south',
                collapsible : true,
                height : 110,
                layout : 'fit',
                title : '商品信息',
                items : [{
                    xtype : 'form',
                    itemId : 'checkWare_form',
                    items : [{
                        xtype : 'fieldcontainer',
                        layout : 'column',
                        items : [{
                            xtype : 'textfield',
                            hidden : true,
                            name : 'id',
                            itemId : 'id_checkInvoice_tf'//入库单的id
                        }, {
                            xtype : 'textfield',
                            margin : '15 0 0 10',
                            itemId : 'wareName_checkWare_tf',
                            labelWidth : 50,
                            allowBlank : false,
                            readOnly : true,
                            fieldLabel : '名称<font color="red">*</font>'
                        }, {
                            xtype : 'textfield',
                            name : 'wareId',
                            itemId : 'wareId_checkWare_tf',
                            hidden : true
                        }, {
                            xtype : 'button',
                            text : '浏览...',
                            itemId : 'chooseWare_checkWare_btn',
                            disabled : true,
                            action : 'chooseWare',
                            margin : '15 0 0 5'
                        }, {
                            xtype : 'textfield',
                            margin : '15 0 0 15',
                            itemId : 'wareAmount_checkWare_tf',
                            name : 'wareAmount',
                            labelWidth : 50,
                            readOnly : true,
                            fieldLabel : '库存量'
                        }, {
                            xtype : 'numberfield',
                            margin : '15 0 0 15',
                            itemId : 'wareCheckMount_checkWare_tf',
                            labelWidth : 60,
                            name :'checkAmount',
                            allowBlank : false,
                            readOnly : true,
                            fieldLabel : '盘点量<font color="red">*</font>',
                            listeners :{
                            	change: function(field , newValue, oldValue){
                            		var form = field.up('form');
                            		var checkcount = newValue;
                            		var different = checkcount - form.down('#wareAmount_checkWare_tf').getValue();
                            		form.down('#wareDifferent_checkWare_nf').setValue(different);
                            	}
                            },
                        }]
                    }, {
                        xtype : 'fieldcontainer',
                        layout : 'column',
                        items : [{
                            xtype : 'textfield',
                            margin : '5 0 0 10',
                            itemId : 'wareDifferent_checkWare_nf',
                            name : 'difference',
                            labelWidth : 50,
                            readOnly : true,
                            fieldLabel : '差值',
                        },                     
                        {
                            xtype : 'button',
                            formBind : true,
                            text : '确定盘点',
                            itemId: 'addCheck_checkWare_bt',
                            action : 'saveCheckStock',
                            icon : 'resources/images/icons/add2.png',
                            margin : '5 0 0 75'
                        }]
                    }]
                }]
            }]
        });
        me.callParent(arguments);
    }
});