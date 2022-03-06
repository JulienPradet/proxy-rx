import { ReactElement, useEffect, useState } from "react";
import { Observable } from "rxjs";

function Stream <T>({data$, children}: {data$: Observable<T>, children: (value?: T) => ReactElement}): ReactElement {
    const [state, setState] = useState<T>();
    useEffect(() => {
        const subscription = data$.subscribe((value) => {
            setState(value)
        })
        return subscription.unsubscribe;
    }, [data$])

    return <>
        {children(state)}
    </>
}

export {Stream}