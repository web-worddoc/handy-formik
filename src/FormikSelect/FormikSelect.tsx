import * as React from 'react';
import { useFormikContext } from 'formik';

import { shouldUpdate } from './../utils';


type Props = {
    name: string;
    options: Option[];

    render: (props: OutputProps) => React.ReactNode;
}

type OutputProps = {
    name: string;
    value: any;
    error: string | null,
    touched: boolean;
    isValid: boolean | null,
    isInvalid: boolean | null,
    selectedOption: Option | null,
    options: Option[],

    onBlur: (e: React.SyntheticEvent) => void;
    onChange: (value: any) => void,
}

type Option = {
    label: React.ReactNode;
    value: any;
}

export const FormikSelect = React.memo(({ name, render, options }: Props) => {
    if (!name) throw new Error(`FormikSelect: prop 'name' doesn't exist!`);
    if (!render) throw new Error(`FormikSelect: prop 'render' doesn't exist!`);
    if (!options || !Array.isArray(options)) throw new Error(`FormikSelect: prop 'options' doesn't exist or not an array!`);

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
        return options.filter((option: Option) => selectedOption ? option.value !== selectedOption.value : option.value);
    }, [selectedOption])

    const handleChange = React.useCallback((value: any) => {
        setFieldValue(name, value);
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
                    selectedOption,
                    options: restOptions,
                    onChange: handleChange,
                })
            }
        </>
    )
}, shouldUpdate)
