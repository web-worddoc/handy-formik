import * as React from 'react';
import { Formik as FormikElement } from 'formik';


type Props = {
    initialValues: Values;

    onSubmit: (values: Values, formikBag: any) => any | void;
    render: (formikProps: OutputProps) => React.ReactNode;
    [key: string]: any
}

type OutputProps = {
    [key: string]: any;
};

type Values = {
    [key: string]: any
}

export const Formik = ({ initialValues, onSubmit, render, ...rest }: Props) => {
    if (!render) throw new Error(`Formik: prop 'render' doesn't exist!`);
    if (!initialValues) throw new Error(`Formik: prop 'initialValues' doesn't exist!`);
    if (!onSubmit) throw new Error(`Formik: prop 'onSubmit' doesn't exist!`);

    return (
        <FormikElement
            enableReinitialize={true}
            validateOnChange={true}
            validateOnBlur={false}
            initialValues={initialValues}
            onSubmit={onSubmit}
            {...rest}
        >
            {(formikProps) => (
                <>
                    {render(formikProps)}
                </>
            )}
        </FormikElement>
    )
}
