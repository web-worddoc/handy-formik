import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Formik } from './Formik';
configure({ adapter: new Adapter() });


const TestComponent = () => (
    <div>test</div>
)

describe('Formik', () => {
    const component = mount(
        <Formik
            initialValues={{
                testName: 'test value'
            }}
            onSubmit={jest.fn()}
            render={props => (
                <TestComponent {...props} />
            )}
        />
    )
    const props: any = component.find(TestComponent).props();

    it('renders correctly', () => {
        expect(component.find('div').text()).toBe('test');
    });

    it('descends expected custom props', () => {
        expect(props.names).toMatchObject({ testName: 'testName' });
    })
    it('descends expected native props', () => {
        expect(props.initialValues).toMatchObject({ testName: 'test value' });
        expect(props.errors).toMatchObject({});
        expect(props.touched).toMatchObject({});
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