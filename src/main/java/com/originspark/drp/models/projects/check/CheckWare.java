package com.originspark.drp.models.projects.check;

import java.math.BigDecimal;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import java.text.DecimalFormat;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.originspark.drp.models.AbstractModel;
import com.originspark.drp.models.resources.Ware;

@Entity
@Table(name = "ware_check")
public class CheckWare extends AbstractModel{
    
	@ManyToOne
	private CheckInvoice invoice;
	
	@ManyToOne
	private Ware ware;
    
	private String wareAmount;
	
	private String checkStatus;
	@Column(precision = 15, scale = 2, nullable = false)
	private BigDecimal checkAmount = BigDecimal.ZERO;
	
	private String difference;
	
	private String weight;
	
	
	public String getCheckStatus(){
		return this.checkStatus;
	}
	
	public void setCheckStatus(String checkStatus){
		this.checkStatus = checkStatus;
	}
	
	public String getDifference(){
		return this.difference;
	}
	
	public void setDifference(String difference){
		this.difference = difference;
	}
	
	public static enum COLUMNS{
		INVOICE
	}
	
	public String getWareAmount(){
		return wareAmount;
	}
	
	public void setWareAmount(String wareAmount){
		this.wareAmount = wareAmount;
	}
	
	public CheckInvoice getInvoice(){
		return invoice;
	}
	
	public void setInvoice(CheckInvoice invoice){
		this.invoice = invoice;
	}
	
	public Ware getWare(){
		return ware;
	}
	
	public void setWare(Ware ware){
		this.ware = ware;
	} 
	
    public BigDecimal getCheckAmount(){
    	return checkAmount;
    }
    
	 public void setCheckAmount(BigDecimal checkAmount){
		 if(checkAmount == null){
	            this.checkAmount = BigDecimal.ZERO;
	        }
	    	this.checkAmount = checkAmount;
	 }
	
	public String getWeight(){
		  	  return weight;
	}
	
	public void setWeight(String weight){
		  if(!wareAmount.equals("0")){
	      Double weight1 = Double.valueOf(difference)/Double.valueOf(wareAmount);
		  DecimalFormat decimalFormat = new DecimalFormat("##0.00");  
		  Double weight2 = weight1 * 100;
		  this.weight = decimalFormat.format(weight2).toString()+"%";}
		  else{
			  this.weight =  "NA";
		  }
	}
	
}
