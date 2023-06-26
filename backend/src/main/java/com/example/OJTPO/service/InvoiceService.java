package com.example.OJTPO.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.stereotype.Service;

import com.example.OJTPO.model.Invoice;
import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutureCallback;
import com.google.api.core.ApiFutures;
import com.google.common.util.concurrent.MoreExecutors;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

@Service
public class InvoiceService {

  private DatabaseReference getDatabaseInstance() {
    return FirebaseDatabase.getInstance().getReference();
  }

  private DatabaseReference getInvoiceReference() {
    return getDatabaseInstance().child("Invoices");
  }

  private DatabaseReference getLastInvoiceId() {
    return getDatabaseInstance().child("lastInvoiceId");
  }

  // Create new Invoice:
  public Invoice createInvoice(Invoice invoice) {
    DatabaseReference invoicesRef = getInvoiceReference();

    // Get the last invoice ID
    DatabaseReference indexRef = getLastInvoiceId();
    indexRef.addListenerForSingleValueEvent(new ValueEventListener() {
      @Override
      public void onDataChange(DataSnapshot dataSnapshot) {
        Long lastInvoiceId = dataSnapshot.getValue(Long.class);
        if (lastInvoiceId == null) {
          lastInvoiceId = 0L;
        }

        // Increment the last invoice ID and use it for the new invoice's ID
        Long newInvoiceId = lastInvoiceId + 1;
        invoice.setId(newInvoiceId);

        // Update the last invoice ID in the database
        indexRef.setValueAsync(newInvoiceId);

        // Add the new invoice to the database
        invoicesRef.child(String.valueOf(newInvoiceId)).setValueAsync(invoice);
      }

      @Override
      public void onCancelled(DatabaseError databaseError) {
        throw databaseError.toException();
      }
    });

    return invoice;
  }

  // Get all invoices:
  public CompletableFuture<List<Invoice>> getAllInvoices() {
    CompletableFuture<List<Invoice>> future = new CompletableFuture<>();
    final List<Invoice> invoices = new ArrayList<>();

    getInvoiceReference()
        .addListenerForSingleValueEvent(new ValueEventListener() {
          @Override
          public void onDataChange(DataSnapshot dataSnapshot) {
            for (DataSnapshot invoiceSnapshot : dataSnapshot.getChildren()) {
              Invoice invoice = invoiceSnapshot.getValue(Invoice.class);
              invoices.add(invoice);
            }
            future.complete(invoices);
          }

          @Override
          public void onCancelled(DatabaseError databaseError) {
            future.completeExceptionally(databaseError.toException());
          }
        });

    return future;
  }

  // Get Invoice by Id:
  public CompletableFuture<Invoice> getInvoiceById(Long id) {
    CompletableFuture<Invoice> future = new CompletableFuture<>();
    String idString = String.valueOf(id);
    if (idString == null || idString.equals("null")) {
      throw new IllegalArgumentException("Invoice id cannot be null");
    }

    getInvoiceReference().child(idString)
        .addListenerForSingleValueEvent(new ValueEventListener() {
          @Override
          public void onDataChange(DataSnapshot dataSnapshot) {
            Invoice invoice = dataSnapshot.getValue(Invoice.class);
            future.complete(invoice);
          }

          @Override
          public void onCancelled(DatabaseError databaseError) {
            future.completeExceptionally(databaseError.toException());
          }
        });

    return future;
  }

  // Update Invoice:
  public CompletableFuture<Invoice> updateInvoice(Long id, Invoice newInvoice) {
    String idString = String.valueOf(id);
    if (idString == null || idString.equals("null")) {
      throw new IllegalArgumentException("Invoice id cannot be null");
    }

    CompletableFuture<Invoice> completableFuture = new CompletableFuture<>();

    getInvoiceReference().child(idString)
        .addListenerForSingleValueEvent(new ValueEventListener() {
          @Override
          public void onDataChange(DataSnapshot dataSnapshot) {
            if (dataSnapshot.exists()) {
              Invoice existingInvoice = dataSnapshot.getValue(Invoice.class);
              existingInvoice.updateWith(newInvoice);
              ApiFuture<Void> future = getInvoiceReference().child(idString).setValueAsync(existingInvoice);
              ApiFutures.addCallback(future, new ApiFutureCallback<Void>() {
                @Override
                public void onSuccess(Void result) {
                  completableFuture.complete(existingInvoice);
                }

                @Override
                public void onFailure(Throwable t) {
                  completableFuture.completeExceptionally(t);
                }
              }, MoreExecutors.directExecutor());
            } else {
              completableFuture.complete(null);
            }
          }

          @Override
          public void onCancelled(DatabaseError databaseError) {
            completableFuture.completeExceptionally(databaseError.toException());
          }
        });

    return completableFuture;
  }

  // Delete Invoice:
  public CompletableFuture<String> deleteInvoice(Long id) {
    String idString = String.valueOf(id);
    if (idString == null || idString.equals("null")) {
      throw new IllegalArgumentException("Invoice id cannot be null");
    }

    CompletableFuture<String> completableFuture = new CompletableFuture<>();

    getInvoiceReference().child(idString).addListenerForSingleValueEvent(new ValueEventListener() {
      @Override
      public void onDataChange(DataSnapshot dataSnapshot) {
        if (dataSnapshot.exists()) {
          ApiFuture<Void> future = getInvoiceReference().child(idString).removeValueAsync();
          ApiFutures.addCallback(future, new ApiFutureCallback<Void>() {
            @Override
            public void onSuccess(Void result) {
              completableFuture.complete("Invoice with id " + idString + " has been deleted.");
            }

            @Override
            public void onFailure(Throwable t) {
              completableFuture.completeExceptionally(t);
            }
          }, MoreExecutors.directExecutor());
        } else {
          completableFuture.complete(null);
        }
      }

      @Override
      public void onCancelled(DatabaseError databaseError) {
        completableFuture.completeExceptionally(databaseError.toException());
      }
    });

    return completableFuture;
  }

}
