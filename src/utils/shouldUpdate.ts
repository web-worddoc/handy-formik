export const shouldUpdate = (prevProps: any, nextProps: any) => {
    let res = true;
    for (let prop in nextProps) {
        if (prop !== 'render') {
            if (nextProps[prop] !== prevProps[prop]) {
                res = false;
                break;
            }
        }
    }
    return res;
}
