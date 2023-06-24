package com.example.OJTPO.controller;

<<<<<<<< HEAD:backend/src/main/java/com/example/OJTPO/controller/LoginController.java
import java.util.concurrent.CompletableFuture;
========
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
>>>>>>>> 5732c82502a79580f57b6edf6a80274be1a8ba34:backend/po-management/src/main/java/com/example/OJTPO/controller/POcontroller.java

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
<<<<<<<< HEAD:backend/src/main/java/com/example/OJTPO/controller/LoginController.java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.OJTPO.model.User;
import com.example.OJTPO.service.UserService;
========
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.OJTPO.model.PurchaseOrder;
import com.example.OJTPO.service.PurchaseOrderService;
import org.springframework.web.server.ResponseStatusException;
>>>>>>>> 5732c82502a79580f57b6edf6a80274be1a8ba34:backend/po-management/src/main/java/com/example/OJTPO/controller/POcontroller.java

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:5555" })
public class LoginController {

<<<<<<<< HEAD:backend/src/main/java/com/example/OJTPO/controller/LoginController.java
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public CompletableFuture<ResponseEntity<User>> login(@RequestBody User loginUser) {
        return userService.validateUser(loginUser.getUsername(), loginUser.getPassword())
                .thenApply(user -> {
                    if (user != null) {
                        return ResponseEntity.ok(user);
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                    }
                });
========
  @Autowired
  PurchaseOrderService purchaseOrderService;

  // For sales team to create PO:
  @PostMapping("/po/create")
  public ResponseEntity<PurchaseOrder> createPO(@RequestBody PurchaseOrder purchaseOrder) throws Exception {
    PurchaseOrder purchaseOrderResponse = purchaseOrderService.createPO(purchaseOrder);
    if (purchaseOrder != null) {
      return new ResponseEntity<>(purchaseOrderResponse, HttpStatus.CREATED);
>>>>>>>> 5732c82502a79580f57b6edf6a80274be1a8ba34:backend/po-management/src/main/java/com/example/OJTPO/controller/POcontroller.java
    }
    return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
  }

<<<<<<<< HEAD:backend/src/main/java/com/example/OJTPO/controller/LoginController.java
    @PostMapping("/createUser") // Add the createUser endpoint
    public CompletableFuture<ResponseEntity<User>> createUser(@RequestBody User user) {
        return userService.createUser(user)
                .thenApply(createdUser -> {
                    if (createdUser != null) {
                        return ResponseEntity.ok(createdUser);
                    } else {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
                    }
                });
========
  // For sales team to forward PO to finance:
  @PatchMapping("/po/forward")
  public ResponseEntity<PurchaseOrder> forwardPO(@RequestBody PurchaseOrder purchaseOrder) throws ExecutionException, InterruptedException {
    PurchaseOrder purchaseOrderResponse = purchaseOrderService.forwardPO(purchaseOrder);
    if (purchaseOrder != null) {
      return new ResponseEntity<>(purchaseOrderResponse, HttpStatus.OK);
>>>>>>>> 5732c82502a79580f57b6edf6a80274be1a8ba34:backend/po-management/src/main/java/com/example/OJTPO/controller/POcontroller.java
    }
    return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
  }

<<<<<<<< HEAD:backend/src/main/java/com/example/OJTPO/controller/LoginController.java
    @GetMapping("/user/{username}")
    public CompletableFuture<ResponseEntity<User>> getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username)
                .thenApply(user -> {
                    if (user != null) {
                        return ResponseEntity.ok(user);
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                    }
                });
========
  // For finance team to get all billable POs:
  @GetMapping("/po/all")
  public CompletableFuture<List<PurchaseOrder>> getBillablePOs() {
    return purchaseOrderService.getBillablePOs().thenApply(billablePOs -> {
      if (!billablePOs.isEmpty()) {
        return billablePOs;
      } else {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No billable purchase orders found");
      }
    });
  }

  // Get PO by id for sales/finance team to view PO:
  @GetMapping("/po/{id}")
  public CompletableFuture<ResponseEntity<PurchaseOrder>> getPOById(@PathVariable Long id) {
    return purchaseOrderService.getPOById(id).thenApply(purchaseOrder -> {
      if (purchaseOrder != null) {
        return ResponseEntity.status(HttpStatus.FOUND).body(purchaseOrder);
      } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
      }
    });
  }

  // For sales/finance team to update PO:
  @PatchMapping("/po/update/{id}")
  public ResponseEntity<PurchaseOrder> updatePO(@PathVariable Long id, @RequestBody PurchaseOrder purchaseOrder) {
    CompletableFuture<PurchaseOrder> future = purchaseOrderService.updatePO(id, purchaseOrder);
    try {
      PurchaseOrder purchaseOrderResponse = future.get();
      if (purchaseOrderResponse != null) {
        return new ResponseEntity<>(purchaseOrderResponse, HttpStatus.OK);
      } else {
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
      }
    } catch (InterruptedException | ExecutionException e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
>>>>>>>> 5732c82502a79580f57b6edf6a80274be1a8ba34:backend/po-management/src/main/java/com/example/OJTPO/controller/POcontroller.java
    }
  }

  // For sales/finance team to delete PO:
  @DeleteMapping("/po/delete/{id}")
  public ResponseEntity<String> deletePO(@PathVariable("id") Long id) {
    CompletableFuture<String> future = purchaseOrderService.deletePO(id);
    try {
      String purchaseOrderResponse = future.get();
      if (purchaseOrderResponse != null) {
        return new ResponseEntity<String>(purchaseOrderResponse, HttpStatus.NO_CONTENT);
      }
      return new ResponseEntity<>("Purchase Order not found", HttpStatus.NOT_FOUND);
    } catch (InterruptedException | ExecutionException e) {
      return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
