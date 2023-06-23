package com.example.OJTPO.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.springframework.stereotype.Service;

import com.example.OJTPO.model.PurchaseOrder;
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
public class PurchaseOrderService {

  private DatabaseReference getDatabaseInstance() {
    return FirebaseDatabase.getInstance().getReference();
  }

  private DatabaseReference getPOReference() {
    return getDatabaseInstance().child("PurchaseOrders");
  }

  // Create new Purchase Order:
  public PurchaseOrder createPO(PurchaseOrder purchaseOrder) {
    String idString = String.valueOf(purchaseOrder.getId());
    if (idString == null || idString.equals("null")) {
      throw new IllegalArgumentException("Purchase Order id cannot be null");
    }

    getPOReference().child(idString).setValueAsync(purchaseOrder);

    return purchaseOrder;
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

  // Get all Billable Purchase Orders:
  public CompletableFuture<List<PurchaseOrder>> getBillablePOs() {
    CompletableFuture<List<PurchaseOrder>> future = new CompletableFuture<>();
    final List<PurchaseOrder> billablePOs = new ArrayList<>();

    getPOReference().orderByChild("status").equalTo("Billable")
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

  // Update Purchase Order:
  public CompletableFuture<PurchaseOrder> updatePO(Long id, PurchaseOrder newPurchaseOrder) {
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

    CompletableFuture<String> completableFuture = new CompletableFuture<>();

    getPOReference().child(idString).addListenerForSingleValueEvent(new ValueEventListener() {
      @Override
      public void onDataChange(DataSnapshot dataSnapshot) {
        if (dataSnapshot.exists()) {
          ApiFuture<Void> future = getPOReference().child(idString).removeValueAsync();
          ApiFutures.addCallback(future, new ApiFutureCallback<Void>() {
            @Override
            public void onSuccess(Void result) {
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

      @Override
      public void onCancelled(DatabaseError databaseError) {
        completableFuture.completeExceptionally(databaseError.toException());
      }
    });

    return completableFuture;
  }

}
