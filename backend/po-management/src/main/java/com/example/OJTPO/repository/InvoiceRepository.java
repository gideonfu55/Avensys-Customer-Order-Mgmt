package com.example.OJTPO.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

public interface InvoiceRepository extends CrudRepository<Invoice, Integer> {
    
}