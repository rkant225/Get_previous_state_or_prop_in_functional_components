import {useEffect, useRef} from 'react';

const usePrevious = (newValue) =>{
    const ref = useRef();

    useEffect(()=>{
        ref.current = newValue;
    });

    return ref.current;
}

export default usePrevious;

// EXPLAINATION :

// Accessing the previous props or state from within a functional component is one of those deceptively simple problems you’ll likely face as you work with React Hooks.
// There’s currently no React Hook that does this out of the box, but you can manually retrieve either the previous state or props from within a functional component by leveraging the useRef hook.
// How?
// The solution is discussed in the official React documentation, and if you look in there you’ll find the following example, where Counter represents a simple counter component
    // function Counter() {
    //     const [count, setCount] = useState(0);
    //     const prevCountRef = useRef();
    //     useEffect(() => {
    //       prevCountRef.current = count;
    //     });
    //     const prevCount = prevCountRef.current;
    //     return (
    //          <h1>Now: {count}, before: {prevCount}</h1>
    //          <button onClick={()=>setCount(count + 1)}>Increment</button>
    //          <button onClick={()=>setCount(count - 1)}>Decrement</button>
    //        );
    // }

// If you’re looking for an even quicker solution, you may abstract this functionality Into the custom Hook below:
    // function usePrevious(value) {
    //   const ref = useRef();
    //   useEffect(() => {
    //     ref.current = value;
    //   });
    //   return ref.current;
    // }

// And use it within your application as follows:
    // function Counter() {
    //  const [count, setCount] = useState(0);
    //  const prevCount = usePrevious(count)
    //  return (
    //      <h1>Now: {count}, before: {prevCount}</h1>
    //      <button onClick={()=>setCount(count + 1)}>Increment</button>
    //      <button onClick={()=>setCount(count - 1)}>Decrement</button>
    //    );
    // }

// But how this works???

// useRef: The unsung Hooks hero
    // Apart from being great at handling DOM refs, the useRef hook is a perfect substitute for implementing instance-like variables within functional components.
    // What’s interesting about the useRef hook is that it takes in an initial value to be stored — i.e: useRef("INITIAL_VALUE") — and it returns an object with a current property {current: "INITIAL_VALUE"}.
    // Whatever value was initially passed into the useRef Hook is saved to the current property of the ref object.
    // const specialVariable = useRef("SPECIAL_VARAIBLE");  // Here "specialVariable" resolves to {current: "SPECIAL_VARIABLE"}
    // NOTE : Unlike a ‘normal’ variable, the specialVariable ref object is not recomputed when the Count component is re-rendered. With the useRef Hook, the value saved in the ref object is kept the same across re-renders. The value is not recomputed, nor is it lost. It remains the same.
    // The only way to update the ref object is to directly set the value of the current property; e.g. specialVariable.current = "NEW_SPECIAL_VARIABLE.

// Now, as soon as the rendering process for the Counter app begins, what happens?
    // (1) The useState hook is invoked and the variables count and setCount set. Note that count is now 0.
    // (2) the usePrevious Hook is invoked with the current value of the count state variable, 0.
    // (3) A new ref object is created. This ref object is initialized without an initial value, so the object returned is this: {current: undefined}
        // (4)th step is where most people slip up.
    // (4) The useEffect call is NOT invoked. Instead, the return value of the custom Hook is invoked.
        // ref.current is returned, which in this case is undefined.
        // Why this behavior? i.e skipping the useEffect call?
        // Well, the useEffect hook is only invoked after the component from which it is called has been rendered (i.e, the return value of the component must be executed first.
    // (5) The execution within the component is resumed. This time, the prevCount variable holds the value undefined.
    // (6) Next, the return value of the component is evaluated.
        // This returns the following to the screen: <h1>Now: {count}, before: {prevCount}</h1>, where count and prevCount are 0 and undefined.
    // (7) The useEffect call within the usePrevious hook is now invoked asynchronously in order to avoid blocking the browser from painting the DOM changes. useEffect is invoked after the render of the functional component.
        // Here’s what we have within the effect function:
            // useEffect(() => {
            //     ref.current = value;
            // });
        // The line within the useEffect function updates the current property of the ref object to value. What’s the value now?
        // value represents what the custom Hook was initially called with.
        // In this case, the value is 0. In this current flow, remember usePrevious has only been called once with the initial value of 0.
        // Now, the ref holds the value 0.
    // (8) What happens when the count state variable within the app is updated from 0 to 1 (or a new count)?
        // The same flow is re-triggered.
        // The usePrevious Hook is invoked with the new state value 1. Then, the return statement is evaluated (return ref.current), which would be 0 — not 1 since the ref object isn’t updated yet.
        // ref.current here is the previous value stored before the useEffect was triggered, or 0.
        // The return statement of the component is equally evaluated with the previous value successfully returned.
        // Only after the render is the useEffect call within the usePrevious Hook updated with the new value, 1.
        // This cycle continues – and in this way, you’ll always get the previous value passed into the custom Hook, usePrevious.
// Why this Works
    // To appreciate why this works this way, you must remember the following:
        // 1. The ref object will always return the same value held in ref.current, except when explicitly updated.
        // 2. useEffect is only called after the component is rendered with the previous value. Only after the render is done is the ref object updated within useEffect.
    // By taking advantage of these two facts, you can easily replicate this functionality on your own.


