import React from 'react';
import * as Yup from 'yup';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Formik, FormikForm, FormikRadio } from './../';
import { act } from "react-dom/test-utils";
configure({ adapter: new Adapter() });


const ERROR_TEXT = 'This is required field'
const schema = Yup.object().shape({
    gender: Yup.string().required(ERROR_TEXT)
})

const TestRadio = ({ name, value, error, options, checkedOption, onBlur, onChange }: any) => (
    <>
        {options.map((el, i) => (
            <React.Fragment key={i}>
                <label htmlFor={name + i}>{el.label}</label>
                <input
                    className={`input${i + 1}`}
                    type="text"
                    name={name}
                    id={name + i}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    checked={checkedOption ? el.value === checkedOption.value : false}
                />
            </React.Fragment>
        ))}
        {error && <div className="error">{error}</div>}
    </>
)

const getComponent = (props?: any) => {
    return mount(
        <Formik
            initialValues={{
                gender: ''
            }}
            onSubmit={jest.fn()}
            validationSchema={schema}
            render={({ names }) => (
                <FormikForm render={() => (
                    <FormikRadio name={names.gender} options={[
                        {
                            label: 'Man',
                            value: 'MALE'
                        }, {
                            label: 'Woman',
                            value: 'FEMALE'
                        }
                    ]} render={props => (
                        <TestRadio {...props} />
                    )}/>
                )}/>
            )}
            {...props}
        />
    )
}
describe('FormikRadio', () => {
    it('renders correctly', () => {
        const component = getComponent();
        expect(component.find('.input1').exists()).toBe(true);
        expect(component.find('label').at(0).text()).toBe('Man');
        expect(component.find('.input2').exists()).toBe(true);
        expect(component.find('label').at(1).text()).toBe('Woman');
    })

    it('changes value correctly', async () => {
        const component = getComponent();

        expect(component.find('.input1').prop('checked')).toBe(false);
        expect(component.find('.input2').prop('checked')).toBe(false);

        await act(async () => {
            component.find('.input1').simulate('change', {target:{ value: 'MALE' }});
        });
        component.update();
        expect(component.find('.input1').prop('checked')).toBe(true);
        expect(component.find('.input2').prop('checked')).toBe(false);

        await act(async () => {
            component.find('.input2').simulate('change', {target:{ value: 'FEMALE' }})
        });
        component.update();
        expect(component.find('.input1').prop('checked')).toBe(false);
        expect(component.find('.input2').prop('checked')).toBe(true);
    });

    it('validates correctly', async () => {
        const component = getComponent();

        expect(component.find('.error').exists()).toBe(false); // no error if not touched and no value
        expect(component.find(TestRadio).prop('isValid')).toBe(null); // no isValid status if not touched and no value
        expect(component.find(TestRadio).prop('isInvalid')).toBe(null); // no isInvalid status if not touched and no value

        await act(async () => {
            component.find('form').simulate('submit');
        });
        component.update();
        expect(component.find('.error').text()).toBe(ERROR_TEXT); // has error if submitted and no value
        expect(component.find(TestRadio).prop('isValid')).toBe(false); // not valid if submitted and no value
        expect(component.find(TestRadio).prop('isInvalid')).toBe(true); // is invalid if submitted and no value

        await act(async () => {
            component.find('.input1').simulate('change', {target: {value: 'FEMALE'}})
        });
        component.update();
        expect(component.find('.error').exists()).toBe(false); // no error if touched/submitted and has value
        expect(component.find(TestRadio).prop('isValid')).toBe(true); // is valid if is touched/submitted and has value
        expect(component.find(TestRadio).prop('isInvalid')).toBe(false); // not invalid if is touched/submitted and has value
    });

})
