import * as React from 'react';
import { Formik as FormikElement } from 'formik';


type Props = {
    initialValues: Values;

    onSubmit: (values: Values, formikBag: any) => any | void;
    render: (formikProps: OutputProps) => React.ReactNode;
}

type OutputProps = {
    names: Names;
    [key: string]: any;
};

type Names = {
    [key: string]: string
}

type Values = {
    [key: string]: any
}

export const Formik = ({ initialValues, onSubmit, render, ...rest }: Props) => {
    if (!render) throw new Error(`Formik: prop 'render' doesn't exist!`);
    if (!initialValues) throw new Error(`Formik: prop 'initialValues' doesn't exist!`);
    if (!onSubmit) throw new Error(`Formik: prop 'onSubmit' doesn't exist!`);

    const names = React.useMemo(() => {
        const res = {};
        for (let el in initialValues) {
            res[el] = el;
        }
        return res;
    }, [initialValues]);

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
                    {render({
                        ...formikProps,
                        ...{ names },
                    })}
                </>
            )}
        >
        </FormikElement>
    )
}