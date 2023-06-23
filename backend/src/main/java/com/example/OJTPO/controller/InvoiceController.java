package com.example.OJTPO.controller;

import com.example.OJTPO.model.Invoice;
import com.example.OJTPO.service.InvoiceService;

import java.util.concurrent.CompletableFuture;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:55 5 5 " })
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
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

    // @PostMapping("/invoices/{id}")
    // public CompletableFuture<Invoice> createInvoice(@RequestBody Invoice invoice) {
    //     return invoiceService.createInvoice(invoice);
    // }

    // @PatchMapping("/invoices/{id}")
    // public CompletableFuture<Invoice> updateInvoice(@RequestBody Invoice invoice, @PathVariable String id) {
    //     return invoiceService.updateInvoice(invoice, id);
    // }

    // @DeleteMapping("/invoices/{id}")
    // public CompletableFuture<Invoice> deleteInvoice(@PathVariable String id) {
    //     return invoiceService.deleteInvoice(id);
    // }
}
