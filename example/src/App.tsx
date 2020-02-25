import React, { Component, Fragment } from 'react'

import {
    Formik,
    FormikForm,
    FormikCheckboxConnector,
    FormikCustomConnector,
    FormikInputConnector,
    FormikRadioConnector,
    FormikSelectConnector,
    FormikStateConnector,
    FormikFileConnector,
} from 'formik-components'

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
            }} onSubmit={() => { }} render={({ names }) => {
                return (
                    <FormikForm render={(formikBag) => {
                        return (
                            <Fragment>
                                <FormikCheckboxConnector name={names.checkbox} render={(props) => {
                                    return (
                                        <div>
                                            {props.value + ''}
                                            <input type="checkbox" {...props}/>
                                        </div>
                                    )
                                }} />
                                <FormikCustomConnector name={names.custom} render={(props) => {
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
                                <FormikFileConnector name={names.file} format="base64" multiple render={(props) => {
                                    return (
                                        <div>
                                            <button {...props}>FILE</button>
                                            {props.filesState.map((el: any, i: any) => (
                                                <div key={i} onClick={props.onDelete.bind(null, i)}>{el.size}</div>
                                            ))}
                                        </div>
                                    )
                                }} />
                                <FormikInputConnector name={names.input} render={(props) => {
                                    return (
                                        <div>
                                            {props.value + ''}
                                            <input type="text" {...props}/>
                                        </div>
                                    )
                                }} />
                                <FormikRadioConnector name={names.radio} options={[
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
                                <FormikSelectConnector name={names.select} options={[
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
                                <FormikStateConnector render={(props) => {
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
