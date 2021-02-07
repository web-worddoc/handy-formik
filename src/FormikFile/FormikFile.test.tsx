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
const MockComponent = (props: any) => <></>;

const getWrapperComponent = (props?: any, connectorProps?: any) => {
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

let wrapperComponent;
let mockComponent;

function updateWrapperComponent() {
    wrapperComponent.update();
    mockComponent = wrapperComponent.find(MockComponent);
}

describe('FormikFile', () => {
    beforeEach(() => {
        wrapperComponent = getWrapperComponent();
        mockComponent = wrapperComponent.find(MockComponent);
    })

    it('renders correctly', () => {
        expect(mockComponent.exists()).toBe(true);
    })

    it('descends expected props', () => {
        expect(mockComponent.prop('name')).toBe('files');
        expect(Array.isArray(mockComponent.prop('value'))).toBe(true);
        expect(mockComponent.prop('value').length).toBe(0);
        expect(Array.isArray(mockComponent.prop('files'))).toBe(true);
        expect(mockComponent.prop('files').length).toBe(0);
        expect(mockComponent.prop('touched')).toBe(false);
        expect(mockComponent.prop('error')).toBe(null);
        expect(mockComponent.prop('isValid')).toBe(null);
        expect(mockComponent.prop('isInvalid')).toBe(null);
        expect(mockComponent.prop('onClick')).toBeInstanceOf(Function);
        expect(mockComponent.prop('onDelete')).toBeInstanceOf(Function);
        expect(mockComponent.prop('onBlur')).toBeInstanceOf(Function);
    });

    it('accepts 1 file if multiple not desired', async () => {
        await selectFiles(wrapperComponent, [FILE, FILE, FILE]);
    
        updateWrapperComponent();
        expect(mockComponent.prop('value')).toBeInstanceOf(File);
        expect(mockComponent.prop('files').length).toBe(1);
        expect(mockComponent.prop('files')[0].size).not.toBe(undefined);
        expect(mockComponent.prop('files')[0].name).not.toBe(undefined);
        expect(mockComponent.prop('files')[0].src).not.toBe(undefined);
    })

    it('accepts multiple files if desired', async () => {
        wrapperComponent = getWrapperComponent(null, {
            multiple: true,
        });
        mockComponent = wrapperComponent.find(MockComponent);
    
        await selectFiles(wrapperComponent, [FILE]);
    
        updateWrapperComponent();
        expect(mockComponent.prop('value').length).toBe(1);
        expect(mockComponent.prop('files').length).toBe(1);

        await selectFiles(wrapperComponent, [FILE]);
        updateWrapperComponent();
        expect(mockComponent.prop('value').length).toBe(2);
        expect(mockComponent.prop('files').length).toBe(2);
    })

    it('doesn\'t accept more than maxFiles', async () => {
        wrapperComponent = getWrapperComponent(null, {
            multiple: true,
            maxFiles: 2
        });
        mockComponent = wrapperComponent.find(MockComponent);

        await selectFiles(wrapperComponent, [FILE, FILE]);

        updateWrapperComponent();
        expect(mockComponent.prop('value').length).toBe(2);
        expect(mockComponent.prop('files').length).toBe(2);

        await selectFiles(wrapperComponent, [FILE]);

        updateWrapperComponent();
        expect(mockComponent.prop('value').length).toBe(2);
        expect(mockComponent.prop('files').length).toBe(2);
    })

    it('upload single file as File', async () => {
        await selectFiles(wrapperComponent, [FILE, FILE, FILE]);

        updateWrapperComponent();
        expect(mockComponent.prop('value')).toBeInstanceOf(File);
        expect(mockComponent.prop('files').length).toBe(1);
        expect(mockComponent.prop('files')[0].name).toBe('test.txt');
        expect(mockComponent.prop('files')[0].size).toBe(4);
        expect(mockComponent.prop('files')[0].src).toBeInstanceOf(File);
    })

    it('upload multiple files as File', async () => {
        wrapperComponent = getWrapperComponent(null, {
            multiple: true
        });
        mockComponent = wrapperComponent.find(MockComponent);

        await selectFiles(wrapperComponent, [FILE, FILE, FILE]);

        updateWrapperComponent();
        expect(mockComponent.prop('value').length).toBe(3);
        expect(mockComponent.prop('value')[0]).toBeInstanceOf(File);
        expect(mockComponent.prop('files').length).toBe(3);
        expect(mockComponent.prop('files')[0].name).toBe('test.txt');
        expect(mockComponent.prop('files')[0].size).toBe(4);
        expect(mockComponent.prop('files')[0].src).toBeInstanceOf(File);
    })

    it('upload single file as Base64', async () => {
        wrapperComponent = getWrapperComponent(null, {
            format: 'base64'
        });
        mockComponent = wrapperComponent.find(MockComponent);

        await selectFiles(wrapperComponent, [FILE, FILE, FILE]);

        updateWrapperComponent();
        expect(mockComponent.prop('value')).toBe(FILE_AS_BASE64);
        expect(mockComponent.prop('files').length).toBe(1);
        expect(mockComponent.prop('files')[0].name).toBe('test.txt');
        expect(mockComponent.prop('files')[0].size).toBe(4);
        expect(mockComponent.prop('files')[0].src).toBe(FILE_AS_BASE64);
    })

    it('upload multiple files as Base64', async () => {
        wrapperComponent = getWrapperComponent(null, {
            multiple: true,
            format: 'base64'
        });
        mockComponent = wrapperComponent.find(MockComponent);

        await selectFiles(wrapperComponent, [FILE, FILE, FILE]);

        updateWrapperComponent();
        expect(mockComponent.prop('value').length).toBe(3);
        expect(mockComponent.prop('value')[0]).toBe(FILE_AS_BASE64);
        expect(mockComponent.prop('files').length).toBe(3);
        expect(mockComponent.prop('files')[0].name).toBe('test.txt');
        expect(mockComponent.prop('files')[0].size).toBe(4);
        expect(mockComponent.prop('files')[0].src).toBe(FILE_AS_BASE64);
    })

    it('validates correctly', async () => {
        wrapperComponent = getWrapperComponent(null, {
            multiple: true
        });
        mockComponent = wrapperComponent.find(MockComponent);

        expect(mockComponent.prop('error')).toBe(null); // no error if not touched and no value
        expect(mockComponent.prop('isValid')).toBe(null); // no isValid status if not touched and no value
        expect(mockComponent.prop('isInvalid')).toBe(null); // no isInvalid status if not touched and no value
        
        await act(async () => {
            wrapperComponent.find('form').simulate('submit');
        });
        
        updateWrapperComponent();
        expect(mockComponent.prop('error')).toBe(ERROR_NEED_MORE_FILES); // has error if touched and no value
        expect(mockComponent.prop('isValid')).toBe(false); // no isValid status if touched and no value
        expect(mockComponent.prop('isInvalid')).toBe(true); // is invalid if touched and no value
        
        await selectFiles(wrapperComponent, [FILE, FILE, FILE]);
        
        updateWrapperComponent();
        expect(mockComponent.prop('error')).toBe(null); // no error if touched and has value
        expect(mockComponent.prop('isValid')).toBe(true); // is valid if is not touched and has value
        expect(mockComponent.prop('isInvalid')).toBe(false); // not invalid if is not touched and has value
    });

})
