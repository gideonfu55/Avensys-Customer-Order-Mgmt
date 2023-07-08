package com.example.OJTPO.model;

import org.springframework.web.multipart.MultipartFile;

public class PurchaseOrderRequest {
  
  private PurchaseOrder purchaseOrder;
  private MultipartFile file;

  public PurchaseOrderRequest() {
  }

  public PurchaseOrderRequest(PurchaseOrder purchaseOrder, MultipartFile file) {
    this.purchaseOrder = purchaseOrder;
    this.file = file;
  }

  public PurchaseOrder getPurchaseOrder() {
    return this.purchaseOrder;
  }

  public void setPurchaseOrder(PurchaseOrder purchaseOrder) {
    this.purchaseOrder = purchaseOrder;
  }

  public MultipartFile getFile() {
    return this.file;
  }

  public void setFile(MultipartFile file) {
    this.file = file;
  }

}
