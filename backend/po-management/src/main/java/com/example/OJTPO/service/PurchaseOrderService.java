package com.example.OJTPO.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.OJTPO.model.PurchaseOrder;
import com.example.OJTPO.repository.PurchaseOrderRepository;

@Service
public class PurchaseOrderService {
  
  @Autowired
  private PurchaseOrderRepository purchaseOrderRepository;

  // All CRUD operations:

  // For sales:
  public PurchaseOrder createPO(PurchaseOrder purchaseOrder) {
    return purchaseOrderRepository.save(purchaseOrder);
  }

  public PurchaseOrder forwardPO(PurchaseOrder purchaseOrder) {
    purchaseOrder.setStatus("Billable"); 
    return purchaseOrderRepository.save(purchaseOrder);
  }

  // For finance:
  public List<PurchaseOrder> getBillablePOs() {
    return purchaseOrderRepository.findAll()
      .stream()
      .filter(po -> po.getStatus().equals("Billable"))
      .collect(Collectors.toList());
  }

  public PurchaseOrder getPOById(Long id) {
    return purchaseOrderRepository.findById(id).orElse(null);
  }

  public PurchaseOrder updatePO(PurchaseOrder purchaseOrder) {
    return purchaseOrderRepository.save(purchaseOrder);
  }

  public PurchaseOrder deletePO(Long id) {
    PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id).orElse(null);
    purchaseOrderRepository.deleteById(id);
    return purchaseOrder;
  }

}
