import React, { Component, Fragment } from 'react'

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

export default class App extends Component {
  render () {
    return (
      <div>
            <Formik initialValues={{
                checkbox: '',
                custom: '',
                file: '',
                input: '',
                radio: '1',
                select: '1',
            }} onSubmit={() => { }} render={({ names, ...rest }) => {
                console.log(rest);
                return (
                    <FormikForm render={() => {
                        return (
                            <Fragment>
                                <FormikCheckbox name={names.checkbox} render={(props) => {
                                    return (
                                        <div>
                                            {props.value + ''}
                                            <input type="checkbox" {...props}/>
                                        </div>
                                    )
                                }} />
                                <FormikCustom name={names.custom} render={(props) => {
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
                                                    <input type="radio" id="radio" name={names.radio} value={el.value} checked={el.value === props.checkedOption.value} onChange={props.onChange}/>
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
                                            <select value={props.selectedOption.value} onChange={e => {
                                                props.onChange(e.target.value)
                                            }}>
                                                <option value={props.selectedOption.value}>{props.selectedOption.label}</option>
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
