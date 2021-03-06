import * as React from 'react';
import { Form, useFormikContext } from 'formik';


type Props = {
    render: (formikProps: OutputProps) => React.ReactNode;
    [key: string]: any;
}

type OutputProps = {
    names: Names;
    [key: string]: any;
}

type Names = {
    [key: string]: string
}

export const FormikForm = React.forwardRef(({ render, ...rest }: Props, formRef: React.RefObject<HTMLFormElement>) => {
    if (!render) throw new Error(`FormikForm: prop 'render' doesn't exist!`);

    const { initialValues } = useFormikContext();
    const names: Names = React.useMemo(() => {
        const res = {};
        for (let el in initialValues) {
            res[el] = el;
        }
        return res;
    }, [initialValues]);

    return (
        <Form ref={formRef} {...rest}>
            {render({
                ...useFormikContext(),
                names
            })}
        </Form>
    )
})
