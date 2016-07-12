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
	
	private String check;
	
	@Temporal(TemporalType.DATE)
	private Date forData;
	
	private String code;
	
	private String manager;
	
	private String wareKeeper;
	
	private String regulator;
	
	
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

	public String getCheck() {
		return check;
	}

	public void setCheck(String check) {
		this.check = check;
	}

	public String getRegulator() {
		return regulator;
	}

	public void setRegulator(String regulator) {
		this.regulator = regulator;
	}
	
		
	
}
