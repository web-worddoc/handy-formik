import React from 'react';
import * as Yup from 'yup';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Formik, FormikForm, FormikCheckbox } from './../';
import { act } from "react-dom/test-utils";
configure({ adapter: new Adapter() });


Yup.addMethod(Yup.mixed, 'checked', function(message: string) {
    return this.test('Is checked', message, (value: boolean) => {
        return value === true;
    });
});

const ERROR_TEXT = 'This is required field';
const schema = Yup.object().shape({
    check: Yup.mixed().checked(ERROR_TEXT)
})

const TestCheckbox = ({ name, value, error, onBlur, onChange }: any) => (
    <>
        <label className="label">Check it:</label>
        <input
            className="input"
            type="checkbox"
            name={name}
            defaultChecked={value}
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
                check: false
            }}
            onSubmit={jest.fn()}
            validationSchema={schema}
            render={({ names }) => (
                <FormikForm render={() => (
                    <FormikCheckbox name={names.check} render={props => (
                        <TestCheckbox {...props} />
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
        expect(component.find('.label').text()).toBe('Check it:');
        expect(component.find('.input').exists()).toBe(true);
    })

    // toggle
    it('toggles correctly', async () => {
        const component = getComponent();

        component.find('.input').simulate('change', {target: {checked: true}});
        expect(component.find('.input').prop('defaultChecked')).toBe(true);

        component.find('.input').simulate('change');
        expect(component.find('.input').prop('defaultChecked')).toBe(false);
    });

    // validation
    it('validates correctly', async () => {
        const component = getComponent();

        expect(component.find('.error').exists()).toBe(false); // no error if not touched and value === false
        expect(component.find(TestCheckbox).prop('isValid')).toBe(null); // no isValid status if not touched and value === false
        expect(component.find(TestCheckbox).prop('isInvalid')).toBe(null); // no isInvalid status if not touched and value === false

        await act(async () => {
            component.find('.input').simulate('change', {target: {checked: false}})
            component.find('.input').simulate('blur')
        });
        component.update();
        expect(component.find('.error').text()).toBe(ERROR_TEXT); // has error if touched and value === false
        expect(component.find(TestCheckbox).prop('isValid')).toBe(false); // no isValid status if touched and value === false
        expect(component.find(TestCheckbox).prop('isInvalid')).toBe(true); // is invalid if touched and value === false
        
        await act(async () => {
            component.find('.input').simulate('change', { target: { checked: true } });
        });
        component.update();
        expect(component.find('.error').exists()).toBe(false); // no error if touched and value === true
        expect(component.find(TestCheckbox).prop('isValid')).toBe(true); // is valid if is not touched and value === true
        expect(component.find(TestCheckbox).prop('isInvalid')).toBe(false); // not invalid if is not touched and value === true
    });
})
