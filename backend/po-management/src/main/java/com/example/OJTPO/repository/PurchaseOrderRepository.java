package com.example.OJTPO.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.OJTPO.model.PurchaseOrder;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
  
}
