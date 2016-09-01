package com.originspark.drp.service.projects.inventories;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Query;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.originspark.drp.dao.BaseDAOSupport;
import com.originspark.drp.web.models.projects.inventories.CurrentInventoryUI;

@SuppressWarnings("rawtypes")
@Transactional
@Service
public class InventoryServiceBean extends BaseDAOSupport implements InventoryService {

    // 实时入库量统计
    final String CURRENT_IN_SQL = "(SELECT DISTINCT(ware) as wid, sum(quantity) as incount, SUM(total) as outcome FROM cost_stock_in GROUP BY ware) as t1";
    // 实时出库量统计
    final String CURRENT_OUT_SQL = "(SELECT DISTINCT(ware) as wid1, sum(quantity) as outcount, SUM(total) as income FROM cost_stock_out GROUP BY ware) as t2";
    // 实时库存量统计
    final String CURRENT_SUM_SQL = "SELECT  t5.name, t5.model, t5.unit, t5.brand, t3.outcome, t3.incount, t3.income, t3.outcount, t4.check_amount, t4.check_status  FROM (SELECT* FROM"+
    		CURRENT_IN_SQL+
 " LEFT JOIN "+
 CURRENT_OUT_SQL+
" ON t1.wid = t2.wid1) as t3"+

" LEFT JOIN"+

"(SELECT ware, check_amount, check_status FROM (SELECT * FROM ware_check ORDER BY updated_on DESC) as t41 GROUP BY ware) as t4"+

 " ON t3.wid = t4.ware"+

" JOIN wares as t5"+

" where t5.id = t3.wid"+

" ORDER BY t3.income - t3.outcome DESC"
;
    // 实时库存量总数计算
    final String CURRENT_COUNT = "SELECT COUNT(DISTINCT(ware)) FROM cost_stock_in";

   //SELECT ware, check_amount, status as check_status FROM ware_check GROUP BY ware ORDER BY updated_on DESC  

    @SuppressWarnings("unchecked")
    @Override
    public List<CurrentInventoryUI> pagedCurrentInventories(int start, int limit) {
        Query query = em.createNativeQuery(CURRENT_SUM_SQL);
        List<Object[]> res;
        if (start >= 0 && limit > 0) {
            res = query.setFirstResult(start).setMaxResults(limit).getResultList();
        } else {
            res = query.getResultList();
        }
        List<CurrentInventoryUI> currentInventories = new ArrayList<CurrentInventoryUI>();

        Object[] objAry;
        for (int i = 0, length = res.size(); i < length; i++) {
            CurrentInventoryUI inventory = new CurrentInventoryUI();
            objAry = res.get(i);
            inventory.setName(objAry[0] + "");
            inventory.setModel(objAry[1] + "");
            inventory.setUnit(objAry[2] + "");
            inventory.setBrand(objAry[3] + "");
            inventory.setOutcome(objAry[4] == null ? BigDecimal.ZERO : (BigDecimal) objAry[4]);
            inventory.setIncount(objAry[5] == null ? 0L : ((BigDecimal) objAry[5]).longValue());
            inventory.setIncome(objAry[6] == null ? BigDecimal.ZERO : (BigDecimal) objAry[6]);
            inventory.setOutcount(objAry[7] == null ? 0L : ((BigDecimal) objAry[7]).longValue());
                                
            if(objAry[9].equals("valid")){
            	inventory.setCheckcount(objAry[8] == null ? "0" : objAry[8].toString());        
            }else
            {
            	inventory.setCheckcount("最近未盘点");
            }
            currentInventories.add(inventory);
        }

        return currentInventories;
    }

    @Override
    public Long pagedCurrentInventoriesCount() {
        Query query = em.createNativeQuery(CURRENT_COUNT);
        BigInteger count = (BigInteger) query.getSingleResult();
        return count.longValue();
    }

}
