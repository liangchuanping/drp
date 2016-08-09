package com.originspark.drp.models.projects.check;

import com.originspark.drp.models.AbstractModel;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.originspark.drp.models.projects.check.CheckWare;

@Entity
@Table(name = "invoice_check")
public class CheckInvoice extends AbstractModel{
    
	
	@JsonIgnore
	@OneToMany(mappedBy = "invoice")
	private List<CheckWare> wareCheck;
	
	@Temporal(TemporalType.DATE)
	
	private Date forDate;
	
	private String code;
	
	private String checkHeader;
	
	private String manager;
	
	private String wareKeeper;
	
	private String regulator;
	
	public static enum COLUMNS{
		 STARTDATE,ENDDATE,WARENAME,
	     REGULATORNAME,WAREKEEPERNAME,MANAGERNAME
	}	
	
	public List<CheckWare>  getWareCheck(){
		return wareCheck;
	}
	
	public void  setWareCheck(List<CheckWare> wareCheck){
		this.wareCheck = wareCheck;
	}

	public String getManager() {
		return manager;
	}

	public void setManager(String manager) {
		this.manager = manager;
	}

	public String getWareKeeper() {
		return wareKeeper;
	}

	public void setWareKeeper(String wareKeeper) {
		this.wareKeeper = wareKeeper;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getRegulator() {
		return regulator;
	}

	public void setRegulator(String regulator) {
		this.regulator = regulator;
	}
	
    public Date getForDate() {
        return forDate;
    }

    public void setForDate(Date forDate) {
        this.forDate = forDate;
    }

	public String getCheckHeader() {
		return checkHeader;
	}

	public void setCheckHeader(String checkHeader) {
		this.checkHeader = checkHeader;
	}	
	
}
