import * as React from 'react';
import { useFormikContext } from 'formik';


type Props = {
    name: string;
    render: (props: OutputProps) => React.ReactNode;
    options: Option[];
}

type OutputProps = {
    name: string;
    value: any;
    error: string,
    valid: boolean,
    isInvalid: boolean,
    selectedOption: Option,
    options: Option[],
    formikBag: any,
    onBlur: (e: React.SyntheticEvent) => void;
    onChange: (value: any) => void,
    [key: string]: any;
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
    }: any = useFormikContext();
    const selectedOption = options.find(option => option.value === values[name]) || {
        label: null,
        value: null
    };
    const restOptions = options.filter(option => option.value !== selectedOption.value);

    const handleChange = React.useCallback((value: any) => {
        setFieldValue(name, value);
    }, [name]);
    
    return (
        <>
            {
                render({
                    ...getFieldProps(name),
                    error: errors[name],
                    valid: !errors[name] && !!values[name],
                    isInvalid: !!errors[name],
                    selectedOption,
                    options: restOptions,
                    formikBag: useFormikContext(),
                    onChange: handleChange,
                })
            }
        </>
    )
}
