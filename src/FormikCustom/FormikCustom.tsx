import * as React from 'react';
import { useFormikContext } from 'formik';


type Props = {
    name: string;
    render: (props: OutputProps) => React.ReactNode;
}

type OutputProps = {
    name: string;
    value: any;
    error: string;
    isValid: boolean;
    isInvalid: boolean;
    formikBag: any;
    onBlur: (e: React.SyntheticEvent) => void;
    onChange: (value: any) => void;
};

export const FormikCustom = ({ name, render }: Props) => {
    if (!name) throw new Error(`FormikCustom: prop 'name' doesn't exist!`);
    if (!render) throw new Error(`FormikCustom: prop 'render' doesn't exist!`);

    const {
        getFieldProps,
        setFieldValue,
        values,
        errors,
    }: any = useFormikContext();

    const handleChange = React.useCallback((value: any) => {
        setFieldValue(name, value);
    }, [name]);

    return (
        <>
            {
                render({
                    ...getFieldProps(name),
                    error: errors[name],
                    isValid: !errors[name] && !!values[name],
                    isInvalid: !!errors[name],
                    formikBag: useFormikContext(),
                    onChange: handleChange,
                })
            }
        </>
    )
}
