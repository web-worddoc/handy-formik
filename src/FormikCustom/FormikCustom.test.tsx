import React from 'react';
import * as Yup from 'yup';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Formik, FormikForm, FormikCustom } from './../';
import { act } from "react-dom/test-utils";
configure({ adapter: new Adapter() });


const ERROR_TEXT = 'This is required field';
const schema = Yup.object().shape({
    data: Yup.object({
        name: Yup.string().required(ERROR_TEXT),
    })
})

const TestCustom = ({ name, value, error, onBlur, onChange }: any) => {
    return (
        <>
            <input
                className="input"
                type="text"
                name={name}
                value={value.name}
                onChange={onChange}
                onBlur={onBlur}
            />
            {error && <div className="error">{error.name}</div>}
        </>
    )
}

const getComponent = (props?: any) => {
    const handler = (cb: Function) => (e: { target: {value: string} }) => {
        cb({
            name: e.target.value,
        })
    }

    return mount(
        <Formik
            initialValues={{
                data: {
                    name: ''
                }
            }}
            onSubmit={jest.fn()}
            validationSchema={schema}
            render={({ names }) => (
                <FormikForm render={() => (
                    <FormikCustom name={names.data} render={props => (
                        <TestCustom {...props} value={props.value} onChange={handler(props.onChange)}/>
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
        expect(component.find('.input').exists()).toBe(true);
    })

    it('changes value correctly', async () => {
        const component = getComponent();

        expect(component.find('.input').prop('value')).toBe('');
        expect(component.find('TestCustom').prop('value')).toMatchObject({ name: '' });

        await act(async () => {
            component.find('.input').simulate('change', { target: { value: 'A' } });
        });
        component.update();
        expect(component.find('.input').prop('value')).toBe('A');
        expect(component.find('TestCustom').prop('value')).toMatchObject({ name: 'A' });

        await act(async () => {
            component.find('.input').simulate('change', {target: {value: ''}})
        });
        component.update();
        expect(component.find('.input').prop('value')).toBe('');
        expect(component.find('TestCustom').prop('value')).toMatchObject({ name: '' });
    });

    it('validates correctly', async () => {
        const component = getComponent();

        expect(component.find('.error').exists()).toBe(false); // no error if not touched and no value
        expect(component.find(TestCustom).prop('isValid')).toBe(null); // no isValid status if not touched and no value
        expect(component.find(TestCustom).prop('isInvalid')).toBe(null); // no isInvalid status if not touched and no value

        await act(async () => {
            component.find('.input').simulate('change', { target: { value: 'A' } });
            component.find('.input').simulate('blur');
        });
        component.update();
        expect(component.find('.error').exists()).toBe(false); // no error if touched and has value
        expect(component.find(TestCustom).prop('isValid')).toBe(true); // is valid if is not touched and has value
        expect(component.find(TestCustom).prop('isInvalid')).toBe(false); // not invalid if is not touched and has value

        await act(async () => {
            component.find('.input').simulate('change', {target: {value: ''}})
        });
        component.update();
        expect(component.find('.error').text()).toBe(ERROR_TEXT); // has error if touched and no value
        expect(component.find(TestCustom).prop('isValid')).toBe(false); // no isValid status if touched and no value
        expect(component.find(TestCustom).prop('isInvalid')).toBe(true); // is invalid if touched and no value
    });

})
