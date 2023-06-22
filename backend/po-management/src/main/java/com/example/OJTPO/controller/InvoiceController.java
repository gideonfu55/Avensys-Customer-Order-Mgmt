package com.example.OJTPO.controller;

import com.example.OJTPO.model.Invoice;
import com.example.OJTPO.service.InvoiceService;

import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {    "http://localhost:3000", "http://127.0.0.1:55 5 5 " })
@RequestMapping("/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @Autowired
    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping
    public CompletableFuture<Invoice> createInvoice(@RequestBody Invoice invoice) {
        return invoiceService.createInvoice(invoice);
    }

    @PutMapping("/{id}")
    public CompletableFuture<Invoice> updateInvoice(@RequestBody Invoice invoice, @PathVariable String id) {
        return invoiceService.updateInvoice(invoice, id);
    }

    @GetMapping("/{id}")
    public CompletableFuture<Invoice> getInvoiceById(@PathVariable String id) {
        return invoiceService.getInvoiceById(id);
    }

    @DeleteMapping("/{id}")
    public CompletableFuture<Invoice> deleteInvoice(@PathVariable String id) {
        return invoiceService.deleteInvoice(id);
    }
}
