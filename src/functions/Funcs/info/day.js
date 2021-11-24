module.exports = async d => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const {code} = d.util.openFunc(d);

    return {
        code: d.util.setCode({function: d.func, code, result: days[new Date().getDay()]})
    }
}