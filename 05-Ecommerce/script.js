//script for scalable E-commerce 
document.addEventListener('DOMContentLoaded', () => {

  //let first add some products into the quae
  const products = [
    { id: 1, name: 'Acer aspire lite R7', price: 45000.00 },
    { id: 2, name: 'Odptials', price: 1999.99 },
    { id: 3, name: 'All AI subcription', price: 18900.00 }
  ]
  let cart = JSON.parse(localStorage.getItem('cart'))|| []

  //Grabed all the elements to be used
  const productlist = document.getElementById('product-list')
  const cartItems = document.getElementById('cart-items')
  const emptyCart = document.getElementById('empty-cart')
  const totalDisplay = document.getElementById('cart-total')
  const totalprice = document.getElementById('total-price')
  const CheckBtn = document.getElementById('checkout-btn')

  renderCart()
  //Load products into display
  products.forEach(item => {
    const product = document.createElement('p')
    product.classList.add('product')
    product.innerHTML = `
    <span>${item.name} - $${item.price.toFixed(2)} </span>
    <button data-id="${item.id}">Add to cart </button>`
    productlist.appendChild(product)
  })

  productlist.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const productId = (e.target.getAttribute('data-id'));
      const product = products.find(p => p.id === Number(productId))
      addToCart(product)
    }
  })

  CheckBtn.addEventListener('click', () => {
    //clearing art
    cart = []
    alert('Checkout Succesfully!') //msg
    renderCart()
    saveCart()
  })

  function addToCart(product) {
    const prod = {
      id: Date.now(),
      name: product.name,
      price: product.price
    }
    cart.push(prod)
    saveCart()
    renderCart()
  }

  //renders Cart
  function renderCart() {
    cartItems.innerText = ""
    if (cart.length) {
      emptyCart.classList.add('hidden')
      totalDisplay.classList.remove('hidden')

      //adding it to cart
      cart.forEach(item => {
        const cartitem = document.createElement('p')
        cartitem.classList.add('cart-product')
        cartitem.innerHTML = `
        ${item.name}-$${item.price}
        <button data-id="${item.id}">Remove</button>`
        cartItems.appendChild(cartitem)
      })

      cartItems.querySelector('button').addEventListener('click', (e) => {
          let itemId  = Number(e.target.getAttribute('data-id'))
          cart = cart.filter(p => p.id !== itemId)
          renderCart()
          saveCart()
        })

      let total = cart.reduce((total, nextProduct) => total + nextProduct.price, 0)
      totalprice.innerText = `$${total.toFixed(2)}`
    } else {
      emptyCart.classList.remove('hidden')
      totalDisplay.classList.add('hidden')
      totalprice.innerText = "$0.00"
    }
  }

  function saveCart(){
    localStorage.setItem('cart',JSON.stringify(cart))
  }
})