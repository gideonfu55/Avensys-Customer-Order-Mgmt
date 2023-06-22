package com.example.OJTPO.firebase;

import com.example.OJTPO.model.User;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.*;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.concurrent.CompletableFuture;

@Service
public class FirebaseService {
    private DatabaseReference firebase;

    @PostConstruct
    public void initialize() {
        try {
            FileInputStream serviceAccount = new FileInputStream("./firebaseKey2.json");

            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setDatabaseUrl("https://po-management-aaf79-default-rtdb.asia-southeast1.firebasedatabase.app/")
                .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
            firebase = FirebaseDatabase.getInstance().getReference();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public CompletableFuture<User> validateUser(String username, String password) {
        CompletableFuture<User> completableFuture = new CompletableFuture<>();
        DatabaseReference userRef = firebase.child("users").child(username);

        userRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                User user = dataSnapshot.getValue(User.class);
                if (user != null && user.getPassword().equals(password)) {
                    completableFuture.complete(user);
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

    public CompletableFuture<User> getUserByUsername(String username) {
        CompletableFuture<User> completableFuture = new CompletableFuture<>();
        DatabaseReference usersRef = firebase.child("users");

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

    public CompletableFuture<Boolean> existsByUsername(String username) {
        CompletableFuture<Boolean> completableFuture = new CompletableFuture<>();
        DatabaseReference userRef = firebase.child("users").child(username);

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
}
