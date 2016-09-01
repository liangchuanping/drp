package com.originspark.drp.controllers.projects.costs;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.originspark.drp.controllers.BaseController;
import com.originspark.drp.models.projects.check.CheckWare;
import com.originspark.drp.models.projects.costs.StockInCost;
import com.originspark.drp.models.projects.invoices.StockInInvoice;
import com.originspark.drp.service.projects.costs.StockInCostService;
import com.originspark.drp.util.json.FilterRequest;
import com.originspark.drp.util.json.JsonUtils;

@Controller
@RequestMapping("stockInCost")
public class StockInCostController extends BaseController{

    @Autowired
    private StockInCostService service;

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public String create(@RequestBody StockInCost stockInCost) {

        StockInInvoice invoiceUI = stockInCost.getInvoice();
        if(invoiceUI == null){
            return failure("所选入库单不能为空");
        }
        CheckWare check= checkWareService.getMostRecentCheckWare(stockInCost.getWare().getId().toString());
        check.setCheckStatus("invalid");
        checkWareService.update(check);
        StockInInvoice invoice = stockInInvoiceService.findById(invoiceUI.getId());
        if(invoice == null){
            return failure("你所选择的入库单不存在，请重新选择");
        }

        //检查该商品是否已经存在 
        boolean have = false;
        for(StockInCost cost : invoice.getCosts()){
            if(cost.getWare().getId() == stockInCost.getWare().getId()){
                have = true;
                break;
            }
        }
        if(have) {
            return failure("抱歉，不能重复添加商品");
        }

        stockInCost.setForDate(invoice.getForDate());
        stockInCost.setCreatedOn(new Date());
        stockInCost.setCreatedBy(getCurrentUser().getName());
        stockInCost.setUpdatedOn(new Date());
        stockInCost.setUpdatedBy(getCurrentUser().getName());
        service.save(stockInCost);
        return ok("创建成功");
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public String delete(@PathVariable Long id) {
        StockInCost stockInCost = service.findById(StockInCost.class, id);
        service.delete(stockInCost);
        return ok("删除成功");
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public String update(@PathVariable Long id, @RequestBody StockInCost stockInCost) {

        StockInCost existingStockInCost = service.findById(StockInCost.class, id);
        if (existingStockInCost == null) {
            return failure("您要更新的记录不存在");
        }

        existingStockInCost.setUnitPrice(stockInCost.getUnitPrice());
        existingStockInCost.setQuantity(stockInCost.getQuantity());
        existingStockInCost.setUpdatedBy(getCurrentUser().getName());
        service.update(existingStockInCost);

        return ok("更新成功");
    }

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public String list(@RequestParam int start, @RequestParam int limit,@RequestParam(required = false) Object filter) {

        List<FilterRequest> filters = new ArrayList<FilterRequest>();

        if (filter != null) {
            filters.addAll(JsonUtils.getListFromJsonArray(filter));
        }

        List<StockInCost> data = service.pagedDataSet(start, limit,filters);
        Long count = service.pagedDataCount(filters);

        return ok(data, count);
    }

}
