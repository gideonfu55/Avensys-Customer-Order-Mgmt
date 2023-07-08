package com.example.OJTPO.controller;

import com.example.OJTPO.model.Invoice;
import com.example.OJTPO.service.InvoiceService;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:5555 " })
@RequestMapping("/api")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @Autowired
    private Storage storage;

    private static String UPLOAD_DIR = "uploads/invoice/";

    @PostMapping("/invoices/create")
    public ResponseEntity<?> createInvoice(@RequestParam("file") MultipartFile file, Invoice invoice) {
        try {

            // Upload file to Google Cloud Storage and get the download URL
            String bucketName = "avensys-ojt.appspot.com";
            String objectName = UPLOAD_DIR + invoice.getInvoiceNumber() + "/" + file.getOriginalFilename();

            BlobId blobId = BlobId.of(bucketName, objectName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();

            // Upload the file to Google Cloud Storage
            storage.create(blobInfo, file.getBytes());

            // Get the download URL
            String fileUrl = String.format("https://storage.googleapis.com/%s/%s", bucketName, objectName);

            // Set the fileUrl field in the invoice
            invoice.setFileUrl(fileUrl);

            // Save invoice
            Invoice invoiceResponse = invoiceService.createInvoice(invoice);

            if (invoiceResponse != null) {
                return new ResponseEntity<Invoice>(invoiceResponse, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/invoices/all")
    public CompletableFuture<List<Invoice>> getAllInvoices() {
        return invoiceService.getAllInvoices().thenApply(invoices -> {
            if (invoices != null) {
                return invoices;
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invoices not found");
            }
        });
    }

    @GetMapping("/invoices/{id}")
    public CompletableFuture<ResponseEntity<Invoice>> getInvoiceById(@PathVariable Long id) {
        return invoiceService.getInvoiceById(id).thenApply(invoice -> {
            if (invoice != null) {
                return ResponseEntity.status(HttpStatus.FOUND).body(invoice);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        });
    }

    @PatchMapping("/invoices/update/{id}")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable Long id, @RequestBody Invoice invoice) {
        CompletableFuture<Invoice> future = invoiceService.updateInvoice(id, invoice);
        try {
            Invoice invoiceResponse = future.get();
            if (invoiceResponse != null) {
                return new ResponseEntity<>(invoiceResponse, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (InterruptedException | ExecutionException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/invoices/delete/{id}")
    public ResponseEntity<String> deleteInvoice(@PathVariable("id") Long id) {
        CompletableFuture<String> future = invoiceService.deleteInvoice(id);
        try {
            String invoiceResponse = future.get();
            if (invoiceResponse != null) {
                return new ResponseEntity<String>(invoiceResponse, HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>("Invoice not found", HttpStatus.NOT_FOUND);
        } catch (InterruptedException | ExecutionException e) {
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
