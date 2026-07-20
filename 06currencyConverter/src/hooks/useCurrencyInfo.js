import { use, useEffect, useState } from "react"

function useCurrencyInfo(currency) {
    const [data, setData] = useState({})

    useEffect(() => {
        fetch(`https://api.frankfurter.dev/v2/rates?base=${currency}`)
            .then(async (res) => await res.json())
            .then((res) => {
                let currencyInfo = {}                   
                for (let i = 0; i < res.length; i++) {
                    let {quote, rate} = res[i]; 
                    quote = quote.toLowerCase()                   
                    currencyInfo[quote] = rate                                        
                }
                setData(currencyInfo)
            })
    }, [currency])
    return data;
}

export default useCurrencyInfo
