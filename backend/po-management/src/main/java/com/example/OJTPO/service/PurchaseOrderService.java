package com.example.OJTPO.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.example.OJTPO.model.PurchaseOrder;
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
  public List<PurchaseOrder> getBillablePOs() {
    final List<PurchaseOrder> billablePOs = new ArrayList<>();

    getPOReference().orderByChild("status").equalTo("Billable")
      .addListenerForSingleValueEvent(new ValueEventListener() {
        @Override
        public void onDataChange(DataSnapshot dataSnapshot) {
          for (DataSnapshot postSnapshot : dataSnapshot.getChildren()) {
            PurchaseOrder purchaseOrder = postSnapshot.getValue(PurchaseOrder.class);
            billablePOs.add(purchaseOrder);
          }
        }

        @Override
        public void onCancelled(DatabaseError databaseError) {
          System.out.println(databaseError.getMessage());
        }
      });

    return billablePOs;
  }

  // Get Purchase Order by Id:
  public PurchaseOrder getPOById(Long id) throws ExecutionException, InterruptedException {
    final PurchaseOrder[] purchaseOrder = new PurchaseOrder[1];
    String idString = String.valueOf(id);
    if (idString == null || idString.equals("null")) {
      throw new IllegalArgumentException("Purchase Order id cannot be null");
    }

    getPOReference().child(idString)
      .addListenerForSingleValueEvent(new ValueEventListener() {
        @Override
        public void onDataChange(DataSnapshot dataSnapshot) {
          purchaseOrder[0] = dataSnapshot.getValue(PurchaseOrder.class);
        }

        @Override
        public void onCancelled(DatabaseError databaseError) {
          System.out.println(databaseError.getMessage());
        }
      });

    return purchaseOrder[0];
  }

  // Update Purchase Order:
  public PurchaseOrder updatePO(PurchaseOrder purchaseOrder) {
    String idString = String.valueOf(purchaseOrder.getId());
    if (idString == null || idString.equals("null")) {
      throw new IllegalArgumentException("Purchase Order id cannot be null");
    }

    getPOReference().child(idString).setValueAsync(purchaseOrder);

    return purchaseOrder;
  }

  // Delete Purchase Order:
  public String deletePO(Long id) {
    String idString = String.valueOf(id);
    if (idString == null || idString.equals("null")) {
      throw new IllegalArgumentException("Purchase Order id cannot be null");
    }

    getPOReference().child(idString).removeValueAsync();

    return "Purchase Order with id " + idString + " has been deleted.";
  }

}