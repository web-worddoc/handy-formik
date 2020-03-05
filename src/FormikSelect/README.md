# FormikSelect

FormikSelect helps to connect a native or custom select to Formik state.

## Props

`render: (props: OutputProps) => ReactNode`
`name: string`
`options: Option[];`

## OutputProps

`name: string`
`value: any`
`error: any`
`isValid: boolean`
`isInvalid: boolean`
`selectedOption: Option | null`
`options: Option[]`
`onBlur: (e: React.SyntheticEvent) => void`
`onChange: (value: any) => void`

### Used types

`Option`
* `label: ReactNode`
* `value: any`


## Usage

```
import React from 'react';
import {
    Formik,
    FormikForm,
    FormikSelect
} from 'handy-formik';

import { MySelectComponent } from './../components';


export const Form = props => {
    const options = React.useMemo(() => ([
        {
            label: 'United States',
            value: 1
        }, {
            label: 'China',
            value: 2
        }
    ]));

    const handleSubmit = React.useCallback(values => {
        // do something...
    });

    return (
        <Formik
            {...props}
            initialValues={{
                country: ''
            }}
            onSubmit={handleSubmit}
            render={({ names, isSubmitting }) => (
                <FormikForm>
                    <FormikSelect name={names.country} options={options} render=(props => (
                        <MySelectComponent {...props}/>
                    ))/>
                    <button type="submit">{isSubmitting ? 'submitting' : 'submit'}</button>
                </FormikForm>
            )}
        >
        </Formik>
    );
};
```
