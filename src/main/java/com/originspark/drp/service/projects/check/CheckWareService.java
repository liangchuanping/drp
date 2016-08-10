package com.originspark.drp.service.projects.check;

import java.util.List;
import java.util.Map;

import com.originspark.drp.dao.BaseDAO;
import com.originspark.drp.models.projects.check.CheckWare;
import com.originspark.drp.util.json.FilterRequest;

public interface CheckWareService  extends BaseDAO<CheckWare>{
   List<CheckWare> pagedDataSet(int start, int limit, List<FilterRequest> filters);
   Long pageDataCount(List<FilterRequest> filters);
   Map<String, String> validate();
}
