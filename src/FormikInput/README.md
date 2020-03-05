# FormikInput

FormikInput helps to connect text `<input/>` to Formik state.

## Props

* `render: (props: OutputProps) => ReactNode`
* `name: string`

## OutputProps

* `name: string`
* `value: any`
* `error: any`
* `isValid: boolean`
* `isInvalid: boolean`
* `onBlur: (e: React.SyntheticEvent) => void`
* `onChange: (e: React.SyntheticEvent) => void`

## Usage

```
import React from 'react';
import {
    Formik,
    FormikForm,
    FormikInput
} from 'handy-formik';

import { MyInputComponent } from './../components';


export const Form = props => {
    const handleSubmit = React.useCallback(values => {
        // do something...
    });

    return (
        <Formik
            {...props}
            initialValues={{
                newPassword: ''
            }}
            onSubmit={handleSubmit}
            render={({ names, isSubmitting }) => (
                <FormikForm>
                    <FormikInput name={names.newPassword} render=(props => (
                        <MyInputComponent type="password" {...props}/>
                    ))/>
                    <button type="submit">{isSubmitting ? 'submitting' : 'submit'}</button>
                </FormikForm>
            )}
        >
        </Formik>
    );
};
```
