async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': '1'
      },
      body: JSON.stringify({
        customerName: "Test",
        addressLine: "123 Test St",
        city: "Test",
        state: "Test",
        postalCode: "110001",
        paymentMethod: "upi",
        couponCode: ""
      })
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
test();
