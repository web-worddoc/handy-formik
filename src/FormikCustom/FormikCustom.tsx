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
    touched: boolean;
    isValid: boolean;
    isInvalid: boolean;

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
        touched,
    }: any = useFormikContext();

    const handleChange = React.useCallback((value: any) => {
        setFieldValue(name, value);
    }, [name]);

    const isValid = touched[name] && !errors[name] && (typeof values[name] === 'number' ? isFinite(values[name]) : !!values[name]);
    const isInvalid = touched[name] && !!errors[name];

    return (
        <>
            {
                render({
                    ...getFieldProps(name),
                    error: errors[name],
                    touched: !!touched[name],
                    isValid,
                    isInvalid,
                    onChange: handleChange,
                })
            }
        </>
    )
}
