package com.originspark.drp.models.projects.check;

import java.math.BigDecimal;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.text.DecimalFormat;
import com.originspark.drp.models.AbstractModel;

@Entity
@Table(name = "ware_check")
public class CheckWare extends AbstractModel{
    
	@ManyToOne
	private CheckInvoice invoice;
	
	@Column(precision = 15, scale = 2, nullable = false)
	private BigDecimal wareAmount = BigDecimal.ZERO;
	
	@Column(precision = 15, scale = 2, nullable = false)
	private BigDecimal checkAmount = BigDecimal.ZERO;
	
	@Column(precision = 15, scale = 2, nullable = false)
	private BigDecimal difference = BigDecimal.ZERO;
	
	@Column (nullable = false)
	private String weight;
	
	public CheckInvoice getInvoice(){
		return invoice;
	}
	
	public void setInvoice(CheckInvoice invoice){
		this.invoice = invoice;
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
