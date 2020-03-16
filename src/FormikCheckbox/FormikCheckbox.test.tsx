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

const getComponent = (props?: any) => {
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
describe('FormikCheckbox', () => {
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

    it('toggles correctly', async () => {
        const component = getComponent();

        await act(async () => {
            component.find(MockComponent).prop('onChange')({target: {checked: true}});
        });
        
        component.update();
        expect(component.find(MockComponent).prop('value')).toBe(true);

        await act(async () => {
            component.find(MockComponent).prop('onChange')({target: {checked: false}});
        });
        
        component.update();
        expect(component.find(MockComponent).prop('value')).toBe(false);
    });

    it('is validated correctly', async () => {
        const component = getComponent();

        expect(component.find(MockComponent).prop('error')).toBe(null); // no error if not touched and value === false
        expect(component.find(MockComponent).prop('isValid')).toBe(null); // no isValid status if not touched and value === false
        expect(component.find(MockComponent).prop('isInvalid')).toBe(null); // no isInvalid status if not touched and value === false

        await act(async () => {
            component.find(MockComponent).prop('onChange')({target: {checked: false}});
            component.find('form').simulate('submit')
        });

        component.update();
        expect(component.find(MockComponent).prop('error')).toBe(ERROR_REQUIRED); // has error if touched and value === false
        expect(component.find(MockComponent).prop('isValid')).toBe(false); // no isValid status if touched and value === false
        expect(component.find(MockComponent).prop('isInvalid')).toBe(true); // is invalid if touched and value === false
        
        await act(async () => {
            component.find(MockComponent).prop('onChange')({ target: { checked: true } });
        });

        component.update();
        expect(component.find(MockComponent).prop('error')).toBe(null); // no error if touched and value === true
        expect(component.find(MockComponent).prop('isValid')).toBe(true); // is valid if is not touched and value === true
        expect(component.find(MockComponent).prop('isInvalid')).toBe(false); // not invalid if is not touched and value === true
    });
})
