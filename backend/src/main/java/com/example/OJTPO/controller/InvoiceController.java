package com.example.OJTPO.controller;

import com.example.OJTPO.model.Invoice;
import com.example.OJTPO.service.InvoiceService;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:5555 " })
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createInvoice(@RequestParam("file") MultipartFile file, Invoice invoice) {
        try {
            CompletableFuture<Invoice> future = invoiceService.createInvoice(file, invoice);
            Invoice invoiceResponse = future.get();

            if (invoiceResponse != null) {
                return new ResponseEntity<>(invoiceResponse, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("An error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/all")
    public CompletableFuture<List<Invoice>> getAllInvoices() {
        return invoiceService.getAllInvoices().thenApply(invoices -> {
            if (invoices != null) {
                return invoices;
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invoices not found");
            }
        });
    }

    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<Invoice>> getInvoiceById(@PathVariable Long id) {
        return invoiceService.getInvoiceById(id).thenApply(invoice -> {
            if (invoice != null) {
                return ResponseEntity.status(HttpStatus.FOUND).body(invoice);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        });
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<Invoice> updateInvoice (
        @PathVariable Long id, 
        Invoice invoice,
        @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        try {
            CompletableFuture<Invoice> future = invoiceService.updateInvoice(id, invoice, file);
            Invoice invoiceResponse = future.get();
            if (invoiceResponse != null) {
                return new ResponseEntity<>(invoiceResponse, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
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

    // For admin to delete all invoices without a corresponding Purchase Order Number in DB
    @DeleteMapping("/deleteOrphanInvoices")
    public ResponseEntity<String> deleteInvoicesWithoutMatchingPO() {
        try {
            CompletableFuture<String> future = invoiceService.deleteInvoicesWithoutMatchingPO();
            String response = future.get();
            return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // For checking if Invoice Number is unique:
    @GetMapping("/checkInvNum/{invoiceNumber}")
    public ResponseEntity<Boolean> checkInvNum(@PathVariable String invoiceNumber) {
        CompletableFuture<Boolean> future = invoiceService.checkInvNum(invoiceNumber);
        try {
            Boolean response = future.get();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
