package com.originspark.drp.service.projects.check;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.originspark.drp.dao.BaseDAOSupport;
import com.originspark.drp.models.projects.check.CheckWare;
import com.originspark.drp.models.projects.check.CheckWare.COLUMNS;
import com.originspark.drp.util.json.FilterRequest;

@Transactional
@Service
public class CheckWareServiceBean  extends BaseDAOSupport<CheckWare> implements CheckWareService{

	@Override
	public List<CheckWare> pagedDataSet(int start, int limit, List<FilterRequest> filters) {
	     CriteriaBuilder cb = em.getCriteriaBuilder();
	     CriteriaQuery<CheckWare> dataQuery = cb.createQuery(CheckWare.class);
	     Root<CheckWare>  checkWare = dataQuery.from(CheckWare.class);
	     dataQuery.select(checkWare);
	     
	     Predicate[] predicates = toPredicate(cb, checkWare, filters);
	     
	     if(predicates != null){
	    	 dataQuery.where(cb.and(predicates));
	     }
	     dataQuery.orderBy(cb.desc(checkWare.get("id")));
	     
	     return em.createQuery(dataQuery).setFirstResult(start).setMaxResults(limit).getResultList();
	}

	@Override
	public Long pageDataCount(List<FilterRequest> filters) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<CheckWare> checkWare = countQuery.from(CheckWare.class);
		countQuery.select(cb.count(checkWare));
		
		Predicate[] predicates = toPredicate(cb, checkWare, filters);		
		if(predicates != null){
		countQuery.where(predicates);
		}
		return em.createQuery(countQuery).getSingleResult();
	}

	@Override
	public Map<String, String> validate() {
		// TODO Auto-generated method stub
		return null;
	}

	
	public Predicate[]  toPredicate(CriteriaBuilder cb, Root<CheckWare> checkWare, List<FilterRequest> filters ){
		List<Predicate> criteria = new ArrayList<Predicate>();		
		try{
			for(FilterRequest filter : filters){
			  COLUMNS column = 	COLUMNS.valueOf(filter.getProperty().toUpperCase());
			  String value = filter.getValue();
			  
			  switch(column){
			  case INVOICE:
			        if(value != null && !value.equals("")){
			        	criteria.add(cb.equal( checkWare.get("invoice").<Long>get("id"),Long.parseLong(value)));
			        }
			   break;
			  }
			}	
		}catch(Exception ex){
			ex.printStackTrace();
		}
		
		if(criteria.size() == 0){
			return null;
		}else{
			Predicate[] predicates = new Predicate[criteria.size()];
			predicates = criteria.toArray(predicates);
			return predicates;
		}
		
		
	}

	public CheckWare getMostRecentCheckWare(String wareId){
		String recentMostCheckWare_SQL = "Select checkWare FROM CheckWare checkWare where checkWare.ware = "+ wareId +"ORDER BY checkWare.updatedOn DESC";
		TypedQuery<CheckWare> checkWare = em.createQuery(recentMostCheckWare_SQL, CheckWare.class);
		List<CheckWare> result = checkWare.getResultList();
		return result.get(0);		
	}
   
}
