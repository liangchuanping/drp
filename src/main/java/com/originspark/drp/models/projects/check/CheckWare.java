package com.originspark.drp.models.projects.check;

import java.math.BigDecimal;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.xml.crypto.Data;

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
	
    @Temporal(TemporalType.DATE)
    private Date forDate;
    
	@Column(precision = 15, scale = 2, nullable = false)
	private BigDecimal wareAmount = BigDecimal.ZERO;
	
	@Column(precision = 15, scale = 2, nullable = false)
	private BigDecimal checkAmount = BigDecimal.ZERO;
	
	@Column(precision = 15, scale = 2, nullable = false)
	private BigDecimal difference = BigDecimal.ZERO;
	
	@JsonIgnore
	@Column (nullable = false)
	private String weight;
	
	public static enum COLUMNS{
		INVOICE
	}
	
	public CheckInvoice getCheckInvoice(){
		return invoice;
	}
	
	public void setCheckInvoice(CheckInvoice invoice){
		this.invoice = invoice;
	}
	
	public Ware getWare(){
		return ware;
	}
	
	public void setWare(Ware ware){
		this.ware = ware;
	} 
	
	public CheckInvoice getInvoice(){
		return invoice;
	}
	
	public void setForDate(Date date){
		this.forDate = date;
	}
	
	public Date getForDate(){
		return forDate;
	}
	
    public BigDecimal getCheckAmount(){
    	return checkAmount;
    }
    
	 public void setCheckAmount(BigDecimal checkAmount){
	    	this.checkAmount = checkAmount;
	 }
	
	public String getWeight(){
		Double weight1 = difference.doubleValue()/wareAmount.doubleValue();
		DecimalFormat decimalFormat = new DecimalFormat("###.00");  
	    Double weight2 = weight1 * 100;
	    String weight3 = decimalFormat.format(weight2);
	    return weight3 + "%";
	}
	
	public void setWeight(String weight){
		this.weight = weight;
	}

}
