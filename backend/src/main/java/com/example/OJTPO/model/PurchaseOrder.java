package com.example.OJTPO.model;

public class PurchaseOrder {

  private Long id;
  private String poNumber;
  private String prjNumber;
  private String clientName;
  private String startDate;
  private String endDate;
  private double totalValue;
  private double balValue;
  private String milestone;
  private String type;
  private String status;
  private String fileUrl;

  public PurchaseOrder() {
  }

  public PurchaseOrder(String poNumber, String prjNumber, String clientName, String startDate, String endDate, double totalValue, double balValue, String milestone, String type, String status) {
    this.poNumber = poNumber;
    this.prjNumber = prjNumber;
    this.clientName = clientName;
    this.startDate = startDate;
    this.endDate = endDate;
    this.totalValue = totalValue;
    this.balValue = balValue;
    this.milestone = milestone;
    this.type = type;
    this.status = status;
  }

  public Long getId() {
    return this.id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getPoNumber() {
    return this.poNumber;
  }

  public void setPoNumber(String poNumber) {
    this.poNumber = poNumber;
  }

  public String getPrjNumber() {
    return prjNumber;
  }

  public void setPrjNumber(String prjNumber) {
    this.prjNumber = prjNumber;
  }

  public String getClientName() {
    return this.clientName;
  }

  public void setClientName(String clientName) {
    this.clientName = clientName;
  }

  public String getStartDate() {
    return this.startDate;
  }

  public void setStartDate(String startDate) {
    this.startDate = startDate;
  }

  public String getEndDate() {
    return this.endDate;
  }

  public void setEndDate(String endDate) {
    this.endDate = endDate;
  }

  public double getTotalValue() {
    return this.totalValue;
  }

  public void setTotalValue(double totalValue) {
    this.totalValue = totalValue;
  }

  public double getBalValue() {
    return this.balValue;
  }

  public void setBalValue(double balValue) {
    this.balValue = balValue;
  }

  public String getMilestone() {
    return this.milestone;
  }

  public void setMilestone(String milestone) {
    this.milestone = milestone;
  }

  public String getType() {
    return this.type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getStatus() {
    return this.status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getFileUrl() {
    return fileUrl;
  }

  public void setFileUrl(String fileUrl) {
    this.fileUrl = fileUrl;
  }

  public void updateWith(PurchaseOrder newPurchaseOrder) {
    this.clientName = newPurchaseOrder.clientName != null ? newPurchaseOrder.clientName : this.clientName;
    this.poNumber = newPurchaseOrder.poNumber != null ? newPurchaseOrder.poNumber : this.poNumber;
    this.prjNumber= newPurchaseOrder.prjNumber != null ? newPurchaseOrder.prjNumber : this.prjNumber;
    this.startDate = newPurchaseOrder.startDate != null ? newPurchaseOrder.startDate : this.startDate;
    this.endDate = newPurchaseOrder.endDate != null ? newPurchaseOrder.endDate : this.endDate;
    this.totalValue = newPurchaseOrder.totalValue != 0 ? newPurchaseOrder.totalValue : this.totalValue;
    this.balValue = newPurchaseOrder.balValue >= 0 ? newPurchaseOrder.balValue : this.balValue;
    this.milestone = newPurchaseOrder.milestone != null ? newPurchaseOrder.milestone : this.milestone;
    this.type = newPurchaseOrder.type != null ? newPurchaseOrder.type : this.type;
    this.status = newPurchaseOrder.status != null ? newPurchaseOrder.status : this.status;
  }
  
}
