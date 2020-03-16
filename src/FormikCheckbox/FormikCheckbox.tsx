import * as React from 'react';
import { useFormikContext } from 'formik';


type Props = {
    name: string;

    render: (props: OutputProps) => React.ReactNode;
}

type OutputProps = {
    name: string;
    value: boolean;
    error: any | null;
    touched: boolean;
    isValid: boolean | null;
    isInvalid: boolean | null;

    onBlur: (e: React.SyntheticEvent) => void;
    onChange: (e: React.SyntheticEvent) => void;
};

export const FormikCheckbox = ({ name, render }: Props) => {
    if (!name) throw new Error(`FormikCheckbox: prop 'name' doesn't exist!`);
    if (!render) throw new Error(`FormikCheckbox: prop 'render' doesn't exist!`);

    const {
        getFieldProps,
        setFieldValue,
        values,
        errors,
        touched,
    }: any = useFormikContext();

    React.useEffect(() => {
        if (typeof values[name] !== 'boolean') {
            setFieldValue(name, false);
        }
    }, []);

    const handleChange = React.useCallback((e: { target: { checked: boolean } }) => {
        setFieldValue(name, e.target.checked);
    }, []);

    const value = typeof values[name] !== 'boolean' ? false : values[name];
    const isValid = touched[name] ? !errors[name] : null;
    const isInvalid = touched[name] ? !!errors[name] : null;
    const error = touched[name] ? errors[name] || null : null;

    return (
        <>
            {
                render({
                    ...getFieldProps(name),
                    value,
                    error,
                    touched: !!touched[name],
                    isValid,
                    isInvalid,
                    onChange: handleChange,
                })
            }
        </>
    );
}
