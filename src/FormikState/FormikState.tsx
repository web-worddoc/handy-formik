import * as React from 'react';
import { useFormikContext } from 'formik';

import { shouldUpdate } from './../utils';


type Props = {
    render: (props: OutputProps) => React.ReactNode;
}

type OutputProps = {
    [key: string]: any,
}

export const FormikState = React.memo(({ render }: Props) => {
    if (!render) throw new Error(`FormikState: prop 'render' doesn't exist!`);

    return (
        <>
            {render(useFormikContext())}
        </>
    )
}, shouldUpdate)
