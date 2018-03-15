const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const file = 'rhythmdb.xml';

fs.readFile(`${__dirname}/${file}`, (err, data) => {
  parser.parseString(data, (err, result) => {
    const builder = new xml2js.Builder();

    const songs = result.rhythmdb.entry.reduce((songs, song) => {
      let songLocation = song.location[0].split("/");
      songLocation = songLocation[songLocation.length-1].replace(/\.[^/.]+$/, "");
      console.log(songLocation)
      songLocation = songLocation.split('-');
      let title = songLocation[1].replace(/%20/g, " ").trim();
      let artist = songLocation[0].replace(/%20/g, " ").trim();

      songs.push({
        $: { type: "song"},
        title: title,
        genre: "Unknown",
        artist: artist,
        album: "Unknown",
        duration: song.duration[0],
        "file-size": song["file-size"][0],
        "location": song.location[0],
        mtime: song.mtime[0],
        "first-seen": song["first-seen"][0],
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
        entry: songs,
      }
    };

    let rhythmdb = builder.buildObject(obj);
    console.log(rhythmdb)
    fs.writeFile(`${__dirname}/build/${file}`, rhythmdb, (err) => {
      console.log('Done');
    });
  });
});