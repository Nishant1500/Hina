const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const { createAudioResource } = require('@discordjs/voice');


const ytLinkRegex = /(?:https?:\/\/)?(?:www\.|m\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[^&\s\?]+(?!\S))\/)|(?:\S*v=|v\/)))([^&\s\?]+)/;

module.exports = {

    queryYT: async (query) => {

        let data;
        let video;

        if (ytLinkRegex.test(query[0])) { video = {url: query[0]} }
        else {
            query = query.join(' ');
            data = await ytSearch(query);
            if (!data.videos.length) throw `No search result using the keyword \`${query}\``;
            video = data.videos.shift();
        };
        // TODO check playability

        const stream = await ytdl(video.url, {filter: 'audioonly'});

        const videoInfo = await ytdl.getInfo(video.url);
        const resource = createAudioResource(stream);

        return {
            resource: resource,
            videoInfo: videoInfo,
        };
    },
};