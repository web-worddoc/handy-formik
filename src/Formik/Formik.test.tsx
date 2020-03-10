import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Formik } from './Formik';


configure({ adapter: new Adapter() });

const MockComponent = (props: any) => (
    <></>
)

describe('Formik', () => {
    const component = mount(
        <Formik
            initialValues={{
                testName: 'test value'
            }}
            onSubmit={jest.fn()}
            render={props => (
                <MockComponent {...props} />
            )}
        />
    )
    const props: any = component.find(MockComponent).props();

    it('renders correctly', () => {
        expect(component.find(MockComponent).exists()).toBe(true);
    });

    it('descends expected props', () => {
        expect(props.names).toEqual({ testName: 'testName' });
        expect(props.initialValues).toEqual({ testName: 'test value' });
        expect(props.errors).toEqual({});
        expect(props.touched).toEqual({});
        expect(props).toHaveProperty('status');
        expect(props).toHaveProperty('initialStatus');
        expect(props.validateOnBlur).not.toBe(undefined);
        expect(props.validateOnChange).not.toBe(undefined);
        expect(props.validateOnMount).not.toBe(undefined);
        expect(props.isSubmitting).not.toBe(undefined);
        expect(props.isValidating).not.toBe(undefined);
        expect(props.submitCount).not.toBe(undefined);
        expect(props.initialErrors).not.toBe(undefined);
        expect(props.initialTouched).not.toBe(undefined);
        expect(props.handleBlur).not.toBe(undefined);
        expect(props.handleChange).not.toBe(undefined);
        expect(props.handleReset).not.toBe(undefined);
        expect(props.handleSubmit).not.toBe(undefined);
        expect(props.resetForm).not.toBe(undefined);
        expect(props.setErrors).not.toBe(undefined);
        expect(props.setFormikState).not.toBe(undefined);
        expect(props.setFieldTouched).not.toBe(undefined);
        expect(props.setFieldValue).not.toBe(undefined);
        expect(props.setFieldError).not.toBe(undefined);
        expect(props.setStatus).not.toBe(undefined);
        expect(props.setSubmitting).not.toBe(undefined);
        expect(props.setTouched).not.toBe(undefined);
        expect(props.setValues).not.toBe(undefined);
        expect(props.submitForm).not.toBe(undefined);
        expect(props.validateForm).not.toBe(undefined);
        expect(props.validateField).not.toBe(undefined);
        expect(props.isValid).not.toBe(undefined);
        expect(props.dirty).not.toBe(undefined);
        expect(props.unregisterField).not.toBe(undefined);
        expect(props.registerField).not.toBe(undefined);
        expect(props.getFieldProps).not.toBe(undefined);
        expect(props.getFieldMeta).not.toBe(undefined);
        expect(props.getFieldHelpers).not.toBe(undefined);
    })
})
