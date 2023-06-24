package com.example.OJTPO.model;

// import com.google.cloud.firestore.DocumentReference;

public class Invoice {
    private Long id;
    private String invoiceNumber;
    private double amount;
    private String purchaseOrderRef;
    private String dateBilled;
    private String dueDate;
    private String status;
    // private DocumentReference purchaseOrderRef;

    public Invoice() {
    }

    public Invoice(Long id, String invoiceNumber, double amount, String purchaseOrderRef, String dateBilled, String dueDate, String status) {
        this.id = id;
        this.invoiceNumber = invoiceNumber;
        this.amount = amount;
        this.purchaseOrderRef = purchaseOrderRef;
        this.dateBilled = dateBilled;
        this.dueDate = dueDate;
        this.status = status;
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

    public String getPurchaseOrderRef() {
        return purchaseOrderRef;
    }

    public void setPurchaseOrderRef(String purchaseOrderRef) {
        this.purchaseOrderRef = purchaseOrderRef;
    }

    public String getDateBilled() {
        return this.dateBilled;
    }

    public void setDateBilled(String dateBilled) {
        this.dateBilled = dateBilled;
    }

    public String getDueDate() {
        return this.dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
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
        this.purchaseOrderRef = newInvoice.purchaseOrderRef != null ? newInvoice.purchaseOrderRef : this.purchaseOrderRef;
        this.dateBilled = newInvoice.dateBilled != null ? newInvoice.dateBilled : this.dateBilled;
        this.dueDate = newInvoice.dueDate != null ? newInvoice.dueDate : this.dueDate;
        this.status = newInvoice.status != null ? newInvoice.status : this.status;
    }
}
