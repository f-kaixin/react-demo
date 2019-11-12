export const test = () => {
    console.log(1)
}

const getDataType = (data) => {
    let type = typeof(data);
    type = type === 'object' ?
        Array.isArray(data) ? 'array' :
        'object' : type;
    return type;
};

const deepClone = (data, expectKey) => {
    let type = getDataType(data);
    let obj;

    if (type === 'array') {
        obj = [];
    } else if (type === 'object') {
        obj = {};
    } else {
        //不再具有下一层次
        return data;
    }

    // 将expectKey转为数组类型
    if (expectKey && getDataType(data) == 'number') {
        expectKey = expectKey.split(',');
    }

    if (type === 'array') {
        for (var i = 0, len = data.length; i < len; i++) {
            obj.push(deepClone(data[i]));
        }
    } else if (type === 'object') {
        for (var key in data) {
            if (!expectKey || (expectKey && !expectKey.includes(key))) {
                obj[key] = deepClone(data[key]);
            }
        }
    }

    return obj;
}

export {
    getDataType, 
    deepClone
}