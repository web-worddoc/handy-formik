import * as React from 'react';
import { useFormikContext } from 'formik';


type Props = {
    name: string;
    options: Option[];

    render: (props: OutputProps) => React.ReactNode;
}

type OutputProps = {
    name: string;
    value: any;
    error: any | null;
    touched: boolean;
    isValid: boolean | null;
    isInvalid: boolean | null;
    checkedOption: Option | null;
    options: Option[];

    onBlur: (e: React.SyntheticEvent) => void;
    onChange: (e: React.SyntheticEvent) => void;
};

type Option = {
    label: React.ReactNode;
    value: any;
}

export const FormikRadio = ({ name, render, options }: Props) => {
    if (!name) throw new Error(`FormikRadio: prop 'name' doesn't exist!`);
    if (!render) throw new Error(`FormikRadio: prop 'render' doesn't exist!`);
    if (!options || !Array.isArray(options)) throw new Error(`FormikRadio: prop 'options' doesn't exist or not an array!`);

    const {
        getFieldProps,
        setFieldValue,
        values,
        errors,
        touched,
    }: any = useFormikContext();

    const checkedOption = React.useMemo(() => {
        return options.find((option: Option) => option.value === values[name]) || null;
    }, [options, values]);

    const handleChange = React.useCallback((e: { target: { value: any } }) => {
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
                    checkedOption,
                    options,
                    onChange: handleChange,
                })
            }
        </>
    );
}
