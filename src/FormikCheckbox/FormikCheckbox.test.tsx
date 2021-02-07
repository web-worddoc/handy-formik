import React from 'react';
import * as Yup from 'yup';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from "react-dom/test-utils";

import { Formik, FormikForm, FormikCheckbox } from './../';
import { ERROR_REQUIRED } from './../utils';


configure({ adapter: new Adapter() });

const schema = Yup.object().shape({
    check: Yup.mixed().test('Is checked', ERROR_REQUIRED, (value: boolean) => {
        return value === true;
    })
})

const MockComponent = (props: any) => (
    <></>
)

const getWrapperComponent = (props?: any) => {
    return mount(
        <Formik
            initialValues={{
                check: false
            }}
            onSubmit={jest.fn()}
            validationSchema={schema}
            render={() => (
                <FormikForm render={({ names }) => (
                    <FormikCheckbox name={names.check} render={props => (
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

describe('FormikCheckbox', () => {
    beforeEach(() => {
        wrapperComponent = getWrapperComponent();
        mockComponent = wrapperComponent.find(MockComponent);
    })

    it('renders correctly', () => {
        expect(mockComponent.exists()).toBe(true);
    })

    it('descends expected props', () => {
        expect(mockComponent.prop('name')).toBe('check');
        expect(mockComponent.prop('value')).toBe(false);
        expect(mockComponent.prop('error')).toBe(null);
        expect(mockComponent.prop('touched')).toBe(false);
        expect(mockComponent.prop('isValid')).toBe(null);
        expect(mockComponent.prop('isInvalid')).toBe(null);
        expect(mockComponent.prop('onBlur')).toBeInstanceOf(Function);
        expect(mockComponent.prop('onChange')).toBeInstanceOf(Function);
    })

    it('toggles correctly', async () => {
        await act(async () => {
            mockComponent.prop('onChange')({target: {checked: true}});
        });
        
        updateWrapperComponent();
        expect(mockComponent.prop('value')).toBe(true);

        await act(async () => {
            mockComponent.prop('onChange')({target: {checked: false}});
        });
        
        updateWrapperComponent();
        expect(mockComponent.prop('value')).toBe(false);
    });

    it('is validated correctly', async () => {
        expect(mockComponent.prop('error')).toBe(null); // no error if not touched and value === false
        expect(mockComponent.prop('isValid')).toBe(null); // no isValid status if not touched and value === false
        expect(mockComponent.prop('isInvalid')).toBe(null); // no isInvalid status if not touched and value === false

        await act(async () => {
            mockComponent.prop('onChange')({target: {checked: false}});
            wrapperComponent.find('form').simulate('submit')
        });

        updateWrapperComponent();
        expect(mockComponent.prop('error')).toBe(ERROR_REQUIRED); // has error if touched and value === false
        expect(mockComponent.prop('isValid')).toBe(false); // no isValid status if touched and value === false
        expect(mockComponent.prop('isInvalid')).toBe(true); // is invalid if touched and value === false
        
        await act(async () => {
            mockComponent.prop('onChange')({ target: { checked: true } });
        });

        updateWrapperComponent();
        expect(mockComponent.prop('error')).toBe(null); // no error if touched and value === true
        expect(mockComponent.prop('isValid')).toBe(true); // is valid if is not touched and value === true
        expect(mockComponent.prop('isInvalid')).toBe(false); // not invalid if is not touched and value === true
    });
})
