Ext.define('drp.app.view.projects.check.CheckWareShowView', {
    extend : 'Ext.window.Window',
    alias : 'widget.checkwareshowview',
    height: 345,
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
        
        Ext.applyIf(me, {

            items : [{//<<<<<<<<<<<<<<<<<<<<入库单-抬头字段
                xtype : 'panel',
                region : 'north',
                layout : 'fit',
                height: 40,
                items : [{
                    xtype : 'form',
                    itemId : 'checkinvoice_form',
                    items : [{
                        xtype : 'fieldcontainer',
                        layout : 'column',
                        items : [{
                            xtype : 'displayfield',
                            margin : '5 0 0 15',
                            labelWidth: 40,
                            name : 'checkHeader',
                            width : 200,
                            fieldLabel : '盘点'
                        }, { 
                            xtype: 'displayfield',
                            fieldLabel: '日期',
                            margin : '5 0 0 15',
                            labelWidth: 40,
                            name : 'forDate',
                            width : 200,
                            format : 'Y-m-d'
                        }, { 
                            xtype: 'displayfield',
                            fieldLabel: '编号',
                            name : 'code',
                            margin : '5 0 0 15',
                            width : 100,
                            labelWidth: 40
                        }]
                    }]
                }]
            }, 
            {//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<入库单-商品列表
                xtype : 'gridpanel',
                region : 'center',
                height : 260,
                autoScroll : true,
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
                    flex : 1,
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
                }]
            }
            ],
            dockedItems : [{//<<<<<<<<<<<<<<<<<<<<<<<<入库单-汇总人员信息
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [{
                    xtype : 'displayfield',
                    flex : 1,
                    margin : '0 0 0 30',
                    labelWidth: 50,
                    itemId : 'managerName_df',
                    fieldLabel : '负责人'
                }, {
                    xtype : 'displayfield',
                    flex : 1,
                    labelWidth: 50,
                    itemId : 'wareKeeperName_df',
                    fieldLabel : '库管员'
                }, {
                    xtype : 'displayfield',
                    flex : 1,
                    labelWidth: 60,
                    itemId : 'regulatorName_df',
                    fieldLabel : '经手人'
                }]
            }]
        });
        me.callParent(arguments);
    }
});