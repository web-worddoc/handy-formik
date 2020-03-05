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
    error: string,
    touched: boolean;
    isValid: boolean,
    isInvalid: boolean,
    selectedOption: Option | null,
    options: Option[],

    onBlur: (e: React.SyntheticEvent) => void;
    onChange: (value: any) => void,
}

type Option = {
    label: React.ReactNode;
    value: any;
}

export const FormikSelect = ({ name, render, options }: Props) => {
    if (!name) throw new Error(`FormikSelect: prop 'name' doesn't exist!`);
    if (!render) throw new Error(`FormikSelect: prop 'render' doesn't exist!`);
    if (!options) throw new Error(`FormikSelect: prop 'options' doesn't exist!`);

    const {
        getFieldProps,
        setFieldValue,
        values,
        errors,
        touched,
    }: any = useFormikContext();

    const selectedOption = React.useMemo(() => {
        return options.find((option: Option) => option.value === values[name]) || null;
    }, [options, values]);

    const restOptions = React.useMemo(() => {
        return options.filter((option: Option) => selectedOption ? option.value !== selectedOption.value : null);
    }, [selectedOption])

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
                    selectedOption,
                    options: restOptions,
                    onChange: handleChange,
                })
            }
        </>
    )
}
