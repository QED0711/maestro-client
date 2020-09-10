
const parseQueryString = (queryString) => {
    // parse query string
    const params = new URLSearchParams(queryString);

    const obj = {};

    // iterate over all keys
    let val;
    for (const key of params.keys()) {
        if (params.getAll(key).length > 1) {
            val = params.getAll(key);
        } else {
            val = params.get(key);
        }

        // handle numbers
        if(["0", "0.0."].includes(val) || parseFloat(val)) val = parseFloat(val)

        // handle booleans
        if(val === "false") val = false;
        if(val === "true") val = true;

        obj[key] = val
    }
    return obj
}



export default parseQueryString