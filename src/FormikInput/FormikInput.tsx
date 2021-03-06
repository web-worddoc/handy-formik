import * as React from 'react';
import { useFormikContext } from 'formik';


type Props = {
    name: string;

    render: (props: OutputProps) => React.ReactNode;
}

type OutputProps = {
    name: string;
    value: any;
    error: any | null;
    touched: boolean;
    isValid: boolean | null;
    isInvalid: boolean | null;

    onBlur: (e: React.SyntheticEvent) => void;
    onChange: (e: React.SyntheticEvent) => void;
};

export const FormikInput = ({
    name,
    render,
}: Props) => {
    if (!name) throw new Error(`FormikInput: prop 'name' doesn't exist!`);
    if (!render) throw new Error(`FormikInput: prop 'render' doesn't exist!`);

    const {
        getFieldProps,
        setFieldValue,
        values,
        errors,
        touched,
    }: any = useFormikContext();

    const handleChange = React.useCallback((e: { target: { value: string } }) => {
        setFieldValue(name, e.target.value);
    }, []);

    const isValid = touched[name] ? !errors[name] && (typeof values[name] === 'number' ? isFinite(values[name]) : !!values[name]) : null;
    const isInvalid = touched[name] ? !!errors[name] : null;
    const error = touched[name] ? errors[name] || null : null;

    return (
        <>
            {
                render({
                    ...getFieldProps(name),
                    error,
                    touched: !!touched[name],
                    isValid,
                    isInvalid,
                    onChange: handleChange
                })
            }
        </>
    )
}
