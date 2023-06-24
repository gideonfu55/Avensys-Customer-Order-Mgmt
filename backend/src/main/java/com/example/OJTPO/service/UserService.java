package com.example.OJTPO.service;

<<<<<<<< HEAD:backend/src/main/java/com/example/OJTPO/service/UserService.java
import com.example.OJTPO.firebase.FirebaseService;
import com.example.OJTPO.model.User;
import com.google.firebase.database.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
========
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
>>>>>>>> 5732c82502a79580f57b6edf6a80274be1a8ba34:backend/po-management/src/main/java/com/example/OJTPO/firebase/FirebaseService.java

@Service
public class UserService {

    @Autowired
    private FirebaseService firebaseService;

<<<<<<<< HEAD:backend/src/main/java/com/example/OJTPO/service/UserService.java
    public CompletableFuture<User> validateUser(String username, String password) {
        CompletableFuture<User> completableFuture = new CompletableFuture<>();

        getUserByUsername(username).thenAccept(user -> {
            if (user != null && user.getPassword().equals(password)) {
                completableFuture.complete(user);
            } else {
                completableFuture.complete(null);
            }
        }).exceptionally(ex -> {
            completableFuture.completeExceptionally(ex);
            return null;
        });

        return completableFuture;
    }

    public CompletableFuture<User> getUserByUsername(String username) {
        CompletableFuture<User> completableFuture = new CompletableFuture<>();
        DatabaseReference usersRef = firebaseService.getFirebase().child("users");

        usersRef.orderByChild("username")
                .equalTo(username)
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(DataSnapshot dataSnapshot) {
                        if (dataSnapshot.exists()) {
                            for (DataSnapshot userSnapshot : dataSnapshot.getChildren()) {
                                User user = userSnapshot.getValue(User.class);
                                completableFuture.complete(user);
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

    public CompletableFuture<User> createUser(User user) {
        CompletableFuture<User> completableFuture = new CompletableFuture<>();
        DatabaseReference usersRef = firebaseService.getFirebase().child("users");
        DatabaseReference idRef = firebaseService.getFirebase().child("lastUserId");

        idRef.runTransaction(new Transaction.Handler() {
            @Override
            public Transaction.Result doTransaction(MutableData currentData) {
                if (currentData.getValue() == null) {
                    currentData.setValue(1);
                } else {
                    currentData.setValue((Long) currentData.getValue() + 1);
                }
                return Transaction.success(currentData);
            }

            @Override
            public void onComplete(DatabaseError databaseError, boolean committed, DataSnapshot dataSnapshot) {
                if (committed) {
                    user.setId(dataSnapshot.getValue(Long.class).intValue());

                    usersRef.push().setValue(user, (error, ref) -> {
                        if (error == null) {
                            completableFuture.complete(user);
                        } else {
                            completableFuture.completeExceptionally(error.toException());
                        }
                    });
                } else {
                    completableFuture.completeExceptionally(databaseError.toException());
                }
            }
        });

        return completableFuture;
    }

    public CompletableFuture<Boolean> existsByUsername(String username) {
        CompletableFuture<Boolean> completableFuture = new CompletableFuture<>();
        DatabaseReference userRef = firebaseService.getFirebase().child("users").child(username);

        userRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                completableFuture.complete(dataSnapshot.exists());
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                completableFuture.completeExceptionally(databaseError.toException());
            }
        });
        return completableFuture;
========
    public DatabaseReference getFirebase() {
        return firebase;
>>>>>>>> 5732c82502a79580f57b6edf6a80274be1a8ba34:backend/po-management/src/main/java/com/example/OJTPO/firebase/FirebaseService.java
    }
}
