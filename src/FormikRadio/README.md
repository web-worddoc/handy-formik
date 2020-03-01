# FormikRadio

FormikRadio helps to connect `<input type="radio"/>` to Formik state.

## Props

`render: (props: OutputProps) => ReactNode`
`name: string`
`options: Option[]`

## OutputProps

`name: string`
`value: any`
`error: any`
`isValid: boolean`
`isInvalid: boolean`
`checkedOption: Option | null`
`options: Option[]`
`onBlur: (e: React.SyntheticEvent) => void`
`onChange: (e: React.SyntheticEvent) => void`

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
    FormikInput,
    FormikRadio
} from 'handy-formik';

import { MyInputComponent, MyCheckboxComponent } from './../components';


export const Form = props => {
    const options = React.useMemo(() => ([
        {
            label: 'I am man',
            value: 'MALE'
        }, {
            label: 'I am woman',
            value: 'FEMALE'
        }
    ]));

    const handleSubmit = React.useCallback(values => {
        // do something...
    });

    return (
        <Formik
            {...props}
            initialValues={{
                name: ''
                gender: ''
            }}
            onSubmit={handleSubmit}
            render={({ names, isSubmitting }) => (
                <FormikForm>
                    <FormikInput name={names.name} render=(props => (
                        <MyInputComponent {...props}/>
                    ))/>
                    <FormikCheckbox name={names.gender} options={options} render=({ value, options, ...rest } => {
                        return options.map((item, index) => (
                            <MyCheckboxComponent {...rest} id={names.gender} checked={item.value === value}/>
                        )
                    }))/>
                    <button type="submit">{isSubmitting ? 'submitting' : 'submit'}</button>
                </FormikForm>
            )}
        >
        </Formik>
    );
};
```
