import React, { Component, Fragment } from 'react'
import * as Yup from 'yup';

import {
    Formik,
    FormikForm,
    FormikCheckbox,
    FormikCustom,
    FormikInput,
    FormikRadio,
    FormikSelect,
    FormikState,
    FormikFile,
} from 'handy-formik';


declare module 'yup' {
    interface MixedSchema {
        containsDigitAndUppercase(value: string): MixedSchema,
        eightOrMore(value: string): MixedSchema,
        checked(value: string): MixedSchema,
    }

    interface StringSchema {
        notZero(value: string): StringSchema,
    }
}



Yup.addMethod(Yup.mixed, 'checked', function(message) {
    return this.test('Is checked', message, (value = '') => {
        return value === true;
    });
});

const schema = Yup.object().shape({
    checkbox: Yup.mixed().checked('This is required field'),
    custom: Yup.mixed().required('REQUIRED'),
    file: Yup.mixed().required('REQUIRED'),
    input: Yup.mixed().required('REQUIRED'),
    radio: Yup.mixed().required('REQUIRED'),
    select: Yup.mixed().required('REQUIRED'),
})

export default class App extends Component {
  render () {
    return (
      <div>
            <Formik
            initialValues={{
                checkbox: false,
                custom: '',
                file: '',
                input: '',
                radio: '1',
                select: '1',
            }}
            validationSchema={schema}
            onSubmit={() => { }}
            render={({ names, ...rest }) => {
                return (
                    <FormikForm render={() => {
                        return (
                            <Fragment>
                                <FormikCheckbox name={names.checkbox} render={({value, error, ...rest}) => {
                                    return (
                                        <div>
                                            <input type="checkbox" checked={value} {...rest}/>
                                        </div>
                                    )
                                }} />
                                <FormikCustom name={names.custom} render={(props) => {
                                    console.log(props);
                                    const onChange = (e: any) => {
                                        props.onChange(e.target.value);
                                    }
                                    return (
                                        <div>
                                            {props.value + ''}
                                            <input type="text" {...props} onChange={onChange}/>
                                        </div>
                                    )
                                }} />
                                <FormikFile name={names.file} format="base64" multiple render={(props) => {
                                    return (
                                        <div>
                                            <button {...props}>FILE</button>
                                            {props.filesState.map((el: any, i: any) => (
                                                <div key={i} onClick={props.onDelete.bind(null, i)}>{el.size}</div>
                                            ))}
                                        </div>
                                    )
                                }} />
                                <FormikInput name={names.input} render={(props) => {
                                    return (
                                        <div>
                                            {props.value + ''}
                                            <input type="text" {...props}/>
                                        </div>
                                    )
                                }} />
                                <FormikRadio name={names.radio} options={[
                                    {
                                        label: 1,
                                        value: '1',
                                    },
                                    {
                                        label: 2,
                                        value: '2',
                                    },
                                ]} render={(props) => {
                                    return (
                                        <div>
                                            {props.value + ''}
                                            {props.options.map(el => (
                                                <div>
                                                    {el.label}
                                                    <input type="radio" id="radio" name={names.radio} value={el.value} checked={props.checkedOption ? el.value === props.checkedOption.value : false} onChange={props.onChange}/>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }} />
                                <FormikSelect name={names.select} options={[
                                    {
                                        label: '111',
                                        value: '1'
                                    },
                                    {
                                        label: '222',
                                        value: '2'
                                    },
                                    {
                                        label: '333',
                                        value: '3'
                                    },
                                ]} render={(props) => {
                                    return (
                                        <div>
                                            {props.value + ''}
                                            <select value={props.selectedOption && props.selectedOption.value} onChange={e => {
                                                props.onChange(e.target.value)
                                            }}>
                                                <option value={props.selectedOption && props.selectedOption.value}>{props.selectedOption && props.selectedOption.label}</option>
                                                {props.options.map(el => (
                                                    <Fragment>
                                                        <option value={el.value}>{el.label}</option>
                                                    </Fragment>
                                                ))}
                                            </select>
                                        </div>
                                    )
                                }} />
                                <FormikState render={(props) => {
                                    return (
                                        <div>
                                            {/* {props.values['select']} */}
                                        </div>
                                    )
                                }} />
                            </Fragment>
                        )
                    }}/>
            )
        }}/>
      </div>
    )
  }
}
