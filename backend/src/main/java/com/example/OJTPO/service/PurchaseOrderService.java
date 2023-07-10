package com.example.OJTPO.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.OJTPO.model.PurchaseOrder;
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
public class PurchaseOrderService {

  private DatabaseReference getDatabaseInstance() {
    return FirebaseDatabase.getInstance().getReference();
  }

  private DatabaseReference getPOReference() {
    return getDatabaseInstance().child("PurchaseOrders");
  }

  private DatabaseReference getInvoiceReference() {
    return getDatabaseInstance().child("Invoices");
  }

  private DatabaseReference getLastPOId() {
    return getDatabaseInstance().child("lastPOId");
  }

  @Autowired
  private Storage storage;

  private static String UPLOAD_DIR = "uploads/po/";

  // Create new Purchase Order:
  public CompletableFuture<PurchaseOrder> createPO(MultipartFile file, PurchaseOrder purchaseOrder) throws Exception {

    String fileUrl = getFileUrl(file, purchaseOrder);

    // Set the fileUrl field in the purchase order
    purchaseOrder.setFileUrl(fileUrl);

    // Get last PO id:
    DatabaseReference indexRef = getLastPOId();

    // Read the lastPOIndex from the database
    indexRef.addListenerForSingleValueEvent(new ValueEventListener() {
      @Override
      public void onDataChange(DataSnapshot dataSnapshot) {
        Long lastPOId = dataSnapshot.getValue(Long.class);
        if (lastPOId == null) {
          lastPOId = 0L;
        }

        // Increment the last PO id: and use it for the new PO's id:
        purchaseOrder.setId(lastPOId + 1);
        indexRef.setValueAsync(lastPOId + 1);

        // Add the new PO to the database:
        String idString = String.valueOf(purchaseOrder.getId());
        if (idString == null || idString.equals("null")) {
          throw new IllegalArgumentException("Purchase Order id cannot be null");
        }

        getPOReference().child(idString).setValueAsync(purchaseOrder);
      }

      @Override
      public void onCancelled(DatabaseError databaseError) {
        throw databaseError.toException();
      }
    });

    return CompletableFuture.completedFuture(purchaseOrder);
  }

  // Update status of Purchase Order to "Billable" and forward to finance:
  public PurchaseOrder forwardPO(PurchaseOrder purchaseOrder) {
    purchaseOrder.setStatus("Billable");
    String idString = String.valueOf(purchaseOrder.getId());
    if (idString == null || idString.equals("null")) {
      throw new IllegalArgumentException("Purchase Order id cannot be null");
    }

    getPOReference().child(idString).setValueAsync(purchaseOrder);

    return purchaseOrder;
  }

  // Get list of all Purchase Orders:
  public CompletableFuture<List<PurchaseOrder>> getBillablePOs() {
    CompletableFuture<List<PurchaseOrder>> future = new CompletableFuture<>();
    final List<PurchaseOrder> billablePOs = new ArrayList<>();

    // getPOReference().orderByChild("status").equalTo("Billable")
    getPOReference()
      .addListenerForSingleValueEvent(new ValueEventListener() {
        @Override
        public void onDataChange(DataSnapshot dataSnapshot) {
          for (DataSnapshot postSnapshot : dataSnapshot.getChildren()) {
            PurchaseOrder purchaseOrder = postSnapshot.getValue(PurchaseOrder.class);
            billablePOs.add(purchaseOrder);
          }
          future.complete(billablePOs);
        }

        @Override
        public void onCancelled(DatabaseError databaseError) {
          future.completeExceptionally(databaseError.toException());
        }
      });

    return future;
  }

  // Get Purchase Order by Id:
  public CompletableFuture<PurchaseOrder> getPOById(Long id) {
    CompletableFuture<PurchaseOrder> future = new CompletableFuture<>();
    String idString = String.valueOf(id);
    if (idString == null || idString.equals("null")) {
      throw new IllegalArgumentException("Purchase Order id cannot be null");
    }

    getPOReference().child(idString)
      .addListenerForSingleValueEvent(new ValueEventListener() {
        @Override
        public void onDataChange(DataSnapshot dataSnapshot) {
          PurchaseOrder purchaseOrder = dataSnapshot.getValue(PurchaseOrder.class);
          future.complete(purchaseOrder);
        }

        @Override
        public void onCancelled(DatabaseError databaseError) {
          future.completeExceptionally(databaseError.toException());
        }
      });

    return future;
  }

  // Get all PO Numbers:
  public CompletableFuture<List<String>> getAllPoNumbers() {
    CompletableFuture<List<String>> completableFuture = new CompletableFuture<>();

    getPOReference().addListenerForSingleValueEvent(new ValueEventListener() {
      @Override
      public void onDataChange(DataSnapshot dataSnapshot) {
        List<String> poNumbers = new ArrayList<>();
        for (DataSnapshot poSnapshot : dataSnapshot.getChildren()) {
          String poNumber = poSnapshot.child("poNumber").getValue(String.class);
          poNumbers.add(poNumber);
        }
        completableFuture.complete(poNumbers);
      }

      @Override
      public void onCancelled(DatabaseError databaseError) {
        completableFuture.completeExceptionally(databaseError.toException());
      }
    });

    return completableFuture;
  }

  // Update Purchase Order:
  public CompletableFuture<PurchaseOrder> updatePO (
    Long id, 
    PurchaseOrder newPurchaseOrder, 
    MultipartFile file
  ) throws Exception {

    if (file != null) {
      String fileUrl = getFileUrl(file, newPurchaseOrder);

      // Set the fileUrl field in the purchase order
      newPurchaseOrder.setFileUrl(fileUrl);

    }

    String idString = String.valueOf(id);
    if (idString == null || idString.equals("null")) {
      throw new IllegalArgumentException("Purchase Order id cannot be null");
    }

    CompletableFuture<PurchaseOrder> completableFuture = new CompletableFuture<>();

    getPOReference().child(idString)
      .addListenerForSingleValueEvent(new ValueEventListener() {

        @Override
        public void onDataChange(DataSnapshot dataSnapshot) {

          if (dataSnapshot.exists()) {
            PurchaseOrder existingPO = dataSnapshot.getValue(PurchaseOrder.class);

            System.out.println(newPurchaseOrder.getFileUrl());
            existingPO.updateWith(newPurchaseOrder);

            ApiFuture<Void> future = getPOReference().child(idString).setValueAsync(existingPO);

            ApiFutures.addCallback(future, new ApiFutureCallback<Void>() {
              @Override
              public void onSuccess(Void result) {
                completableFuture.complete(existingPO);
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

  // Delete Purchase Order:
  public CompletableFuture<String> deletePO(Long id) {

    String idString = String.valueOf(id);
    if (idString == null || idString.equals("null")) {
      throw new IllegalArgumentException("Purchase Order id cannot be null");
    }

    // Getting poNumber from the PO to be deleted for fetching corresponding invoices with purchaseOrderRef that matches:
    String poNumber;

    try {
      poNumber = getPOById(id).get().getPoNumber();
    } catch (InterruptedException | ExecutionException e) {
      e.printStackTrace(); // log the exception properly
      throw new RuntimeException("Failed to get PO by id", e);
    }

    CompletableFuture<String> completableFuture = new CompletableFuture<>();

    getPOReference().child(idString).addListenerForSingleValueEvent(new ValueEventListener() {
      @Override
      public void onDataChange(DataSnapshot dataSnapshot) {
        if (dataSnapshot.exists()) {
          ApiFuture<Void> future = getPOReference().child(idString).removeValueAsync();
          ApiFutures.addCallback(future, new ApiFutureCallback<Void>() {
            @Override
            public void onSuccess(Void result) {

              String bucketName = "avensys-ojt.appspot.com";

              // Check if the PO has a fileUrl
              if (dataSnapshot.child("fileUrl").getValue(String.class) != null) {

                // Delete the PO's file from Google Cloud Storage
                String fileUrl = dataSnapshot.child("fileUrl").getValue(String.class);
                int startOfObjectName = fileUrl.indexOf(bucketName) + bucketName.length() + 1;
                String objectName = fileUrl.substring(startOfObjectName);

                BlobId blobId = BlobId.of(bucketName, objectName);
                storage.delete(blobId);
              }

              // Remove associated Invoices
              getInvoiceReference().orderByChild("purchaseOrderRef").equalTo(poNumber)
                .addListenerForSingleValueEvent(new ValueEventListener() {
                  @Override
                  public void onDataChange(DataSnapshot dataSnapshot) {
                    for (DataSnapshot invoiceSnapshot : dataSnapshot.getChildren()) {
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

                  @Override
                  public void onCancelled(DatabaseError databaseError) {
                    completableFuture.completeExceptionally(databaseError.toException());
                  }
                });

              completableFuture.complete("Purchase Order with id " + idString + " has been deleted.");
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

      // Implement onCancelled to handle connection issues
      @Override
      public void onCancelled(DatabaseError databaseError) {
        completableFuture.completeExceptionally(databaseError.toException());
      }
    });

    return completableFuture;
  }

  // Logic to check if PO number already exists:
  public CompletableFuture<Boolean> checkPONumberExists(String poNumber) {
    CompletableFuture<Boolean> completableFuture = new CompletableFuture<>();

    getPOReference().orderByChild("poNumber").equalTo(poNumber)
      .addListenerForSingleValueEvent(new ValueEventListener() {
        @Override
        public void onDataChange(DataSnapshot dataSnapshot) {
          if (dataSnapshot.exists()) {
            completableFuture.complete(true);
          } else {
            completableFuture.complete(false);
          }
        }

        @Override
        public void onCancelled(DatabaseError databaseError) {
          completableFuture.completeExceptionally(databaseError.toException());
        }
      });

    return completableFuture;
  }

  // Method for returning fileUrl when uploading a file to Firebase Storage:
  private String getFileUrl(MultipartFile file, PurchaseOrder purchaseOrder) throws IOException {
    // Upload file to Google Cloud Storage and get the download URL
    String bucketName = "avensys-ojt.appspot.com";
    String objectName = UPLOAD_DIR + purchaseOrder.getPoNumber() + "/" + file.getOriginalFilename();

    BlobId blobId = BlobId.of(bucketName, objectName);
    BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();

    // Upload the file to Google Cloud Storage
    storage.create(blobInfo, file.getBytes());

    // Get the download URL
    String fileUrl = String.format("https://storage.googleapis.com/%s/%s", bucketName, objectName);
    
    return fileUrl;
  }

}
