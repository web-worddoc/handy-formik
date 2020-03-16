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

const MockComponent = (props: any) => (
    <></>
)

const getComponent = (props?: any) => {
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
describe('FormikCustom', () => {
    it('renders correctly', () => {
        const component = getComponent();

        expect(component.find(MockComponent).exists()).toBe(true);
    })

    it('descends expected props', () => {
        const component = getComponent();

        expect(component.find(MockComponent).prop('name')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('value')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('error')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('touched')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('isValid')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('isInvalid')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('onBlur')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('onChange')).not.toBe(undefined);
    })

    it('changes value correctly', async () => {
        const component = getComponent();

        expect(component.find(MockComponent).prop('value')).toEqual({ name: '' });

        await act(async () => {
            component.find(MockComponent).prop('onChange')({
                name: 'A'
            });
        });

        component.update();
        expect(component.find(MockComponent).prop('value')).toEqual({ name: 'A' });

        await act(async () => {
            component.find(MockComponent).prop('onChange')({
                name: ''
            });
        });

        component.update();
        expect(component.find(MockComponent).prop('value')).toEqual({ name: '' });
    });

    it('validates correctly', async () => {
        const component = getComponent();

        expect(component.find(MockComponent).prop('error')).toBe(null); // no error if not touched and no value
        expect(component.find(MockComponent).prop('isValid')).toBe(null); // no isValid status if not touched and no value
        expect(component.find(MockComponent).prop('isInvalid')).toBe(null); // no isInvalid status if not touched and no value

        await act(async () => {
            component.find('form').simulate('submit');
        });

        component.update();
        expect(component.find(MockComponent).prop('error')).toEqual({ name: ERROR_REQUIRED }); // has error if submitted/touched and no value
        expect(component.find(MockComponent).prop('isValid')).toBe(false); // no isValid status if submmitted/touched and no value
        expect(component.find(MockComponent).prop('isInvalid')).toBe(true); // is invalid if submitted/touched and no value

        await act(async () => {
            component.find(MockComponent).prop('onChange')({
                name: 'A'
            });
        });

        component.update();
        expect(component.find(MockComponent).prop('error')).toBe(null); // no error if touched and has value
        expect(component.find(MockComponent).prop('isValid')).toBe(true); // is valid if is not touched and has value
        expect(component.find(MockComponent).prop('isInvalid')).toBe(false); // not invalid if is not touched and has value
    });

})
