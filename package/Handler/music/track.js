class Track {
constructor(info, resource,stream,author, platform){
this.author = author 
this.transformInfo(info,platform)
this.stream = stream 
this.rawInfo = info 
this.resource = resource 
this.platform = platform
}
transformInfo(info,platform){
if(platform === 0){
this.info = {
title:info.title,
description:info.description,
url:info.video_url,
//thumbnail:info.thumbnails[0].url,
publisher: info.ownerChannelName,
publisherURL:info.ownerProfileUrl,
duration:info.lengthSeconds*1000,
likes:info.likes,
views:info.viewCount
}
}
else if(platform === 1){
this.info = {
title:info.title,
description:info.description,
url:info.permalink_url,
thumbnail:info.artwork_url,
publisher:info.user.username,
publisherURL:info.user.permalink_url,
duration:info.duration,
likes:info.like_count,
views:info.playback_count 
}
}
}
getUserID(){
    return this.author.user.id 
}
getCurrentDuration(){
    return this.resource.playbackDuration 
}
getDurationLeft(){
    return (this.info.duration - this.resource.playbackDuration)
}
}
module.exports = Track;