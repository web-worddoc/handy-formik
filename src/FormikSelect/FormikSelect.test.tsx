import React from 'react';
import * as Yup from 'yup';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from "react-dom/test-utils";

import { Formik, FormikForm, FormikSelect } from './../';
import { ERROR_REQUIRED } from './../utils';


configure({ adapter: new Adapter() });

const schema = Yup.object().shape({
    country: Yup.string().nullable().required(ERROR_REQUIRED)
})
const OPTIONS = [
    {
        label: 'China',
        value: '1'
    },
    {
        label: 'USA',
        value: '2'
    },
    {
        label: 'UK',
        value: '3'
    },
];

const MockComponent = (props: any) => <></>;

const getWrapperComponent = (props?: any) => {
    return mount(
        <Formik
            initialValues={{
                country: null
            }}
            onSubmit={jest.fn()}
            validationSchema={schema}
            render={() => (
                <FormikForm render={({ names }) => (
                    <FormikSelect
                        name={names.country}
                        options={OPTIONS}
                        render={props => (
                            <MockComponent {...props} />
                        )}
                    />
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

describe('FormikSelect', () => {
    beforeEach(() => {
        wrapperComponent = getWrapperComponent();
        mockComponent = wrapperComponent.find(MockComponent);
    })

    it('renders correctly', () => {
        expect(mockComponent.exists()).toBe(true);
    })

    it('descents expected props', () => {
        expect(mockComponent.prop('name')).toBe('country');
        expect(mockComponent.prop('value')).toBe(null);
        expect(mockComponent.prop('error')).toBe(null);
        expect(mockComponent.prop('touched')).toBe(false);
        expect(mockComponent.prop('isValid')).toBe(null);
        expect(mockComponent.prop('isInvalid')).toBe(null);
        expect(mockComponent.prop('selectedOption')).toBe(null);
        expect(mockComponent.prop('options').length).toBe(3);
        expect(mockComponent.prop('onBlur')).toBeInstanceOf(Function);
        expect(mockComponent.prop('onChange')).toBeInstanceOf(Function);
    })

    it('correctly processes options', async () => {
        wrapperComponent = getWrapperComponent({
            initialValues: { country: '1' }
        });
        mockComponent = wrapperComponent.find(MockComponent);

        expect(mockComponent.prop("value")).toBe('1');
        expect(mockComponent.prop("selectedOption")).toEqual(OPTIONS[0]);
        expect(mockComponent.prop("options")).toEqual([OPTIONS[1], OPTIONS[2]]);
    });

    it('toggles value correctly', async () => {    
        await act(async () => {
            mockComponent.prop('onChange')('2');
        })

        updateWrapperComponent();
        expect(mockComponent.prop("value")).toBe('2');
        expect(mockComponent.prop("selectedOption")).toEqual(OPTIONS[1]);
        expect(mockComponent.prop("options")).toEqual([OPTIONS[0], OPTIONS[2]]);
    })


    it('validates correctly', async () => {
        await act(async () => {
            wrapperComponent.find('form').simulate('submit');
        });

        updateWrapperComponent();
        expect(mockComponent.prop('error')).toBe(ERROR_REQUIRED); // has error if submitted and no value
        expect(mockComponent.prop('isValid')).toBe(false); // not valid if submitted and no value
        expect(mockComponent.prop('isInvalid')).toBe(true); // is invalid if submitted and no value

        await act(async () => {
            mockComponent.prop('onChange')('2');
        });

        updateWrapperComponent();
        expect(mockComponent.prop('error')).toBe(null); // has error if submitted/touched and has value
        expect(mockComponent.prop('isValid')).toBe(true); // is valid if submitted/touched and has value
        expect(mockComponent.prop('isInvalid')).toBe(false); // not invalid if submitted/touched and has value
    });

})
