package com.example.OJTPO.firebase;

import com.example.OJTPO.model.Invoice;
import com.example.OJTPO.model.User;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.concurrent.CompletableFuture;

@Service
public class FirebaseService {
    public DatabaseReference firebase;

    @PostConstruct
    public void initialize() {
        try {
            FileInputStream serviceAccount = new FileInputStream("./firebase-key.json");

            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setDatabaseUrl("https://avensys-ojt-default-rtdb.asia-southeast1.firebasedatabase.app/")
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

    public CompletableFuture<User> createUser(User user) {
        CompletableFuture<User> completableFuture = new CompletableFuture<>();
        DatabaseReference usersRef = firebase.child("users");

        usersRef.push().setValue(user, (error, ref) -> {
            if (error == null) {
                completableFuture.complete(user);
            } else {
                completableFuture.completeExceptionally(error.toException());
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

    public CompletableFuture<Invoice> createInvoice(Invoice invoice) {
        CompletableFuture<Invoice> completableFuture = new CompletableFuture<>();
        DatabaseReference invoiceRef = firebase.child("invoices");

        invoiceRef.push().setValue(invoice, (error, ref) -> {
            if (error == null) {
                completableFuture.complete(invoice);
            } else {
                completableFuture.completeExceptionally(error.toException());
            }
        });

        return completableFuture;
    }

    public CompletableFuture<Invoice> updateInvoice(Invoice invoice, String id) {
        CompletableFuture<Invoice> completableFuture = new CompletableFuture<>();
        DatabaseReference invoiceRef = firebase.child("invoices");

        DatabaseReference specificInvoiceRef = invoiceRef.child(id);
        specificInvoiceRef.setValue(invoice, (error, ref) -> {
            if (error == null) {
                completableFuture.complete(invoice);
            } else {
                completableFuture.completeExceptionally(error.toException());
            }
        });

        return completableFuture;
    }

    public CompletableFuture<Invoice> deleteInvoice(String id) {
        CompletableFuture<Invoice> completableFuture = new CompletableFuture<>();
        DatabaseReference invoiceRef = firebase.child("invoices");

        DatabaseReference specificInvoiceRef = invoiceRef.child(id);
        specificInvoiceRef.removeValue((error, ref) -> {
            if (error == null) {
                completableFuture.complete(null);
            } else {
                completableFuture.completeExceptionally(error.toException());
            }
        });

        return completableFuture;
    }

    public CompletableFuture<Invoice> getInvoiceById(String id) {
        CompletableFuture<Invoice> completableFuture = new CompletableFuture<>();
        DatabaseReference invoiceRef = firebase.child("invoices");

        invoiceRef.orderByChild("id")
                .equalTo(id)
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
}
