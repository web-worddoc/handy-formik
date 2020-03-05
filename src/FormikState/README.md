# FormikSate

FormikSate helps to descent Formik state for any use. It might be usefull if you need to have access state in low-level component of tree.

## Props

`render: (props: OutputProps) => ReactNode`

## OutputProps

`FormikProps<FormikBag>`

## Usage

```
import React from 'react';
import { FormikState } from 'handy-formik';


export const FormButton = { children, ...rest } => {
    return (
        <FormikState render={{ isSubmitting } => (
            <button type="submit" {...rest}>{isSubmitting ? 'submitting' : children}</button>
        )}/>
    );
};
```
