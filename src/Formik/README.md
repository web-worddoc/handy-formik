# Formik

This is an entry point for a single form. It holds a state of underlying form and let rest components of `handy-formik` to connect to it's state.

## Props

* `render: (props: OutputProps) => ReactNode`
* [initialValues: Values](https://jaredpalmer.com/formik/docs/api/formik#initialvalues-values)
* [onSubmit: (values: Values, formikBag: FormikBag) => void | Promise<any>](https://jaredpalmer.com/formik/docs/api/formik#onsubmit-values-values-formikbag-formikbag--void--promiseany)
* [enableReinitialize?: boolean (default: true)](https://jaredpalmer.com/formik/docs/api/formik#enablereinitialize-boolean)
* [initialErrors?: FormikErrors<Values>](https://jaredpalmer.com/formik/docs/api/formik#initialerrors-formikerrorsvalues)
* [initialStatus?: any](https://jaredpalmer.com/formik/docs/api/formik#initialstatus-any)
* [initialTouched?: FormikTouched<Values>](https://jaredpalmer.com/formik/docs/api/formik#initialtouched-formiktouchedvalues)
* [onReset?: (values: Values, formikBag: FormikBag) => void](https://jaredpalmer.com/formik/docs/api/formik#onreset-values-values-formikbag-formikbag--void)
* [validate?: (values: Values) => FormikErrors<Values> | Promise<any>](https://jaredpalmer.com/formik/docs/api/formik#validate-values-values--formikerrorsvalues--promiseany)
* [validateOnBlur?: boolean (default: false)](https://jaredpalmer.com/formik/docs/api/formik#validateonblur-boolean)
* [validateOnChange?: boolean (default: true)](https://jaredpalmer.com/formik/docs/api/formik#validateonchange-boolean)
* [validateOnMount?: boolean (default: false)](https://jaredpalmer.com/formik/docs/api/formik#validateonmount-boolean)
* [validationSchema?: Schema | (() => Schema)](https://jaredpalmer.com/formik/docs/api/formik#validationschema-schema----schema)

## OutputProps

* `FormikProps<FormikBag, Names>`

## Usage

```js
import React from 'react';
import { Formik, FormikForm } from 'handy-formik';


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
            render={({ names, values, isSubmitting, handleChange, handleBlur }) => (
                <FormikForm render=(() => (
                    <div>
                        <input
                            type="password"
                            name={names.newPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values[names.newPassword]}
                        />
                        <button type="submit">{isSubmitting ? 'submitting' : 'submit'}</button>
                    </div>
                ))>
            )}
        >
        </Formik>
    );
};
```
