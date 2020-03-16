import React from 'react';
import * as Yup from 'yup';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from "react-dom/test-utils";

import { Formik, FormikForm, FormikFile } from './../';
import { ERROR_NEED_MORE_FILES } from './../utils';


configure({ adapter: new Adapter() });

const schema = Yup.object().shape({
    files: Yup.mixed().test('more than 1', ERROR_NEED_MORE_FILES, (value: any) => {
        if (!Array.isArray(value) || value.length <= 2) {
            return false;
        } else {
            return true;
        }
    })
})
const FILE = new File(['TEST'], 'test.txt', { type: 'text/plain' });
const FILE_AS_BASE64 = 'data:text/plain;charset=undefined,TEST';
const MockComponent = (props: any) => (
    <></>
)

const getComponent = (props?: any, connectorProps?: any) => {
    return mount(
        <Formik
            initialValues={{
                files: []
            }}
            onSubmit={jest.fn()}
            validationSchema={schema}
            render={() => (
                <FormikForm render={({ names }) => (
                    <FormikFile name={names.files} {...connectorProps ? connectorProps : {}} render={props => (
                        <MockComponent {...props} />
                    )}/>
                )}/>
            )}
            {...props}
        />
    )
}

const selectFiles = async (component: any, files: any) => {
    await act(async () => {
        component.find('input[type="file"]').simulate('change', { target: {files} });
        await new Promise<any>(resolve => setTimeout(resolve, 120));
    });
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
    });

    it('accepts 1 file if multiple not desired', async () => {
        const component = getComponent();
    
        await selectFiles(component, [FILE, FILE, FILE]);
    
        component.update();
        expect(component.find(MockComponent).prop('value')).toBeInstanceOf(File);
        expect(component.find(MockComponent).prop('files').length).toBe(1);
        expect(component.find(MockComponent).prop('files')[0].size).not.toBe(undefined);
        expect(component.find(MockComponent).prop('files')[0].name).not.toBe(undefined);
        expect(component.find(MockComponent).prop('files')[0].src).not.toBe(undefined);
    })

    it('accepts multiple files if desired', async () => {
        const component = getComponent(null, {
            multiple: true,
        });
    
        await selectFiles(component, [FILE, FILE, FILE]);
    
        component.update();
        expect(component.find(MockComponent).prop('value').length).toBe(3);
        expect(component.find(MockComponent).prop('files').length).toBe(3);
    })

    it('doesn\'t accept more than maxFiles', async () => {
        const component = getComponent(null, {
            multiple: true,
            maxFiles: 2
        });

        await selectFiles(component, [FILE, FILE, FILE]);

        component.update();
        expect(component.find(MockComponent).prop('value').length).toBe(2);
        expect(component.find(MockComponent).prop('files').length).toBe(2);
    })

    it('upload single file as File', async () => {
        const component = getComponent();

        await selectFiles(component, [FILE, FILE, FILE]);

        component.update();
        expect(component.find(MockComponent).prop('value')).toBeInstanceOf(File);
        expect(component.find(MockComponent).prop('files').length).toBe(1);
        expect(component.find(MockComponent).prop('files')[0].name).toBe('test.txt');
        expect(component.find(MockComponent).prop('files')[0].size).toBe(4);
        expect(component.find(MockComponent).prop('files')[0].src).toBeInstanceOf(File);
    })

    it('upload multiple files as File', async () => {
        const component = getComponent(null, {
            multiple: true
        });

        await selectFiles(component, [FILE, FILE, FILE]);

        component.update();
        expect(component.find(MockComponent).prop('value').length).toBe(3);
        expect(component.find(MockComponent).prop('value')[0]).toBeInstanceOf(File);
        expect(component.find(MockComponent).prop('files').length).toBe(3);
        expect(component.find(MockComponent).prop('files')[0].name).toBe('test.txt');
        expect(component.find(MockComponent).prop('files')[0].size).toBe(4);
        expect(component.find(MockComponent).prop('files')[0].src).toBeInstanceOf(File);
    })

    it('upload single file as Base64', async () => {
        const component = getComponent(null, {
            format: 'base64'
        });

        await selectFiles(component, [FILE, FILE, FILE]);

        component.update();
        expect(component.find(MockComponent).prop('value')).toBe(FILE_AS_BASE64);
        expect(component.find(MockComponent).prop('files').length).toBe(1);
        expect(component.find(MockComponent).prop('files')[0].name).toBe('test.txt');
        expect(component.find(MockComponent).prop('files')[0].size).toBe(4);
        expect(component.find(MockComponent).prop('files')[0].src).toBe(FILE_AS_BASE64);
    })

    it('upload multiple files as Base64', async () => {
        const component = getComponent(null, {
            multiple: true,
            format: 'base64'
        });

        await selectFiles(component, [FILE, FILE, FILE]);

        component.update();
        expect(component.find(MockComponent).prop('value').length).toBe(3);
        expect(component.find(MockComponent).prop('value')[0]).toBe(FILE_AS_BASE64);
        expect(component.find(MockComponent).prop('files').length).toBe(3);
        expect(component.find(MockComponent).prop('files')[0].name).toBe('test.txt');
        expect(component.find(MockComponent).prop('files')[0].size).toBe(4);
        expect(component.find(MockComponent).prop('files')[0].src).toBe(FILE_AS_BASE64);
    })

    it('validates correctly', async () => {
        const component = getComponent(null, {
            multiple: true
        });

        expect(component.find(MockComponent).prop('error')).toBe(null); // no error if not touched and no value
        expect(component.find(MockComponent).prop('isValid')).toBe(null); // no isValid status if not touched and no value
        expect(component.find(MockComponent).prop('isInvalid')).toBe(null); // no isInvalid status if not touched and no value
        
        await act(async () => {
            component.find('form').simulate('submit');
        });
        
        component.update();
        expect(component.find(MockComponent).prop('error')).toBe(ERROR_NEED_MORE_FILES); // has error if touched and no value
        expect(component.find(MockComponent).prop('isValid')).toBe(false); // no isValid status if touched and no value
        expect(component.find(MockComponent).prop('isInvalid')).toBe(true); // is invalid if touched and no value
        
        await selectFiles(component, [FILE, FILE, FILE]);
        
        component.update();
        expect(component.find(MockComponent).prop('error')).toBe(null); // no error if touched and has value
        expect(component.find(MockComponent).prop('isValid')).toBe(true); // is valid if is not touched and has value
        expect(component.find(MockComponent).prop('isInvalid')).toBe(false); // not invalid if is not touched and has value
    });

})
