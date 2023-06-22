package com.example.OJTPO.model;

import com.google.cloud.firestore.DocumentReference;

public class Invoice {
    private int id;
    private String invoiceNumber;
    private int amount;
    private int purchaseOrderRef;
    // private DocumentReference purchaseOrderRef;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public int getPurchaseOrderRef() {
        return purchaseOrderRef;
    }

    public void setPurchaseOrderRef(int purchaseOrderRef) {
        this.purchaseOrderRef = purchaseOrderRef;
    }

    // public DocumentReference getPurchaseOrderRef() {
    //     return purchaseOrderRef;
    // }

    // public void setPurchaseOrderRef(DocumentReference purchaseOrderRef) {
    //     this.purchaseOrderRef = purchaseOrderRef;
    // }
}
