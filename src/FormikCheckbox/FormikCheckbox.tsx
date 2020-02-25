import * as React from 'react';
import { useFormikContext } from 'formik';


type Props = {
    name: string;
    render: (props: OutputProps) => React.ReactNode;
}

type OutputProps = {
    name: string;
    value: any;
    checked: boolean;
    error: string;
    isValid: boolean;
    isInvalid: boolean;
    formikBag: any;
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
    }: any = useFormikContext();

    const handleChange = React.useCallback((e: { target: { checked: boolean } }) => {
        setFieldValue(name, e.target.checked);
    }, [name]);

    return (
        <>
            {
                render({
                    ...getFieldProps(name),
                    checked: values[name] === true ? true : false,
                    error: errors[name],
                    isValid: !errors[name] && !!values[name],
                    isInvalid: !!errors[name],
                    formikBag: useFormikContext(),
                    onChange: handleChange,
                })
            }
        </>
    );
}
