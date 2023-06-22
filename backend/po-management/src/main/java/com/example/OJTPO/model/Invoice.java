package com.example.OJTPO.model;

<<<<<<< HEAD
import java.sql.Timestamp;

=======
>>>>>>> 769f0af95eeda2abe1140d25078a2a00eb83d546
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
<<<<<<< HEAD
@Table(name = "Invoice")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
=======
@Table(name = "Invoices")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
>>>>>>> 769f0af95eeda2abe1140d25078a2a00eb83d546
    private int id;

    @Column(name = "invoiceNumber", nullable = false)
    private String invoiceNumber;

    @Column(name = "amount", nullable = false)
    private int amount;

<<<<<<< HEAD
    

    // Getter and Setter methods
=======
    @ManyToOne
    @JoinColumn(name = "poNumber")
    private PurchaseOrder purchaseOrder;

    // Getters and setters

>>>>>>> 769f0af95eeda2abe1140d25078a2a00eb83d546
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

<<<<<<< HEAD
    public void setPassword(int amount) {
        this.amount = amount;
    }
}
=======
    public void setAmount(int amount) {
        this.amount = amount;
    }

    public PurchaseOrder getPurchaseOrder() {
        return purchaseOrder;
    }

    public void setPurchaseOrder(PurchaseOrder purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
    }
}
>>>>>>> 769f0af95eeda2abe1140d25078a2a00eb83d546
