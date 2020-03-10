# FormikCustom

FormikCustom helps to connect a custom element for input to Formik state. It might be usefull if you have a complex input which does not fit to any of connectors.

## Props

* `render: (props: OutputProps) => ReactNode`
* `name: string`

## OutputProps

* `name: string`
* `value: any`
* `error: any | null`
* `touched: boolean`
* `isValid: boolean | null`
* `isInvalid: boolean | null`
* `onBlur: (e: React.SyntheticEvent) => void`
* `onChange: (e: React.SyntheticEvent) => void`

## Usage

```js
import React from 'react';
import {
    Formik,
    FormikForm,
    FormikCustom
} from 'handy-formik';

import { MyComplexCusomInput } from './../components';


export const Form = props => {
    const handleSubmit = React.useCallback(values => {
        // do something...
    });

    return (
        <Formik
            {...props}
            initialValues={{
                data: {}
            }}
            onSubmit={handleSubmit}
            render={({ names, isSubmitting }) => (
                <FormikForm>
                    <FormikCustom name={names.data} render=(props => (
                        <MyComplexCusomInput {...props}/>
                    ))/>
                    <button type="submit">{isSubmitting ? 'submitting' : 'submit'}</button>
                </FormikForm>
            )}
        >
        </Formik>
    );
};
```
