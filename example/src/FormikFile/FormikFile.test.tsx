import React from 'react';
import * as Yup from 'yup';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from "react-dom/test-utils";

import { Formik, FormikForm, FormikFile } from './../';
import { ERROR_REQUIRED } from './../utils';


configure({ adapter: new Adapter() });

const schema = Yup.object().shape({
    email: Yup.string().required(ERROR_REQUIRED)
})

const MockComponent = (props: any) => (
    <></>
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
                    <FormikFile name={names.email} render={props => (
                        <MockComponent {...props} />
                    )}/>
                )}/>
            )}
            {...props}
        />
    )
}
describe('FormikFile', () => {
    it('renders correctly', () => {
        const component = getComponent();

        expect(component.find(MockComponent).exists()).toBe(true);
    })

    it('descends expected props', () => {
        const component = getComponent();

        expect(component.find(MockComponent).prop('name')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('value')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('files')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('touched')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('error')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('isValid')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('isInvalid')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('onClick')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('onDelete')).not.toBe(undefined);
        expect(component.find(MockComponent).prop('onBlur')).not.toBe(undefined);
    })


    // it('changes value correctly', async () => {
    //     const component = getComponent();

    //     expect(component.find(MockComponent).prop('value')).toBe('');

    //     await act(async () => {
    //         component.find(MockComponent).prop('onChange')({target: { value: 'A' }});
    //     });
        
    //     component.update();
    //     expect(component.find(MockComponent).prop('value')).toBe('A');

    //     await act(async () => {
    //         component.find(MockComponent).prop('onChange')({target: {value: ''}});
    //     });
        
    //     component.update();
    //     expect(component.find(MockComponent).prop('value')).toBe('');
    // });

    // it('validates correctly', async () => {
    //     const component = getComponent();

    //     expect(component.find(MockComponent).prop('error')).toBe(null); // no error if not touched and no value
    //     expect(component.find(MockComponent).prop('isValid')).toBe(null); // no isValid status if not touched and no value
    //     expect(component.find(MockComponent).prop('isInvalid')).toBe(null); // no isInvalid status if not touched and no value

    //     await act(async () => {
    //         component.find('form').simulate('submit');
    //     });

    //     component.update();
    //     expect(component.find(MockComponent).prop('error')).toBe(ERROR_REQUIRED); // has error if touched and no value
    //     expect(component.find(MockComponent).prop('isValid')).toBe(false); // no isValid status if touched and no value
    //     expect(component.find(MockComponent).prop('isInvalid')).toBe(true); // is invalid if touched and no value
        
    //     await act(async () => {
    //         component.find(MockComponent).prop('onChange')({ target: { value: 'A' } });
    //     });

    //     component.update();
    //     expect(component.find(MockComponent).prop('error')).toBe(null); // no error if touched and has value
    //     expect(component.find(MockComponent).prop('isValid')).toBe(true); // is valid if is not touched and has value
    //     expect(component.find(MockComponent).prop('isInvalid')).toBe(false); // not invalid if is not touched and has value
    // });

})
