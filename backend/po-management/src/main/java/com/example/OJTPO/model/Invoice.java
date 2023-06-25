package com.example.OJTPO.model;

// import com.google.cloud.firestore.DocumentReference;

public class Invoice {
    private Long id;
    private String invoiceNumber;
    private double amount;
    private double purchaseOrderRef;
    // private DocumentReference purchaseOrderRef;

    public Invoice() {
    }

    public Invoice(Long id, String invoiceNumber, double amount, double purchaseOrderRef) {
        this.id = id;
        this.invoiceNumber = invoiceNumber;
        this.amount = amount;
        this.purchaseOrderRef = purchaseOrderRef;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public double getPurchaseOrderRef() {
        return purchaseOrderRef;
    }

    public void setPurchaseOrderRef(double purchaseOrderRef) {
        this.purchaseOrderRef = purchaseOrderRef;
    }

    // public DocumentReference getPurchaseOrderRef() {
    // return purchaseOrderRef;
    // }

    // public void setPurchaseOrderRef(DocumentReference purchaseOrderRef) {
    // this.purchaseOrderRef = purchaseOrderRef;
    // }

    public void updateWith(Invoice newInvoice) {
        this.invoiceNumber = newInvoice.invoiceNumber != null ? newInvoice.invoiceNumber : this.invoiceNumber;
        this.amount = newInvoice.amount != 0 ? newInvoice.amount : this.amount;
        this.purchaseOrderRef = newInvoice.purchaseOrderRef != 0 ? newInvoice.purchaseOrderRef : this.purchaseOrderRef;
    }
}
