import * as React from 'react';
import { Formik as FormikElement } from 'formik';


type Props = {
    initialValues: KeyValue;
    onSubmit: (values: KeyValue[], formikBag: any) => any | void;
    render: (props: OutputProps) => React.ReactNode;
}

type OutputProps= {
    names: OutputNames;
    [key: string]: any;
};

type KeyValue = {
    [key: string]: any
}

type OutputNames = {
    [key: string]: string
}

export const Formik = ({ initialValues, onSubmit, render, ...rest }: Props) => {
    if (!render) throw new Error(`Formik: prop 'render' doesn't exist!`);
    if (!initialValues) throw new Error(`Formik: prop 'initialValues' doesn't exist!`);
    if (!onSubmit) throw new Error(`Formik: prop 'onSubmit' doesn't exist!`);

    const names = {};
    for (let el in initialValues) {
        names[el] = el;
    }

    return (
        <FormikElement
            enableReinitialize={true}
            validateOnChange={false}
            validateOnBlur={true}
            initialValues={initialValues}
            onSubmit={onSubmit}
            {...rest}
            render={(formikProps) => (
                <>
                    {render({ ...formikProps, ...{ names } })}
                </>
            )}
        >
        </FormikElement>
    )
}
