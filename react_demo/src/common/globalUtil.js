const getObjLabel = (val, arr, label = 'label', value = 'value') => {
    for (let item of arr) {
        if (item[value] === val) {
            return item[label];
        }
    }
    return '';
}

window.getObjLabel = getObjLabel;