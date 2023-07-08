package com.example.OJTPO.controller;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.example.OJTPO.model.PurchaseOrder;
import com.example.OJTPO.service.PurchaseOrderService;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;

@RestController
@RequestMapping("/api/po")
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:5555" })
public class PurchaseOrderController {

  @Autowired
  PurchaseOrderService purchaseOrderService;

  @Autowired
  private Storage storage;

  private static String UPLOAD_DIR = "uploads/po/";

  // For sales team to create PO:
  @PostMapping("/create")
  public ResponseEntity<?> createPO (
    @RequestParam("poNumber") String poNumber,
    @RequestParam("prjNumber") String prjNumber,
    @RequestParam("clientName") String clientName,
    @RequestParam("startDate") String startDate,
    @RequestParam("endDate") String endDate,
    @RequestParam("totalValue") double totalValue,
    @RequestParam("balValue") double balValue,
    @RequestParam("milestone") String milestone,
    @RequestParam("type") String type,
    @RequestParam("status") String status,
    @RequestParam("file") MultipartFile file
  ) {

    try {
      // Check poNumber
      if (poNumber == null || poNumber.isEmpty()) {
        return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
      }

      // Upload file to Google Cloud Storage and get the download URL
      String bucketName = "avensys-ojt.appspot.com";
      String objectName = UPLOAD_DIR + poNumber + "/" + file.getOriginalFilename();

      BlobId blobId = BlobId.of(bucketName, objectName);
      BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();

      // Upload the file to Google Cloud Storage
      storage.create(blobInfo, file.getBytes());

      // Get the download URL
      String fileUrl = String.format("https://storage.googleapis.com/%s/%s", bucketName, objectName);

      System.out.println(fileUrl);

      PurchaseOrder purchaseOrder = new PurchaseOrder(
        poNumber,
        prjNumber,
        clientName,
        startDate,
        endDate,
        totalValue,
        balValue,
        milestone,
        type,
        status
      );

      // Set fileUrl to purchaseOrder
      purchaseOrder.setFileUrl(fileUrl);

      PurchaseOrder purchaseOrderResponse = purchaseOrderService.createPO(purchaseOrder);

      if (purchaseOrderResponse != null) {
        return new ResponseEntity<>(purchaseOrderResponse, HttpStatus.CREATED);
      } else {
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
      }

    } catch (Exception e) {
      e.printStackTrace();
      return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  // For sales team to forward PO to finance:
  @PatchMapping("/forward")
  public ResponseEntity<PurchaseOrder> forwardPO(@RequestBody PurchaseOrder purchaseOrder) throws ExecutionException, InterruptedException {
    PurchaseOrder purchaseOrderResponse = purchaseOrderService.forwardPO(purchaseOrder);
    if (purchaseOrder != null) {
      return new ResponseEntity<>(purchaseOrderResponse, HttpStatus.OK);
    }
    return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
  }

  // For finance team to get all billable POs:
  @GetMapping("/all")
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
  @GetMapping("/{id}")
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
  @PatchMapping("/update/{id}")
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
    }
  }

  // For sales/finance team to delete PO:
  @DeleteMapping("/delete/{id}")
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

  // For checking if the PO is unique:
  @GetMapping("/check/{poNumber}")
  public ResponseEntity<?> checkPONumberExists(@PathVariable String poNumber) {
    CompletableFuture<Boolean> future = purchaseOrderService.checkPONumberExists(poNumber);
    try {
      Boolean purchaseOrderResponse = future.get();
      if (purchaseOrderResponse) {
        return new ResponseEntity<>(true, HttpStatus.OK);
      }
      return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
    } catch (InterruptedException | ExecutionException e) {
      return new ResponseEntity<>(false, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
