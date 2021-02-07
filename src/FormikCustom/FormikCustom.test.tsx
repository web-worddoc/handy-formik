import React from 'react';
import * as Yup from 'yup';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from "react-dom/test-utils";

import { Formik, FormikForm, FormikCustom } from './../';
import { ERROR_REQUIRED } from './../utils';


configure({ adapter: new Adapter() });

const schema = Yup.object().shape({
    data: Yup.object({
        name: Yup.string().required(ERROR_REQUIRED),
    })
})

const MockComponent = (props: any) => <></>;

const getWrapperComponent = (props?: any) => {
    return mount(
        <Formik
            initialValues={{
                data: {
                    name: ''
                }
            }}
            onSubmit={jest.fn()}
            validationSchema={schema}
            render={() => (
                <FormikForm render={({ names }) => (
                    <FormikCustom name={names.data} render={props => (
                        <MockComponent {...props}/>
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

describe('FormikCustom', () => {
    beforeEach(() => {
        wrapperComponent = getWrapperComponent();
        mockComponent = wrapperComponent.find(MockComponent);
    })

    it('renders correctly', () => {
        expect(mockComponent.exists()).toBe(true);
    })

    it('descends expected props', () => {
        expect(mockComponent.prop('name')).toBe('data');
        expect(mockComponent.prop('value')).toEqual({ name: '' });
        expect(mockComponent.prop('error')).toBe(null);
        expect(mockComponent.prop('touched')).toBe(false);
        expect(mockComponent.prop('isValid')).toBe(null);
        expect(mockComponent.prop('isInvalid')).toBe(null);
        expect(mockComponent.prop('onBlur')).toBeInstanceOf(Function);
        expect(mockComponent.prop('onChange')).toBeInstanceOf(Function);
    })

    it('changes value correctly', async () => {
        expect(mockComponent.prop('value')).toEqual({ name: '' });

        await act(async () => {
            mockComponent.prop('onChange')({
                name: 'A'
            });
        });

        updateWrapperComponent();
        expect(mockComponent.prop('value')).toEqual({ name: 'A' });

        await act(async () => {
            mockComponent.prop('onChange')({
                name: ''
            });
        });

        updateWrapperComponent();
        expect(mockComponent.prop('value')).toEqual({ name: '' });
    });

    it('validates correctly', async () => {
        expect(mockComponent.prop('error')).toBe(null); // no error if not touched and no value
        expect(mockComponent.prop('isValid')).toBe(null); // no isValid status if not touched and no value
        expect(mockComponent.prop('isInvalid')).toBe(null); // no isInvalid status if not touched and no value

        await act(async () => {
            wrapperComponent.find('form').simulate('submit');
        });

        updateWrapperComponent();
        expect(mockComponent.prop('error')).toEqual({ name: ERROR_REQUIRED }); // has error if submitted/touched and no value
        expect(mockComponent.prop('isValid')).toBe(false); // no isValid status if submmitted/touched and no value
        expect(mockComponent.prop('isInvalid')).toBe(true); // is invalid if submitted/touched and no value

        await act(async () => {
            mockComponent.prop('onChange')({
                name: 'A'
            });
        });

        updateWrapperComponent();
        expect(mockComponent.prop('error')).toBe(null); // no error if touched and has value
        expect(mockComponent.prop('isValid')).toBe(true); // is valid if is not touched and has value
        expect(mockComponent.prop('isInvalid')).toBe(false); // not invalid if is not touched and has value
    });

})
