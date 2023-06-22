package com.example.OJTPO.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
<<<<<<< HEAD

=======
>>>>>>> 769f0af95eeda2abe1140d25078a2a00eb83d546
import com.example.OJTPO.repository.InvoiceRepository;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;
<<<<<<< HEAD
    
}
=======

    public Invoice saveInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    public Invoice updateInvoice(Invoice invoice) {
        if (invoiceRepository.existsById(invoice.getId())) {
            return invoiceRepository.save(invoice);
        } else {
            return null;
        }
    }

    public Invoice getInvoiceById(int id) {
        return invoiceRepository.findById(id).orElse(null);
    }

    public void deleteInvoice(int id) {
        invoiceRepository.deleteById(id);
    }
}
>>>>>>> 769f0af95eeda2abe1140d25078a2a00eb83d546
