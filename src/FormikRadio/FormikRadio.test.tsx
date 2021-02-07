import React from 'react';
import * as Yup from 'yup';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from "react-dom/test-utils";

import { Formik, FormikForm, FormikRadio } from './../';
import { ERROR_REQUIRED } from './../utils';


configure({ adapter: new Adapter() });

const schema = Yup.object().shape({
    gender: Yup.string().required(ERROR_REQUIRED)
})

const MockComponent = (props: any) => <></>;

const getWrapperComponent = (props?: any) => {
    return mount(
        <Formik
            initialValues={{
                gender: ''
            }}
            onSubmit={jest.fn()}
            validationSchema={schema}
            render={() => (
                <FormikForm render={({ names }) => (
                    <FormikRadio name={names.gender} options={[
                        {
                            label: 'Man',
                            value: 'MALE'
                        }, {
                            label: 'Woman',
                            value: 'FEMALE'
                        }
                    ]} render={props => (
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

describe('FormikRadio', () => {
    beforeEach(() => {
        wrapperComponent = getWrapperComponent();
        mockComponent = wrapperComponent.find(MockComponent);
    })
    it('renders correctly', () => {
        expect(mockComponent.exists()).toBe(true);
    })

    it('descends expected props', () => {
        expect(mockComponent.prop('name')).toBe('gender');
        expect(mockComponent.prop('value')).not.toBe(undefined);
        expect(mockComponent.prop('error')).toBe(null);
        expect(mockComponent.prop('touched')).toBe(false);
        expect(mockComponent.prop('isValid')).toBe(null);
        expect(mockComponent.prop('isInvalid')).toBe(null);
        expect(mockComponent.prop('checkedOption')).toBe(null);
        expect(mockComponent.prop('options').length).toBe(2);
        expect(mockComponent.prop('onBlur')).toBeInstanceOf(Function);
        expect(mockComponent.prop('onChange')).toBeInstanceOf(Function);
    })

    it('changes value correctly', async () => {
        await act(async () => {
            mockComponent.prop('onChange')({ target: { value: 'MALE' } });
        });
        
        updateWrapperComponent();
        expect(mockComponent.prop('value')).toBe('MALE');
        expect(mockComponent.prop('checkedOption')).toEqual({
            label: 'Man',
            value: 'MALE'
        });

        await act(async () => {
            mockComponent.prop('onChange')({target:{ value: 'FEMALE' }});
        });

        updateWrapperComponent();
        expect(mockComponent.prop('value')).toBe('FEMALE');
        expect(mockComponent.prop('checkedOption')).toEqual({
            label: 'Woman',
            value: 'FEMALE'
        });
    });

    it('validates correctly', async () => {
        expect(mockComponent.prop('error')).toBe(null); // no error if not touched and no value
        expect(mockComponent.prop('isValid')).toBe(null); // no isValid status if not touched and no value
        expect(mockComponent.prop('isInvalid')).toBe(null); // no isInvalid status if not touched and no value

        await act(async () => {
            wrapperComponent.find('form').simulate('submit');
        });

        updateWrapperComponent();
        expect(mockComponent.prop('error')).toBe(ERROR_REQUIRED); // has error if submitted and no value
        expect(mockComponent.prop('isValid')).toBe(false); // not valid if submitted and no value
        expect(mockComponent.prop('isInvalid')).toBe(true); // is invalid if submitted and no value

        await act(async () => {
            mockComponent.prop('onChange')({target: {value: 'FEMALE'}});
        });
        
        updateWrapperComponent();
        expect(mockComponent.prop('error')).toBe(null); // no error if touched/submitted and has value
        expect(mockComponent.prop('isValid')).toBe(true); // is valid if is touched/submitted and has value
        expect(mockComponent.prop('isInvalid')).toBe(false); // not invalid if is touched/submitted and has value
    });

})
