import { useEffect, useState } from 'react'
import { InputBox } from './components/index.js'
import useCurrencyInfo from './hooks/useCurrencyInfo.js'

function App() {
  const [amount, setAmount] = useState(0)
  const [from, setFrom] = useState('usd')
  const [to, setTo] = useState('inr')
  const currencyInfo = useCurrencyInfo(from)
  const convertedAmount = +(amount * currencyInfo[to] || 0).toFixed(2)
  const options = Object.keys(currencyInfo)

  const swap = () => { setAmount(convertedAmount); setFrom(to); setTo(from); }

  return (
    <div className='w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat'
      style={{ backgroundImage: `url(https://img.magnific.com/free-photo/top-view-desk-with-financial-instruments_23-2148285332.jpg?semt=ais_hybrid&w=740&q=80)` }}>
      <div className='w-full'>
        <div
          className='w-full max-w-md mx-auto border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30'
        >
          <form
            onSubmit={(e) => { e.preventDefault() }}>
            <div className='w-full md-1'>
              <InputBox
                label="From"
                amount={amount}
                selectedCurrency={from}
                onCurrencyChange={(currency) => setFrom(currency)}
                onAmountChange={(amount) => setAmount(amount)}
                currencyOptions={options}
              />
              <div className='relative w-full h-0.5'>
                <button
                  type='button'
                  className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2  border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5'
                  onClick={swap}
                >swap</button>
              </div>
              <InputBox
                label="To"
                selectedCurrency={to}
                amount={convertedAmount}
                onCurrencyChange={(currency) => setTo(currency)}
                currencyOptions={options}
                amountDisabled
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
