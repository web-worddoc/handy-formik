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
    isValid: boolean;
    isInvalid: boolean;
    formikBag: any;
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
    }: any = useFormikContext();

    return (
        <>
            {
                render({
                    ...getFieldProps(name),
                    error: errors[name],
                    isValid: !errors[name] && !!values[name],
                    isInvalid: !!errors[name],
                    formikBag: useFormikContext(),
                })
            }
        </>
    )
}
