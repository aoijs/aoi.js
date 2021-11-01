module.exports = async d => {
    const data = d.util.openFunc( d );
 
    if( !d.author?.banner ) {
       await d.author?.fetch()
    }
    
    data.result = d.author?.bannerURL();
    
    return {
        code : d.util.setCode( data )
    }
}