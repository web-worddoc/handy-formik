import React from 'react';
import * as Yup from 'yup';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Formik, FormikForm, FormikInput } from './../';
import { act } from "react-dom/test-utils";
configure({ adapter: new Adapter() });


Yup.addMethod(Yup.mixed, 'checked', function(message: string) {
    return this.test('Is checked', message, (value: boolean) => {
        return value === true;
    });
});

const schema = Yup.object().shape({
    email: Yup.string().required('This is required field')
})

const TestInput = ({ name, value, error, onBlur, onChange }: any) => (
    <>
        <input
            className="input"
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
        {error && <div className="error">{error}</div>}
    </>
)

const getComponent = (props?: any) => {
    return mount(
        <Formik
            initialValues={{
                email: ''
            }}
            onSubmit={jest.fn()}
            validationSchema={schema}
            render={({ names }) => (
                <FormikForm render={() => (
                    <FormikInput name={names.email} render={props => (
                        <TestInput {...props} />
                    )}/>
                )}/>
            )}
            {...props}
        />
    )
}
describe('FormikInput', () => {
    it('renders correctly', () => {
        const component = getComponent();
        expect(component.find('.input').exists()).toBe(true);
    })

    it('changes value correctly', async () => {
        const component = getComponent();

        expect(component.find('.input').prop('value')).toBe('');

        await act(async () => {
            component.find('.input').simulate('change', { target: { value: 'A' } });
        });
        component.update();
        expect(component.find('.input').prop('value')).toBe('A');

        await act(async () => {
            component.find('.input').simulate('change', {target: {value: ''}})
        });
        component.update();
        expect(component.find('.input').prop('value')).toBe('');
    });

    it('validates correctly', async () => {
        const component = getComponent();

        expect(component.find('.error').exists()).toBe(false); // no error if not touched and value === false
        expect(component.find(TestInput).prop('isValid')).toBe(null); // no isValid status if not touched and value === false
        expect(component.find(TestInput).prop('isInvalid')).toBe(null); // no isInvalid status if not touched and value === false

        await act(async () => {
            component.find('.input').simulate('change', { target: { value: 'A' } });
            component.find('.input').simulate('blur');
        });
        component.update();
        expect(component.find('.error').exists()).toBe(false); // no error if touched and value === true
        expect(component.find(TestInput).prop('isValid')).toBe(true); // is valid if is not touched and value === true
        expect(component.find(TestInput).prop('isInvalid')).toBe(false); // not invalid if is not touched and value === true

        await act(async () => {
            component.find('.input').simulate('change', {target: {value: ''}})
        });
        component.update();
        expect(component.find('.error').text()).toBe('This is required field'); // has error if touched and value === false
        expect(component.find(TestInput).prop('isValid')).toBe(false); // no isValid status if touched and value === false
        expect(component.find(TestInput).prop('isInvalid')).toBe(true); // is invalid if touched and value === false
    });

})
