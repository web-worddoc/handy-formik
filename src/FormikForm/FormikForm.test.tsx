import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Formik, FormikForm } from './../';


configure({ adapter: new Adapter() });

const MockComponent = () => <></>;

describe('FormikForm', () => {
    const wrapperComponent = mount(
        <Formik
            initialValues={{
                testName: 'test value'
            }}
            onSubmit={jest.fn()}
            render={() => (
                <FormikForm render={props => (
                    <MockComponent {...props} />
                )}/>
            )}
        />
    )
    const mockComponent = wrapperComponent.find(MockComponent);
    const props: any = mockComponent.props();

    it('renders correctly', () => {
        expect(mockComponent.exists()).toBe(true);
    });

    it('descends expected props', () => {
        expect(props.names).toEqual({ testName: 'testName' });
        expect(props.initialValues).toEqual({ testName: 'test value' });
        expect(props.errors).toEqual({});
        expect(props.touched).toEqual({});
        expect(props.validateOnBlur).toBe(false);
        expect(props.validateOnChange).toBe(true);
        expect(props.validateOnMount).toBeFalsy();
        expect(props).toHaveProperty('status');
        expect(props).toHaveProperty('isSubmitting');
        expect(props).toHaveProperty('isValidating');
        expect(props).toHaveProperty('submitCount');
        expect(props).toHaveProperty('initialErrors');
        expect(props).toHaveProperty('initialTouched');
        expect(props).toHaveProperty('initialStatus');
        expect(props).toHaveProperty('handleBlur');
        expect(props).toHaveProperty('handleChange');
        expect(props).toHaveProperty('handleReset');
        expect(props).toHaveProperty('handleSubmit');
        expect(props).toHaveProperty('resetForm');
        expect(props).toHaveProperty('setErrors');
        expect(props).toHaveProperty('setFormikState');
        expect(props).toHaveProperty('setFieldTouched');
        expect(props).toHaveProperty('setFieldValue');
        expect(props).toHaveProperty('setFieldError');
        expect(props).toHaveProperty('setStatus');
        expect(props).toHaveProperty('setSubmitting');
        expect(props).toHaveProperty('setTouched');
        expect(props).toHaveProperty('setValues');
        expect(props).toHaveProperty('submitForm');
        expect(props).toHaveProperty('validateForm');
        expect(props).toHaveProperty('validateField');
        expect(props).toHaveProperty('isValid');
        expect(props).toHaveProperty('dirty');
        expect(props).toHaveProperty('unregisterField');
        expect(props).toHaveProperty('registerField');
        expect(props).toHaveProperty('getFieldProps');
        expect(props).toHaveProperty('getFieldMeta');
        expect(props).toHaveProperty('getFieldHelpers');
    })
})
