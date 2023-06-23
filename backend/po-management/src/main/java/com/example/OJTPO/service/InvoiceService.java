package com.example.OJTPO.service;

import com.example.OJTPO.firebase.FirebaseService;
import com.example.OJTPO.model.Invoice;
import com.google.firebase.database.*;

import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InvoiceService {

    @Autowired
    private FirebaseService firebaseService;

    public CompletableFuture<Invoice> createInvoice(Invoice invoice) {
        return firebaseService.createInvoice(invoice);
    }

    public CompletableFuture<Invoice> updateInvoice(Invoice invoice, String id) {
        return firebaseService.updateInvoice(invoice, id);
    }

    public CompletableFuture<Invoice> getInvoiceById(String id) {
        return firebaseService.getInvoiceById(id);
    }

    public CompletableFuture<Invoice> deleteInvoice(String id) {
        return firebaseService.deleteInvoice(id);
    }
}