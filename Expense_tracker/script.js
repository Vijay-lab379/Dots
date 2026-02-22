document.addEventListener('DOMContentLoaded', () => {
  //grab the vars
  const ExpenseForm = document.getElementById('expense-form')
  const Name_Expense = document.getElementById('expense-name')
  const Amount_Expense = document.getElementById('expense-amount')
  const list_Expences = document.getElementById('expense-list')
  const total_amount_display = document.getElementById('total-amount')

  let expences = JSON.parse(localStorage.getItem('expence')) || []
  render_expences()

  ExpenseForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const name = Name_Expense.value.trim()
    const amount = parseFloat(Amount_Expense.value.trim())

    if (name !== "" && !isNaN(amount) && amount > 0) {
      const Expense = {
        id: Date.now(),
        Name: name,
        Amount: amount
      }

      //add the expense array
      expences.push(Expense)
      save_expences()
      render_expences()

      //clear the inputs
      Name_Expense.value = ""
      Amount_Expense.value = ""

      //load to display
      render_expences()
      save_expences()
    }
  })

  //Delete logic
  list_Expences.addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON") {
      const item_id = Number(e.target.getAttribute('data-id'))
      expences = expences.filter(exp => exp.id !== item_id)
      save_expences()
      render_expences()
    }
  })

  function render_expences() {
    //first clear display list
    list_Expences.innerHTML = ""

    //load each item 
    expences.forEach(item => {
      const exp = document.createElement('li') 
      exp.setAttribute('data-id', item.id)
      exp.innerHTML = `<span>${item.Name} - $${item.Amount}</span><button data-id="${item.id}">Delete</button>`
      list_Expences.appendChild(exp)
    })
    
    const total = calculate_total()
    total_amount_display.innerText = total
  }

  function calculate_total() {
    return expences.reduce((total, exp2) => total + exp2.Amount, 0)
  }

  function save_expences() {
    localStorage.setItem('expence', JSON.stringify(expences))
  }

})