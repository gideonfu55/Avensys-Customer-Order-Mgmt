package com.example.OJTPO.service;

import com.example.OJTPO.firebase.FirebaseService;
import com.example.OJTPO.model.Invoice;
import com.example.OJTPO.model.PurchaseOrder;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InvoiceService {

    private DatabaseReference getDatabaseInstance() {
        return FirebaseDatabase.getInstance().getReference();
    }

    private DatabaseReference getInvoiceReference() {
        return getDatabaseInstance().child("Invoices");
    }

    // public InvoiceService(FirebaseService firebaseService) {
    //     this.firebaseService = firebaseService;
    // }

    // public CompletableFuture<Invoice> createInvoice(Invoice invoice) {
    //     return firebaseService.createInvoice(invoice);
    // }

    // public CompletableFuture<Invoice> updateInvoice(Invoice invoice, String id) {
    //     return firebaseService.updateInvoice(invoice, id);
    // }

    public CompletableFuture<Invoice> getInvoiceById(Long id) {
        CompletableFuture<Invoice> completableFuture = new CompletableFuture<>();
        String idString = String.valueOf(id);
        if (idString == null || idString.equals("null")) {
            throw new IllegalArgumentException("Purchase Order id cannot be null");
        }

        getInvoiceReference().child(idString)
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        if (dataSnapshot.exists()) {
                            for (DataSnapshot invoiceSnapshot : dataSnapshot.getChildren()) {
                                Invoice invoice = invoiceSnapshot.getValue(Invoice.class);
                                completableFuture.complete(invoice);
                                return;
                            }
                        }
                        completableFuture.complete(null);
                    }

                    @Override
                    public void onCancelled(DatabaseError databaseError) {
                        completableFuture.completeExceptionally(databaseError.toException());
                    }
                });

        return completableFuture;
    }

    // public CompletableFuture<Invoice> deleteInvoice(String id) {
    //     return firebaseService.deleteInvoice(id);
    // }
}
