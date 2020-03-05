# FormikFile

FormikFile helps to connect a file uploader to Formik state.

## Props

* `render: (props: OutputProps) => ReactNode`
* `name: string`
* `maxFiles?: number`
* `maxSize?: number`
* `multiple?: boolean`
* `format?: Format`
* [accept?: string](https://react-dropzone.js.org/)

## OutputProps

* `name: string`
* `value: any`
* `filesState: CustomFile[]`
* `error: string`
* `touched: boolean`
* `isValid: boolean`
* `isInvalid: boolean`
* `onClick: () => void`
* `onDelete: (targetIndex: number) => void`
* `onBlur: (e: React.SyntheticEvent) => void`

### Used types

`CustomFile`
* `name: string`
* `size: number`
* `origin: File | string`

`Format: 'base64'`

## Usage

```
import React from 'react';
import {
    Formik,
    FormikForm,
    FormikFile
} from 'handy-formik';

import { MyFileComponent } from './../components';


export const Form = props => {
    const handleSubmit = React.useCallback(values => {
        // do something...
    });

    return (
        <Formik
            {...props}
            initialValues={{
                files: []
            }}
            onSubmit={handleSubmit}
            render={({ names, isSubmitting }) => (
                <FormikForm>
                    <FormikFile name={names.files} multiple format="base64" render=(props => (
                        <MyFileComponent {...props}/>
                    ))/>
                    <button type="submit">{isSubmitting ? 'submitting' : 'submit'}</button>
                </FormikForm>
            )}
        >
        </Formik>
    );
};
```

