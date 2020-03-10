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

const MockComponent = (props: any) => (
    <></>
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
                        <MockComponent {...props} />
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
        expect(component.find(MockComponent).prop('checkedOption')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('options')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('onBlur')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('onChange')).not.toBe(undefined);
    })

    it('changes value correctly', async () => {
        const component = getComponent();

        expect(component.find(MockComponent).prop('checkedOption')).toBe(null);

        await act(async () => {
            component.find(MockComponent).prop('onChange')({target:{ value: 'MALE' }});
        });
        
        component.update();
        expect(component.find(MockComponent).prop('value')).toBe('MALE');
        expect(component.find(MockComponent).prop('checkedOption')).toEqual({
            label: 'Man',
            value: 'MALE'
        });

        await act(async () => {
            component.find(MockComponent).prop('onChange')({target:{ value: 'FEMALE' }});
        });

        component.update();
        expect(component.find(MockComponent).prop('value')).toBe('FEMALE');
        expect(component.find(MockComponent).prop('checkedOption')).toEqual({
            label: 'Woman',
            value: 'FEMALE'
        });
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
        expect(component.find(MockComponent).prop('error')).toBe(ERROR_REQUIRED); // has error if submitted and no value
        expect(component.find(MockComponent).prop('isValid')).toBe(false); // not valid if submitted and no value
        expect(component.find(MockComponent).prop('isInvalid')).toBe(true); // is invalid if submitted and no value

        await act(async () => {
            component.find(MockComponent).prop('onChange')({target: {value: 'FEMALE'}});
        });
        
        component.update();
        expect(component.find(MockComponent).prop('error')).toBe(null); // no error if touched/submitted and has value
        expect(component.find(MockComponent).prop('isValid')).toBe(true); // is valid if is touched/submitted and has value
        expect(component.find(MockComponent).prop('isInvalid')).toBe(false); // not invalid if is touched/submitted and has value
    });

})
