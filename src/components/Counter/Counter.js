import React from 'react';
import {useState} from 'react';
import usePrevious from '../customHooks/usePrevious';

const Counter =()=>{
    const [count, setCount] = useState(0);
    
    const prevData = usePrevious(count);

    return(
        <div>
            <h2>
                Counter Value : {count} || Old Value : {prevData === undefined ? "undefined" : prevData}
            </h2>
            <button onClick={()=>setCount(count + 1)}>Increment</button>
            <button onClick={()=>setCount(count - 1)}>Decrement</button>
        </div>
    );
}

export default Counter;