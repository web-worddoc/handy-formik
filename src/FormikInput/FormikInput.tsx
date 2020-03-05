import * as React from 'react';
import { useFormikContext } from 'formik';


type Props = {
    name: string;

    render: (props: OutputProps) => React.ReactNode;
}

type OutputProps = {
    name: string;
    value: any;
    error: any;
    touched: boolean;
    isValid: boolean;
    isInvalid: boolean;

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
        values,
        errors,
        touched,
    }: any = useFormikContext();

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
                })
            }
        </>
    )
}
