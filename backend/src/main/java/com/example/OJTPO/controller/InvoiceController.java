package com.example.OJTPO.controller;

import com.example.OJTPO.model.Invoice;
import com.example.OJTPO.service.InvoiceService;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:5555 " })
@RequestMapping("/api")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping("/invoices/create")
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice) throws Exception {
        Invoice invoiceResponse = invoiceService.createInvoice(invoice);
        if (invoiceResponse != null) {
            return new ResponseEntity<>(invoiceResponse, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }
    
//    @PostMapping("/invoices/create")
//    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice) {
//      try {
//        Invoice createdInvoice = invoiceService.createInvoice(invoice);
//        return new ResponseEntity<>(createdInvoice, HttpStatus.CREATED);
//      } catch (IllegalArgumentException e) {
//        return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
//      } catch (Exception e) {
//        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
//      }
//    }

    



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
