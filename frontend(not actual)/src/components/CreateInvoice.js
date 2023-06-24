import React from 'react'

function CreateInvoice() {

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    amount: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInvoiceData((prevState) => ({ ...prevState, [name]: value }));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const createdAt = new Date().toISOString();
    const newInvoice = { ...invoiceData, createAt };

    // Submit invoice data to REST API:
    console.log(invoiceNumber, amount, purchaseOrderRef);

    axios
      .post('http://localhost:8080/api/invoices/create', newInvoice)
      .then((response) => {
        console.log('New invoice created successfully: ', response.data);

        // Reset form data:
        setInvoiceData({
          invoiceNumber: '',
          amount: '',
        });
      })
      .catch((error) => {
        console.error('Error creating invoice:', error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className='create-user-model'>
        <div>
          <label htmlFor="invoiceNumber">Invoice Number</label>
          <input
            type="number"
            id="invoiceNumber"
            name="invoiceNumber"
            value={invoiceData.invoiceNumber}
            onChange={handleChange}
            placeholder='Enter Invoice Number'
            className='form-control'
          />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={invoiceData.amount}
            onChange={handleChange}
            placeholder='Enter Amount'
            className='form-control'
          />
        </div>
        <button type="submit" className='btn btn-primary'>Create Invoice</button>
      </form>
    </div>
  )
}

export default CreateInvoice