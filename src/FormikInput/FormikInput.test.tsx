import React from 'react';
import * as Yup from 'yup';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from "react-dom/test-utils";

import { Formik, FormikForm, FormikInput, OutputProps } from './../';
import { ERROR_REQUIRED } from './../utils';


configure({ adapter: new Adapter() });

const schema = Yup.object().shape({
    email: Yup.string().required(ERROR_REQUIRED)
})

const MockComponent = (props: OutputProps) => <></>;
const getWrapperComponent = (props?: any) => {
    return mount(
        <Formik
            initialValues={{
                email: ''
            }}
            onSubmit={jest.fn()}
            validationSchema={schema}
            render={() => (
                <FormikForm render={({ names }) => (
                    <FormikInput name={names.email} render={props => (
                        <MockComponent {...props} />
                    )}/>
                )}/>
            )}
            {...props}
        />
    )
}

let wrapperComponent;
let mockComponent;

function updateWrapperComponent() {
    wrapperComponent.update();
    mockComponent = wrapperComponent.find(MockComponent);
}

describe('FormikInput', () => {
    beforeEach(() => {
        wrapperComponent = getWrapperComponent();
        mockComponent = wrapperComponent.find(MockComponent);
    })

    it('renders correctly', () => {
        expect(mockComponent.exists()).toBe(true);
    })

    it('descends expected props', () => {
        expect(mockComponent.prop('name')).toBe('email');
        expect(mockComponent.prop('value')).toBe('');
        expect(mockComponent.prop('error')).toBe(null);
        expect(mockComponent.prop('touched')).toBe(false);
        expect(mockComponent.prop('isValid')).toBe(null);
        expect(mockComponent.prop('isInvalid')).toBe(null);
        expect(mockComponent.prop('onBlur')).toBeInstanceOf(Function);
        expect(mockComponent.prop('onChange')).toBeInstanceOf(Function);
    })

    it('changes value correctly', async () => {
        await act(async () => {
            mockComponent.prop('onChange')({target: { value: 'A' }});
        });
        
        updateWrapperComponent();
        expect(mockComponent.prop('value')).toBe('A');
    });

    it('validates correctly', async () => {
        await act(async () => {
            wrapperComponent.find('form').simulate('submit');
        });

        updateWrapperComponent();
        expect(mockComponent.prop('error')).toBe(ERROR_REQUIRED); // has error if touched and has no value
        expect(mockComponent.prop('isInvalid')).toBe(true); // is invalid if touched and has no value
        expect(mockComponent.prop('isValid')).toBe(false); // is valid if touched and has no value
        
        await act(async () => {
            mockComponent.prop('onChange')({ target: { value: 'A' } });
        });

        updateWrapperComponent();
        expect(mockComponent.prop('error')).toBe(null); // no error if touched and has value
        expect(mockComponent.prop('isValid')).toBe(true); // is valid if is not touched and has value
        expect(mockComponent.prop('isInvalid')).toBe(false); // not invalid if is not touched and has value
    });

})
