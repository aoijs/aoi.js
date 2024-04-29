module.exports = (fields) => {
    const object = [];
    for (const field of fields) {
        const [name, description, required = "true", type = 3] = field.split(":");
        object.push({
            name,
            description,
            type: Number(type) || 3,
            required: required === "true",
        });
    }
    return object;
};
