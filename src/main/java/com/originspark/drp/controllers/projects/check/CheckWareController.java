package com.originspark.drp.controllers.projects.check;

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
import com.originspark.drp.models.projects.check.CheckInvoice;
import com.originspark.drp.models.projects.check.CheckWare;
import com.originspark.drp.service.projects.check.CheckWareService;
import com.originspark.drp.util.enums.CheckStatus;
import com.originspark.drp.util.json.FilterRequest;
import com.originspark.drp.util.json.JsonUtils;

@Controller
@RequestMapping("checkware/in")
public class CheckWareController extends BaseController{    

	
	@RequestMapping( method = RequestMethod.POST)
	@ResponseBody
	public String create(@RequestBody CheckWare checkWare){
		
      CheckInvoice checkInvoice = checkWare.getInvoice();
      
      if(checkInvoice == null){
    	   return failure("所选入库单不为空");
      }
      
      CheckInvoice invoice = checkInvoiceService.findById(checkInvoice.getId());
      if(invoice == null){
    	  return failure("你所选择的入库单 不存在，请重新选择");
      }
      
      boolean have = false;
      
      for(CheckWare check : invoice.getWareCheck()){
    	  if(check.getWare().getId() == checkWare.getWare().getId()){
    		  have = true;
    		  break;
    	  }
      }
      
      if(have){
    	  return failure("抱歉。不能重复添加商品");
      }
      
    //  checkWare.setForDate(invoice.getForDate());
      checkWare.setCreatedOn(new Date());
      checkWare.setCreatedBy(getCurrentUser().getName());
      checkWare.setUpdatedOn(new Date());
      checkWare.setUpdatedBy(getCurrentUser().getName());
      checkWare.setCheckStatus(CheckStatus.valid);
      checkWareService.save(checkWare);
      return ok("创建成功");
	}
	
	@RequestMapping(value = "/{id}", method =RequestMethod.DELETE)
	@ResponseBody
	public String delete(@PathVariable Long id ){
		CheckWare checkWare = checkWareService.findById(CheckWare.class, id);
		checkWareService.delete(checkWare);
		return ok("删除成功");
		}
	
	@RequestMapping(value = "/{id}" , method = RequestMethod.PUT)
	@ResponseBody
	public String updata(@PathVariable Long id, @RequestBody CheckWare checkWare){
		CheckWare existingCheckWare = checkWareService.findById(CheckWare.class, id);
		 if (existingCheckWare == null) {
	            return failure("您要更新的记录不存在");
	        }
		 existingCheckWare.setCheckAmount(checkWare.getCheckAmount());
		 return ok("更新成功");
		}
	

@RequestMapping(method = RequestMethod.GET)
@ResponseBody
public String list(@RequestParam int start, @RequestParam int limit, @RequestParam(required = false) Object filter){
	List<FilterRequest> filters = new ArrayList<FilterRequest>();
	
	if(filter != null){
		filters.addAll(JsonUtils.getListFromJsonArray(filter));
	}
	
	List<CheckWare> data = checkWareService.pagedDataSet(start, limit, filters);
	Long count = checkWareService.pageDataCount(filters);
	
	return ok(data, count);	
}
}