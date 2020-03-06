import React from 'react';
import * as Yup from 'yup';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Formik, FormikForm, FormikCheckbox } from './../';
configure({ adapter: new Adapter() });


Yup.addMethod(Yup.mixed, 'checked', function(message) {
    return this.test('Is checked', message, (value = '') => {
        return value === true;
    });
});

const schema = Yup.object().shape({
    check: Yup.mixed().checked('This is required field')
})

const TestCheckbox = ({ name, value, error, touched, isValid, isInvalid, onBlur, onChange }) => {
    const handleBlur = (e) => {
        onBlur(e);

    }
    return (
        <>
            <label>Check it:</label>
            <input
                type="checkbox"
                name={name}
                defaultChecked={value}
                onChange={onChange}
                onBlur={handleBlur}
            />
            {error && <div>{error}</div>}
        </>
    )
}

let initialValues = {
    check: false
}

const getComponent = (props?: any) => {
    return mount(
        <Formik
            initialValues={initialValues}
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
        expect(component.find('label').text()).toBe('Check it:');
    })

    // checking
    it('handles onChange', () => {
        const component = getComponent();

        component.find('input').simulate('change', {target: {checked: true}});
        expect(component.find('input').prop('defaultChecked')).toBe(true);

        component.find('input').simulate('change', { target: { checked: false }});
        expect(component.find('input').prop('defaultChecked')).toBe(false);
    });

    // validation
    it('validates correctly', () => {
        const component = getComponent();
        component.find('input').simulate('blur');
        component.simulate('blur');
        component.update();
        console.log(component.find(TestCheckbox).props());
        // expect(component.find('div').text()).toBe('This is required field');


    });


})
