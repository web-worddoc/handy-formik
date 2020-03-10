import React from 'react';
import * as Yup from 'yup';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Formik, FormikForm, FormikSelect } from './../';
import { act } from "react-dom/test-utils";
configure({ adapter: new Adapter() });


const ERROR_TEXT = 'This is required field'
const schema = Yup.object().shape({
    country: Yup.string().required(ERROR_TEXT)
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

const TestSelect = (props: any) => {
    return (
        <></>
    )
}

const getComponent = (props?: any) => {
    return mount(
        <Formik
            initialValues={{
                country: ''
            }}
            onSubmit={jest.fn()}
            validationSchema={schema}
            render={({ names }) => (
                <FormikForm render={() => (
                    <FormikSelect
                        name={names.country}
                        options={OPTIONS}
                        render={props => (
                            <TestSelect {...props} />
                        )}
                    />
                )}/>
            )}
            {...props}
        />
    )
}
describe('FormikSelect', () => {
    it('renders correctly', () => {
        const component = getComponent();
        expect(component.find(TestSelect).exists()).toBe(true);
    })

    it('descents expected props', () => {
        const component = getComponent();

        expect(component.find(TestSelect).prop('name')).not.toBe(undefined);
        expect(component.find(TestSelect).prop('value')).not.toBe(undefined);
        expect(component.find(TestSelect).prop('error')).not.toBe(undefined);
        expect(component.find(TestSelect).prop('touched')).not.toBe(undefined);
        expect(component.find(TestSelect).prop('isValid')).not.toBe(undefined);
        expect(component.find(TestSelect).prop('isInvalid')).not.toBe(undefined);
        expect(component.find(TestSelect).prop('selectedOption')).not.toBe(undefined);
        expect(component.find(TestSelect).prop('options')).not.toBe(undefined);
        expect(component.find(TestSelect).prop('onBlur')).not.toBe(undefined);
        expect(component.find(TestSelect).prop('onChange')).not.toBe(undefined);
    })

    it('correctly processes options', async () => {
        {
            const component = getComponent();
    
            expect(component.find(TestSelect).prop("value")).toBe('');
            expect(component.find(TestSelect).prop("selectedOption")).toBe(null);
            expect(component.find(TestSelect).prop("options")).toEqual(OPTIONS);
        }

        {
            const component = getComponent({
                initialValues: { country: '1' }
            });
    
            expect(component.find(TestSelect).prop("value")).toBe('1');
            expect(component.find(TestSelect).prop("selectedOption")).toEqual({
                label: 'China',
                value: '1'
            });
            expect(component.find(TestSelect).prop("options")).toEqual([
                { label: 'USA', value: '2' },
                { label: 'UK', value: '3' },
            ]);
        }
    });

    it('toggles value correctly', async () => {
        const component = getComponent();
    
        await act(async () => {
            component.find(TestSelect).prop('onChange')('2');
        })
        component.update();
        expect(component.find(TestSelect).prop("value")).toBe('2');
        expect(component.find(TestSelect).prop("selectedOption")).toEqual({
            label: 'USA',
            value: '2'
        });
        expect(component.find(TestSelect).prop("options")).toEqual([
            { label: 'China', value: '1' },
            { label: 'UK', value: '3' },
        ]);

        await act(async () => {
            component.find(TestSelect).prop('onChange')('3');
        })
        component.update();
        expect(component.find(TestSelect).prop("value")).toBe('3');
        expect(component.find(TestSelect).prop("selectedOption")).toEqual({
            label: 'UK',
            value: '3'
        });
        expect(component.find(TestSelect).prop("options")).toEqual([
            { label: 'China', value: '1' },
            { label: 'USA', value: '2' },
        ]);
    })


    it('validates correctly', async () => {
        const component = getComponent();

        expect(component.find(TestSelect).prop('error')).toBe(null); // no error if not touched and no value
        expect(component.find(TestSelect).prop('isValid')).toBe(null); // no isValid status if not touched and no value
        expect(component.find(TestSelect).prop('isInvalid')).toBe(null); // no isInvalid status if not touched and no value

        await act(async () => {
            component.find('form').simulate('submit');
        });
        component.update();
        expect(component.find(TestSelect).prop('error')).toBe(ERROR_TEXT); // has error if submitted and no value
        expect(component.find(TestSelect).prop('isValid')).toBe(false); // not valid if submitted and no value
        expect(component.find(TestSelect).prop('isInvalid')).toBe(true); // is invalid if submitted and no value

        await act(async () => {
            component.find(TestSelect).prop('onChange')('2');
        });
        component.update();
        expect(component.find(TestSelect).prop('error')).toBe(null); // has error if submitted/touched and has value
        expect(component.find(TestSelect).prop('isValid')).toBe(true); // is valid if submitted/touched and has value
        expect(component.find(TestSelect).prop('isInvalid')).toBe(false); // not invalid if submitted/touched and has value
    });

})
