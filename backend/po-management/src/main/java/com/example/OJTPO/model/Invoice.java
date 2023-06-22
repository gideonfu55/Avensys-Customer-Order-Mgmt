package com.example.OJTPO.model;

import com.google.cloud.firestore.DocumentReference;

public class Invoice {
    private String id;
    private String invoiceNumber;
    private int amount;
    private DocumentReference purchaseOrderRef;

    // Constructors, getters, and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public DocumentReference getPurchaseOrderRef() {
        return purchaseOrderRef;
    }

    public void setPurchaseOrderRef(DocumentReference purchaseOrderRef) {
        this.purchaseOrderRef = purchaseOrderRef;
    }
}
