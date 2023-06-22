package com.example.OJTPO.firebase;

import com.example.OJTPO.model.Invoice;
import com.example.OJTPO.model.User;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.*;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
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
                    .setDatabaseUrl("https://avensys-ojt-default-rtdb.asia-southeast1.firebasedatabase.app")
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

        public Invoice saveInvoice(Invoice invoice) {
        int invoiceKey = generateNumericKey();
        
        while (isInvoiceKeyExists(invoiceKey)) {
            invoiceKey = generateNumericKey();
        }
        
        Map<String, Object> invoiceMap = convertInvoiceToMap(invoice);

        firebase.child("invoices").child(String.valueOf(invoiceKey)).setValueAsync(invoiceMap);

        return invoice;
    }

    private boolean isInvoiceKeyExists(int invoiceKey) {
        DatabaseReference invoiceRef = firebase.child(String.valueOf(invoiceKey));
        CompletableFuture<Boolean> completableFuture = new CompletableFuture<>();
        invoiceRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                completableFuture.complete(dataSnapshot.exists());
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                completableFuture.completeExceptionally(databaseError.toException());
            }
        });

        try {
            return completableFuture.get();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    private int generateNumericKey() {
        Random random = new Random();
        return random.nextInt(100000); // Adjust the range based on your needs
    }

    private Map<String, Object> convertInvoiceToMap(Invoice invoice) {
        Map<String, Object> invoiceMap = new HashMap<>();
        invoiceMap.put("id", invoice.getId());
        invoiceMap.put("invoiceNumber", invoice.getInvoiceNumber());
        invoiceMap.put("amount", invoice.getAmount());
        invoiceMap.put("poNumber", invoice.getPurchaseOrder().getPoNumber());
        return invoiceMap;
    }

    public Invoice updateInvoice(Invoice invoice) {
        String invoiceId = invoice.getId();

        if (invoiceId != null) {
            database.child(invoiceId).setValue(invoice);
            return invoice;
        } else {
            return null;
        }
    }

    public Invoice getInvoiceById(String id) {
        DataSnapshot snapshot = database.child(id).getSnapshot();

        if (snapshot.exists()) {
            // Convert the snapshot value to an Invoice object
            Invoice invoice = snapshot.getValue(Invoice.class);
            return invoice;
        } else {
            return null;
        }
    }

    public void deleteInvoice(String id) {
        // Delete the invoice from the database
        database.child(id).removeValue();
    }
}
