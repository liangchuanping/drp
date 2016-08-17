package com.originspark.drp.controllers.projects.check;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.originspark.drp.controllers.BaseController;
import com.originspark.drp.models.projects.check.CheckInvoice;
import com.originspark.drp.service.projects.check.CheckInvoiceService;
import com.originspark.drp.util.enums.Status;
import com.originspark.drp.util.json.FilterRequest;
import com.originspark.drp.util.json.IdsJson;
import com.originspark.drp.util.json.JsonUtils;

@Controller
@RequestMapping("checkinvoices/in")
public class CheckInvoiceController extends BaseController {
	@RequestMapping(method = RequestMethod.POST)
	@ResponseBody
	public String create(@RequestBody CheckInvoice invoice){
		invoice.setCreatedBy(getCurrentUser().getName());
		CheckInvoice checkInvoice = checkInvoiceService.save(invoice);
		return ok("确定信息成功",checkInvoice.getId());
	}
	
	@RequestMapping(value = "/deleteBatch",method = RequestMethod.GET)
	@ResponseBody
	public String deleteBatch(){
		String data = request().getParameter("data");
		ObjectMapper mapper = new ObjectMapper();
	    IdsJson json = null;
	    try{
	    	json = mapper.readValue(data, IdsJson.class);
	    }catch(Exception e){
	    	return failure("提交数据有误");
	    }
		
	    if(json == null){
	    	return failure("没有需要删除的数据");
	    }
		
	    for(Long id : json.getIds()){
	    	if(id==null)
	    		continue;
	  
	    CheckInvoice checkInvoice = checkInvoiceService.findById(CheckInvoice.class,id);
	    if(checkInvoice != null ){
	    	checkInvoice.setStatus(Status.DESTORYED);
	    	checkInvoiceService.update(checkInvoice);
	    }	
	    }
	    return ok("删除成功");
	}
	

	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	public String list (@RequestParam int start, @RequestParam int limit, @ RequestParam(required = false) Object filter ){
	     List<FilterRequest> filters = new ArrayList<FilterRequest>();
	     
	     if(filter != null){
	    	 filters.addAll(JsonUtils.getListFromJsonArray(filter));
	     }
	     	     
	     List<CheckInvoice> data = checkInvoiceService.pagedDataSet(start, limit, filters);
	     Long count = checkInvoiceService.pagedDataCount(filters);	 
	     return ok(data,count);
	}
	
	
}
