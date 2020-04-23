import React, { useEffect } from 'react';




const Poloniex: React.FC = () => {     
    
    const poloFetch = () => {
        fetch("http://localhost:8080/poloniex/balances", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-type": "application/json"                             
            }                      
        }).then((response) => {
            if(response.ok) {
                response.json().then((result: any) => {
                    console.log(result)
                })
            }
            else {
                console.log(Error)
            }
        })
       
    }
    useEffect(()=> {
        poloFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>

        </div>
    )
}

export default Poloniex;