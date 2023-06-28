package com.example.OJTPO.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutureCallback;
import com.google.api.core.ApiFutures;
import com.google.common.util.concurrent.MoreExecutors;
import com.google.firebase.database.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.OJTPO.firebase.FirebaseService;
import com.example.OJTPO.model.User;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.MutableData;
import com.google.firebase.database.Transaction;
import com.google.firebase.database.ValueEventListener;

@Service
public class UserService {

    @Autowired
    private FirebaseService firebaseService;

    private DatabaseReference getDatabaseInstance() {
        return FirebaseDatabase.getInstance().getReference();
    }

    private DatabaseReference getUserReference() {
        return getDatabaseInstance().child("users");
    }

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
    }
    
    //  Get All Users
    public CompletableFuture<List<User>> getAllUsers() {
        CompletableFuture<List<User>> completableFuture = new CompletableFuture<>();
        DatabaseReference usersRef = firebaseService.getFirebase().child("users");

        usersRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                List<User> userList = new ArrayList<>();
                for (DataSnapshot userSnapshot : dataSnapshot.getChildren()) {
                    User user = userSnapshot.getValue(User.class);
                    userList.add(user);
                }

                completableFuture.complete(userList);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                completableFuture.completeExceptionally(databaseError.toException());
            }
        });

        return completableFuture;
    }

    // Delete Users
    public CompletableFuture<String> deleteUserByUsername(String username) {
        if (username == null || username.equals("null")) {
            throw new IllegalArgumentException("Username cannot be null!");
        }

        CompletableFuture<String> completableFuture = new CompletableFuture<>();

        DatabaseReference usersRef = getUserReference();
        Query query = usersRef.orderByChild("username").equalTo(username);

        query.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                if (dataSnapshot.exists()) {
                    for (DataSnapshot userSnapshot : dataSnapshot.getChildren()) {
                        String userKey = userSnapshot.getKey();
                        ApiFuture<Void> future = getUserReference().child(userKey).removeValueAsync();
                        ApiFutures.addCallback(future, new ApiFutureCallback<Void>() {
                            @Override
                            public void onSuccess(Void result) {
                                completableFuture.complete("User with username: " + username + " has been deleted.");
                            }

                            @Override
                            public void onFailure(Throwable t) {
                                completableFuture.completeExceptionally(t);
                            }
                        }, MoreExecutors.directExecutor());
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

    // Update User:
    public CompletableFuture<Boolean> updateUserByUsername(String username, User updateUser) {
        if (username == null || username.equals("null")) {
            throw new IllegalArgumentException("Username cannot be null!");
        }

        CompletableFuture<Boolean> completableFuture = new CompletableFuture<>();

        DatabaseReference usersRef = getUserReference();
        Query query = usersRef.orderByChild("username").equalTo(username);

        query.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                if (snapshot.exists()) {
                    for (DataSnapshot userSnapshot : snapshot.getChildren()) {
                        User currentUser = userSnapshot.getValue(User.class);
                        currentUser.updateWith(updateUser);
                        userSnapshot.getRef().setValue(currentUser, (error, ref) -> {
                            if (error == null) {
                                completableFuture.complete(true);
                            } else {
                                completableFuture.completeExceptionally(error.toException());
                            }
                        });

                        return;
                    }
                }

                completableFuture.complete(false);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                completableFuture.completeExceptionally(error.toException());
            }
        });

        return completableFuture;
    }
}