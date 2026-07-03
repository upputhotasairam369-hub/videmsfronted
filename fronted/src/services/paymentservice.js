export const initializeRazorpay = (orderData, onSuccess, onError) => {
  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    amount: orderData.amount * 100,
    currency: 'INR',
    name: 'Wooden Street',
    description: `Order #${orderData.receipt}`,
    order_id: orderData.id,
    handler: function (response) {
      onSuccess({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });
    },
    prefill: {
      name: orderData.customer_name,
      email: orderData.customer_email,
      contact: orderData.customer_phone,
    },
    notes: {
      address: orderData.address,
    },
    theme: {
      color: '#b45309',
    },
    modal: {
      ondismiss: function () {
        onError('Payment cancelled by user');
      },
    },
  };

  if (orderData.emi_plan) {
    options.emi = true;
    options.method = {
      emi: true,
      card: true,
      netbanking: true,
      upi: true,
      wallet: true,
    };
  }

  const rzp = new window.Razorpay(options);
  rzp.open();
};
