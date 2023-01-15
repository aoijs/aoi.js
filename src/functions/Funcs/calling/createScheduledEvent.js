const { GuildScheduledEventEntityType } = require( 'discord.js' );
const {Time} = require('../../../utils/helpers/customParser.js');
module.exports = async d =>
{
    const data = d.util.aoiFunc( d );
    if ( data.err ) return d.error( data.err );

    let [ channelID, name, description, starTime, EndTime = undefined, entityType = GuildScheduledEventEntityType.StageInstance, entityMetadata, image, reason ] = data.inside.splits;
    
    try
    {
        const se = JSON.parse( channelID );
        if(typeof se !== "object" || se === null) throw new Error("Invalid JSON");
        const guild = d.guild;

        await guild.scheduledEvents.create( se ).catch( e =>
        {
            d.aoiError.fnError( d, "custom", {}, "Failed To Create Stage Instance With Reason: " + e );
        } );
  return {
        code: d.util.setCode(data)
    }

    } catch( e )
    {
        // Do nothing
    }
    channelID = channelID !== "" ? channelID : undefined;
    name = name !== "" ? name : undefined;
    description = description !== "" ? description : undefined;
    starTime = starTime !== "" ? starTime : undefined;
    EndTime = EndTime !== "" ? EndTime : undefined;
    entityType = entityType !== "" ? Number(entityType) : GuildScheduledEventEntityType.StageInstance;
    entityMetadata = entityMetadata !== "" ? entityMetadata : undefined;
    image = image !== "" ? image : undefined;
    reason = reason !== "" ? reason : undefined;

    const guild = d.guild;
    starTime = Time.parse( !isNaN(starTime) ? Number(starTime) : starTime ).ms;
    EndTime = EndTime ? Time.parse( !isNaN(EndTime) ? Number(EndTime) : EndTime ).ms : undefined;
    guild.scheduledEvents.create( { channel: channelID, name: name.addBrackets(), description: description?.addBrackets(), scheduledStartTime: starTime, scheduledEndTime: EndTime, privacyLevel: 2, entityType: entityType, entityMetadata: entityMetadata ? { location: entityMetadata?.addBrackets() } : undefined, image: image?.addBrackets(), reason: reason?.addBrackets() } ).catch( e =>
    {
        d.aoiError.fnError( d, "custom", {}, "Failed To Create ScheduledEvent With Reason: " + e );
    } );

    return {
        code: d.util.setCode( data )
    };
};