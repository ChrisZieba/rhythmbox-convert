const fs = require('fs');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();


const file = 'rhythmdb.xml';

fs.readFile(`${__dirname}/${file}`, (err, data) => {
  parser.parseString(data, (err, result) => {
    const builder = new xml2js.Builder();
    let title = '';
    let artist = '';

    
    const songs = result.rhythmdb.entry.reduce((songs, song) => {
      console.log(song)
      songs.push({
        title: title,
        genre: "Unknown",
        artist: artist,
        album: "Unknown",
        duration: song.duration[0],
        "file-size": song["file-size"][0],
        "location": song.location[0],
        bitrate: song.bitrate[0],
        "first-seen":, song["first-seen"][0],
        "last-seen": song["last-seen"][0], 
        bitrate: song.bitrate[0],
        date: song.date[0],
        "media-type": song["media-type"][0]
      });
      return songs;
    }, []);

    const obj = {
      rhythmdb: {
        $: {version: "1.8"},
        song: [{g:4},{g:6}],
      }
    };

    let rhythmdb = builder.buildObject(obj);
    console.log(rhythmdb)
    fs.writeFile(`${__dirname}/build/${file}`, rhythmdb, (err) => {
      console.log('Done');
    });
  });
});