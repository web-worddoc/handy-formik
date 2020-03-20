import * as React from 'react';
import { useFormikContext } from 'formik';
import Dropzone from 'react-dropzone';


type Props = {
    name: string;
    maxFiles?: number;
    maxSize?: number;
    multiple?: boolean;
    accept?: string;
    format?: Format;

    render: (props: OutputProps) => any;
}

type OutputProps = {
    name: string;
    value: any;
    files: CustomFile[];
    touched: boolean;
    error: string | null;
    isValid: boolean | null;
    isInvalid: boolean | null;
    isUploading: boolean;

    onClick: () => void;
    onDelete: (targetIndex: number) => void;
    onBlur: (e: React.SyntheticEvent) => void;
}

type CustomFile = {
    name: string;
    size: number;
    preview: string;
    src: File | string;
}

type Format = 'base64';

export const FormikFile = ({ render, name, maxFiles, multiple, maxSize, accept, format, ...rest }: Props) => {
    if (!name) throw new Error(`FormikFile: prop 'name' doesn't exist!`);
    if (!render) throw new Error(`FormikFile: prop 'render' doesn't exist!`);

    const myRef: React.RefObject<any> | null = React.useRef(null);
    const [ filesState, setFilesState ]: any = React.useState <CustomFile[] | string | null>([]);
    const [ isUploading, setUploading ]: any = React.useState(false);
    const {
        values,
        errors,
        touched,
        setFieldValue,
        getFieldProps
    }: any = useFormikContext();

    // Sync state and form value
    React.useEffect(() => {
        setTimeout(() => {
            if (Array.isArray(values[name]) && values[name].length !== filesState.length) {
                setFilesState(values[name].filter((file: string | File, i: number) => file !== filesState[i].src));
            }
        }, 0);
    }, [values])

    const handleUpload = (dropped: File[]) => {
        setUploading(true);
        const newAmount = dropped.length;
        const currentAmount = filesState.length;
        let acceptedFiles = dropped;
        let formattedAcceptedFiles: CustomFile[] = [];

        if (multiple && maxFiles && currentAmount + newAmount > maxFiles) {
            acceptedFiles = acceptedFiles.slice(
                0, -1 * (currentAmount + newAmount - maxFiles)
            );
        }

        acceptedFiles.forEach((file: File) => {
            const reader: any = new FileReader();
            reader.onload = (e: { target: { result: string } }) => {
                const src = (() => {
                    if (format === 'base64')
                        return e.target.result;
                    else
                        return file;
                })();

                formattedAcceptedFiles = [...formattedAcceptedFiles, ...[{
                    name: file.name,
                    size: file.size,
                    preview: e.target.result,
                    src
                }]]
            };
            reader.readAsDataURL(file);
        })

        let interval = setInterval(() => {
            if (acceptedFiles.length === formattedAcceptedFiles.length) {
                setUploading(false);
                setFilesState(multiple ? [...filesState, ...formattedAcceptedFiles] : formattedAcceptedFiles.slice(0, 1));
                if (multiple) {
                    const currentValues = Array.isArray(values[name]) ? values[name] : [];
                    setFieldValue(name, [...currentValues, ...formattedAcceptedFiles.map(item => item.src)]);
                } else {
                    setFieldValue(name, formattedAcceptedFiles[0].src);
                }
                clearInterval(interval);
            }
        }, 100);
    };

    const handleDelete = (targetIndex: number) => {
        let newFilesState = filesState;
        newFilesState.splice(targetIndex, 1);
        setFilesState(newFilesState);

        if (Array.isArray(values[name])) {
            let newFormikValue = values[name];
            newFormikValue.splice(targetIndex, 1);
            setFieldValue(name, newFormikValue);
        } else {
            setFieldValue(name, null);
        }
    };

    const handleClick = () => {
        if (myRef.current) {
            myRef.current.open();
        }
    };

    const isValid = touched[name] ? !errors[name] && (Array.isArray(values[name]) ? !!values[name].length : !!values[name]) : null;
    const isInvalid = touched[name] ? !!errors[name] : null;
    const error = touched[name] ? errors[name] || null : null;

    return (
        <Dropzone
            ref={myRef}
            noClick
            noKeyboard
            accept={accept}
            multiple={multiple}
            maxSize={maxSize}
            minSize={1}
            onDropAccepted={handleUpload}
            {...rest}
        >
            {({ getInputProps }) => {
                const extendedProps = getFieldProps(name);
                delete extendedProps.onChange;

                return (
                    <>
                        <input {...getInputProps()} name={name} />
                        {
                            render({
                                ...extendedProps,
                                files: filesState,
                                error,
                                touched: !!touched[name],
                                isValid,
                                isInvalid,
                                isUploading,
                                onClick: handleClick,
                                onDelete: handleDelete,
                            })
                        }
                    </>
                );
            }}
        </Dropzone>
    )
}
