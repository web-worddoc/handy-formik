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
    error: any;
    isValid: boolean;
    isInvalid: boolean;
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
    if (!options) throw new Error(`FormikRadio: prop 'options' doesn't exist!`);

    const {
        getFieldProps,
        setFieldValue,
        values,
        errors,
    }: any = useFormikContext();

    const checkedOption = React.useMemo(() => {
        return options.find((option: Option) => option.value === values[name]) || null;
    }, [options, values]);

    const handleChange = React.useCallback((e: { target: { value: any } }) => {
        setFieldValue(name, e.target.value);
    }, [name]);

    return (
        <>
            {
                render({
                    ...getFieldProps(name),
                    error: errors[name],
                    isValid: !errors[name] && !!values[name],
                    isInvalid: !!errors[name],
                    checkedOption,
                    options,
                    onChange: handleChange,
                })
            }
        </>
    );
}