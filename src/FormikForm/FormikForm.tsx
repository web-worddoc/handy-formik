import * as React from 'react';
import { Form, useFormikContext } from 'formik';

import { shouldUpdate } from './../utils';


type Props = {
    render: (formikProps: OutputProps) => React.ReactNode;
}

type OutputProps = {
    [key: string]: any;
}

export const FormikForm = React.memo(React.forwardRef(({ render, ...rest }: Props, formRef: React.RefObject<HTMLFormElement>) => {
    if (!render) throw new Error(`FormikForm: prop 'render' doesn't exist!`);

    return (
        <Form ref={formRef} {...rest}>
            {render(useFormikContext())}
        </Form>
    )
}), shouldUpdate)
