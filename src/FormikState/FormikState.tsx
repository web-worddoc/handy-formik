import * as React from 'react';
import { useFormikContext } from 'formik';


type Props = {
    render: (props: OutputProps) => React.ReactNode;
}

type OutputProps = {
    [key: string]: any,
}

export const FormikState = ({ render }: Props) => {
    if (!render) throw new Error(`FormikState: prop 'render' doesn't exist!`);

    return (
        <>
            {render(useFormikContext())}
        </>
    )
}
