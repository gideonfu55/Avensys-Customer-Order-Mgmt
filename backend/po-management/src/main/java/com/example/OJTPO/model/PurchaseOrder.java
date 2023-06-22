package com.example.OJTPO.model;

public class PurchaseOrder {

  private Long id;
  private String vendorName;

  // @JsonSerialize(using = CustomLocalDateSerializer.class)
  private String startDate;

  // @JsonSerialize(using = CustomLocalDateSerializer.class)
  private String endDate;
  
  private double totalValue;
  private double balValue;
  private String milestone;
  private String type;
  private String status;

  public PurchaseOrder() {
  }

  public PurchaseOrder(Long id, String vendorName, String startDate, String endDate, double totalValue, double balValue, String milestone, String type, String status) {
    this.id = id;
    this.vendorName = vendorName;
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

  public String getVendorName() {
    return this.vendorName;
  }

  public void setVendorName(String vendorName) {
    this.vendorName = vendorName;
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
  
}
