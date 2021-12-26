const path = require('path');
const zlib = require('zlib');
const { promises: fs } = require("fs");
const parseString = require('xml2js').parseString;
const compress = require('compress-json').compress;

const reqPath = path.join(__dirname, '../../');

const extractTracks = (gpx) => {
  if (!gpx.trk) {
    console.log('GPX file has no track', gpx);
    throw new Error('Unexpected gpx file format.');
  }

  const parsedTracks = [];

  gpx.trk && gpx.trk.forEach(trk => {
    const name = trk.name && trk.name.length > 0 ? trk.name[0] : 'untitled';
    let timestamp;

    console.log(`Extracting tracks from ${name}`);
    
    trk.trkseg.forEach(trkseg => {
      let points = [];
      for (let trkpt of trkseg.trkpt || []) {
        if (trkpt.time && typeof trkpt.time[0] === 'string') {
          timestamp = new Date(trkpt.time[0]);
        }
        if (typeof trkpt.$ !== 'undefined' && typeof trkpt.$.lat !== 'undefined' && typeof trkpt.$.lon !== 'undefined') {
          points.push({ lat: parseFloat(trkpt.$.lat), lng: parseFloat(trkpt.$.lon) });
        }
      }
      if (points.length > 0) {
        parsedTracks.push({timestamp, points, name});
      }
    });
  });
  return parsedTracks;
}

const getFilePaths = async (directory) => {
  const files = await fs.readdir(directory);
  return files.flatMap((file) => {
    // TODO: eventually handle gzip
    const format = file.split('.').pop().toLowerCase();
    return format === 'gpx' ? `${directory}/${file}` : [];
  });
};

const readFile = async (filePath) => {
  const content = await fs.readFile(filePath, 'utf-8');
  return new Promise((resolve, reject) => {
    parseString(content, (err, result) => {
      if (err) {
        reject(err);
      } else if (result.gpx) {
        const track = extractTracks(result.gpx);
        resolve(track);
      } else {
        reject(new Error(`Can't extract GPX.`));
      }
    });
  });
};

const readFiles = async (paths) => Promise.all(paths.map((path) => readFile(path))).then((results) => results);

const parseGPX = async () => {
  const directory = './activies';
  const paths = await getFilePaths(directory);
  const activities = await readFiles(paths);
  const data = JSON.stringify(compress({ data: activities }));

  fs.writeFile(`${reqPath}output/output.json`, data , 'utf8', (error) => {
    if (err) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(error);
    }
    console.log(
      `JSON file has been saved as ./output/${documentId}-output.json`
    );
  });        
    
};

parseGPX();