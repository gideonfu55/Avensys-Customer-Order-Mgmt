package com.example.OJTPO.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.example.OJTPO.model.Notification;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

@Service
public class NotificationService {

  private DatabaseReference db;

  public NotificationService() {
    db = FirebaseDatabase.getInstance().getReference();
  }

  public void createNotification(Notification notification) throws ExecutionException, InterruptedException {
    String id = db.child("notifications").push().getKey();
    notification.setId(id);
    db.child("notifications").child(id).setValueAsync(notification).get();
  }

  public List<Notification> getAllNotifications() {
    List<Notification> notifications = new ArrayList<>();

    db.child("notifications").addListenerForSingleValueEvent(new ValueEventListener() {
      @Override
      public void onDataChange(DataSnapshot dataSnapshot) {
        for (DataSnapshot ds : dataSnapshot.getChildren()) {
          Notification notification = ds.getValue(Notification.class);
          notifications.add(notification);
        }
      }

      @Override
      public void onCancelled(DatabaseError databaseError) {
      }
    });

    return notifications;
  }

  public CompletableFuture<List<Notification>> getAllNotificationsByRole(String userRole) {
    CompletableFuture<List<Notification>> completableFuture = new CompletableFuture<>();

    db.child("notifications").orderByChild("userRole").equalTo(userRole).addListenerForSingleValueEvent(new ValueEventListener() {
      @Override
      public void onDataChange(DataSnapshot dataSnapshot) {
        List<Notification> notifications = new ArrayList<>();
        for (DataSnapshot ds : dataSnapshot.getChildren()) {
          Notification notification = ds.getValue(Notification.class);
          notifications.add(notification);
        }
        completableFuture.complete(notifications);
      }

      @Override
      public void onCancelled(DatabaseError databaseError) {
        completableFuture.completeExceptionally(databaseError.toException());
      }
    });

    return completableFuture;
  }


  public void deleteNotification(String id) {
    db.child("notifications").child(id).removeValueAsync();
  }

}
