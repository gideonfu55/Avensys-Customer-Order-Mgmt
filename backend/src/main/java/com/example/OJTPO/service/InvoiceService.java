package com.example.OJTPO.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.OJTPO.model.Invoice;
import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutureCallback;
import com.google.api.core.ApiFutures;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
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

  @Autowired
  private Storage storage;

  @Autowired
  private PurchaseOrderService purchaseOrderService;

  private static String UPLOAD_DIR = "uploads/invoice/";

  // Create new Invoice:
  public CompletableFuture<Invoice> createInvoice(MultipartFile file, Invoice invoice) throws Exception {

    String fileUrl = getFileUrl(file, invoice);

    // Set the fileUrl field in the invoice
    invoice.setFileUrl(fileUrl);

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

    return CompletableFuture.completedFuture(invoice);
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
  public CompletableFuture<Invoice> updateInvoice(
    Long id, 
    Invoice newInvoice,
    MultipartFile file
  ) throws Exception {

    if (file != null) {
      String fileUrl = getFileUrl(file, newInvoice);

      // Set the fileUrl field in the invoice
      newInvoice.setFileUrl(fileUrl);
    }

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

              // Check if the invoice has a fileUrl
              if (dataSnapshot.child("fileUrl").getValue() == null) {
                completableFuture.complete("Invoice with id " + idString + " has been deleted.");
                return;
              }

              // Delete the invoice's file from Google Cloud Storage
              String bucketName = "avensys-ojt.appspot.com";
              String fileUrl = dataSnapshot.child("fileUrl").getValue(String.class);
              int startOfObjectName = fileUrl.indexOf(bucketName) + bucketName.length() + 1;
              String objectName = fileUrl.substring(startOfObjectName);

              BlobId blobId = BlobId.of(bucketName, objectName);
              System.out.println(blobId);
              storage.delete(blobId);

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

  // Delete Invoices Record & Document with no current matching PO in DB:
  public CompletableFuture<String> deleteInvoicesWithoutMatchingPO() {
    CompletableFuture<String> completableFuture = new CompletableFuture<>();
    String bucketName = "avensys-ojt.appspot.com";

    purchaseOrderService.getAllPoNumbers().thenAccept(poNumbers -> {
      getInvoiceReference().addListenerForSingleValueEvent(new ValueEventListener() {
        @Override
        public void onDataChange(DataSnapshot dataSnapshot) {
          for (DataSnapshot invoiceSnapshot : dataSnapshot.getChildren()) {
            String purchaseOrderRef = invoiceSnapshot.child("purchaseOrderRef").getValue(String.class);
            if (!poNumbers.contains(purchaseOrderRef)) {

              // Delete associated Invoice documents from Firebase Storage
              if (invoiceSnapshot.child("fileUrl").getValue(String.class) != null) {
                String fileUrl = invoiceSnapshot.child("fileUrl").getValue(String.class);
                int startOfObjectName = fileUrl.indexOf(bucketName) + bucketName.length() + 1;
                String objectName = fileUrl.substring(startOfObjectName);

                BlobId blobId = BlobId.of(bucketName, objectName);
                storage.delete(blobId);
              }
              // Remove the invoice from Firebase Realtime Database
              invoiceSnapshot.getRef().removeValueAsync();
            }
          }
          
          completableFuture.complete("Deleted all invoices without a matching Purchase Order.");
        }

        @Override
        public void onCancelled(DatabaseError databaseError) {
          completableFuture.completeExceptionally(databaseError.toException());
        }
      });
    }).exceptionally(e -> {
      completableFuture.completeExceptionally(e);
      return null;
    });

    return completableFuture;
  }

  // Method for returning fileUrl when uploading a file to Firebase Storage:
  private String getFileUrl(MultipartFile file, Invoice invoice) throws IOException {

    // Upload file to Google Cloud Storage and get the download URL
    String bucketName = "avensys-ojt.appspot.com";
    String objectName = UPLOAD_DIR + invoice.getInvoiceNumber() + "/" + file.getOriginalFilename();

    BlobId blobId = BlobId.of(bucketName, objectName);
    BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();

    // Upload the file to Google Cloud Storage
    storage.create(blobInfo, file.getBytes());

    // Get the download URL
    String fileUrl = String.format("https://storage.googleapis.com/%s/%s", bucketName, objectName);
    return fileUrl;
  }

}
