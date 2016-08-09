package com.originspark.drp.service.projects.check;

import java.util.List;
import java.util.Map;
import com.originspark.drp.dao.BaseDAO;
import com.originspark.drp.models.projects.check.CheckInvoice;
import com.originspark.drp.util.json.FilterRequest;

public interface CheckInvoiceService extends BaseDAO<CheckInvoice>{
    List<CheckInvoice> pagedDataSet(int start, int limit, List<FilterRequest> filters);
    
    Long pagedDataCount(List<FilterRequest> filters);
    
    Map<String, String> validate();
    
    CheckInvoice findById(Long id);
}
