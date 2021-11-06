module.exports = async d => {
    const data = d.util.openFunc( d );
    if( data.err ) return d.error( data.err );

    const [ roleId,newPosition ] = data.inside.splits;
    const role = d.guild?.roles?.cache?.get(roleID);
    if(!role) return d.aoiError.fnError( d,'role',{ inside : data.inside });

    await role.setPosition(newPosition).catch((err) => {
        d.aoiError.fnError( d,'custom',{ inside : data.inside },`Failed to change \`${role.name}\` position to \`${newPosition}\` with Reason: ${err}`);
    });

    return {
        code: d.util.setCode(data)
    }
}
