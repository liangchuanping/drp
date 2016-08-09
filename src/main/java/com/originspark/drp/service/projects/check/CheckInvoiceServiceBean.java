package com.originspark.drp.service.projects.check;

import java.util.ArrayList;
import java.util.Date;
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
import com.originspark.drp.models.projects.check.CheckInvoice;
import com.originspark.drp.models.projects.check.CheckWare;
import com.originspark.drp.models.projects.check.CheckInvoice.COLUMNS;
import com.originspark.drp.util.StringUtil;
import com.originspark.drp.util.json.FilterRequest;

@Transactional
@Service
public class CheckInvoiceServiceBean extends BaseDAOSupport<CheckInvoice> implements CheckInvoiceService{
    @Override
    
    public List<CheckInvoice> pagedDataSet(int start, int limit, List<FilterRequest> filters){
    	CriteriaBuilder cb = em.getCriteriaBuilder();
    	CriteriaQuery<CheckInvoice> dataQuery =  cb.createQuery(CheckInvoice.class);        
    	Root<CheckInvoice> checkInvoice = dataQuery.from(CheckInvoice.class);   
    	dataQuery.select(checkInvoice);   	
        CheckWare[] checkWare = findByWareName(filters);  //convert String name to CheckWare checkWare; which used for later filter because the CheckInvoice contains class CheckWare.class.
        if(checkWare == null){
        	return null;
        }
        
        List<Predicate[]> predicates = toPerdicate(cb, checkInvoice, filters, checkWare);        
        if(predicates != null){
        	Predicate[] andPredicates = predicates.get(0);
        	Predicate[] orPredicates = predicates.get(1);
        	
        	if(andPredicates.length !=0 && orPredicates.length == 0 ){
        		dataQuery.where(cb.and(andPredicates));
        	}else if(andPredicates.length == 0 && orPredicates.length != 0){
        		dataQuery.where(cb.or(orPredicates));
        	}else{
        		dataQuery.where(cb.and(andPredicates), cb.or(orPredicates));
        	}
        }
        
        dataQuery.orderBy(cb.asc(checkInvoice.get("status")), cb.desc(checkInvoice.get("forDate")), cb.desc(checkInvoice.get("id")) );
        TypedQuery<CheckInvoice> resultQuery = em.createQuery(dataQuery);
        return resultQuery.setFirstResult(start).setMaxResults(limit).getResultList();
    }

    
	@Override
	public Long pagedDataCount(List<FilterRequest> filters) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
		Root<CheckInvoice> checkInvoice = countQuery.from(CheckInvoice.class);
		countQuery.select(cb.count(checkInvoice));
		CheckWare[] check = findByWareName(filters);
		if(check.length == 0){
			return null;
		}
		
		List<Predicate[]>  predicates = toPerdicate(cb, checkInvoice, filters, check);
		if(predicates != null){
			Predicate[] andPredicates = predicates.get(0);
			Predicate[] orPredicates = predicates.get(1);
			
			if(andPredicates.length !=0 && orPredicates.length ==0){
				countQuery.where(cb.and(andPredicates));				
			}else if(andPredicates.length == 0 && orPredicates.length != 0){
				countQuery.where(cb.or(orPredicates));
			}else{
				countQuery.where(cb.and(andPredicates), cb.or(orPredicates));
			}
		}			
		return em.createQuery(countQuery).getSingleResult();
	}
    
    public static List<Predicate[]> toPerdicate(CriteriaBuilder cb, Root<CheckInvoice> wareRoot,
        	List<FilterRequest> filters, CheckWare...wares){
    	List<Predicate> andCriteria =new ArrayList<Predicate>();
    	List<Predicate>  orCriteria = new ArrayList<Predicate>();   	
    	try{
    		for(FilterRequest filter :filters){
    			COLUMNS column = COLUMNS.valueOf(filter.getProperty().toUpperCase());
    		    String value = filter.getValue();
    		    
    		    switch(column){
    		    case STARTDATE:
    		    	if (value != null && !value.equals(" "));{
    		    	Date startDate = StringUtil.String2Date(value);
    		    	andCriteria.add(cb.greaterThanOrEqualTo(wareRoot.<Date>get("forDate"), startDate));
    		        }
    		    break;  
 		    
    		    case ENDDATE: 
    		        if(value != null && ! value.equals(" ")){
    		    	Date endDate = StringUtil.String2Date(value);
    		    	andCriteria.add(cb.lessThanOrEqualTo(wareRoot.<Date>get("forDate"), endDate));    		    	
    		        }
    		        break;   		        
    		    case REGULATORNAME: 
    		    	if(value != null && ! value.equals(" ")){
    		    	andCriteria.add(cb.like(wareRoot.<String>get("regulator"), value));
    		    	}   		     		    	
    		    	break;
    		    	
    		    case WAREKEEPERNAME:
    		    	if(value != null && !value.equals(" ")){
    		    	andCriteria.add(cb.like(wareRoot.<String>get("wareKeeper"), value));
    		    	}
    		    	break;
    		    	
    		    case MANAGERNAME: 
    		    	if(value != null && !value.equals(" ")){
    		    	andCriteria.add(cb.like(wareRoot.<String>get("manager"), value));
    		    	}
    		    	break;
    		    case WARENAME:
    		    	// If Invoice contains one of the ware, we will show the Invoice
    		    	if(value != null && !value.equals(" ")){
    		    	for(int i = 0; i < wares.length; i++){
    		    		orCriteria.add(cb.isMember(wares[i], wareRoot.<List<CheckWare>>get("wareCheck")));    		    		
    		    	}
    		    	}
    		    break;   		        
    		    default:
    		    break;
    		}	
    	 }
    	}	catch(Exception e){
    		e.printStackTrace();
    	}
    	    	
    	if(andCriteria.isEmpty() && orCriteria.isEmpty()){
    		return null;
    	}else{
    		List<Predicate[]> creteria = new ArrayList<Predicate[]>();
    		creteria.add(andCriteria.toArray(new Predicate[0]));
    		creteria.add(orCriteria.toArray(new Predicate[0]));
    		return creteria;
    	}	   
    }
    
    


	@Override
	public Map<String, String> validate() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public CheckInvoice findById(Long id) {
		return em.find(CheckInvoice.class, "id");
	}
    
    private CheckWare[] findByWareName(List<FilterRequest> filters){
    	for(FilterRequest filter : filters){
    		COLUMNS column = COLUMNS.valueOf(filter.getProperty().toUpperCase());
    		String value = filter.getValue();
    		if(column == COLUMNS.WARENAME){
    			TypedQuery<CheckWare> query = em.createQuery("from CheckWare warecheck where warecheck.ware.name like: name", CheckWare.class);
    			query.setParameter("name", "%" +value + "%");
    			List<CheckWare>  checkWare = query.getResultList(); 
    			if(checkWare.isEmpty()){
    				return null;
    			}
    			return checkWare.toArray(new CheckWare[0]);
    		}
    	}
    	return new CheckWare[0];
    }
}
