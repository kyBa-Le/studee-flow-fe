import { useEffect, useRef } from "react";

export function useUpdateEffect(callback, dependencies) {
    const hasMounted = useRef(false);

    useEffect(() => {
      if (hasMounted.current) {
        callback();
      } else {
        hasMounted.current = true;
      }
    }, [...dependencies]);
    

}