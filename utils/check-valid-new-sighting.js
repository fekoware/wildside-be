module.exports = (newSighting) => {
    const validLookup = {"uploaded_image": "string",
        "user_id": "string", 
        "long_position": "number",
        "lat_position": "number",
        "common_name": "string",
        "taxon_name": "string",
        "wikipedia_url": "string"}
    const output = []; 
    if (Object.keys(newSighting).length !== Object.keys(validLookup).length) {
        return false;
    }
    for (let [key, value] of Object.entries(validLookup)) {
        output.push(newSighting[key] !== undefined);
        output.push(value === typeof newSighting[key])
    }
    return !output.includes(false)
}


