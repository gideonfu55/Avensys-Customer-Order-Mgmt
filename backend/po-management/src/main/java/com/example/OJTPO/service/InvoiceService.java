package com.example.OJTPO.service;

import com.example.OJTPO.firebase.FirebaseService;
import com.example.OJTPO.model.Invoice;
import com.google.firebase.database.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InvoiceService {

    @Autowired
    private FirebaseService firebaseService;

    public void saveInvoice(Invoice invoice) {
        firebaseService.saveInvoice(invoice);
    }

    public void updateInvoice(Invoice invoice) {
        firebaseService.updateInvoice(invoice);
    }

    public void getInvoiceById(String id) {
        firebaseService.getInvoiceById(id);
    }

    public void deleteInvoice(String id) {
        firebaseService.deleteInvoice(id);
    }
}
