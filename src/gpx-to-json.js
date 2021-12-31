const { promises: fs } = require('fs');
const parseString = require('xml2js').parseString;

const extractData = (gpx) => {
  if (!gpx.trk) return [];

  const parsedTracks = [];

  gpx.trk.forEach((trk) => {
    const name = trk.name && trk.name.length > 0 ? trk.name[0] : 'untitled';
    console.log(`Extracting tracks from ${name}`);

    let timestamp;

    trk.trkseg.forEach((trkseg) => {
      let points = [];
      for (let trkpt of trkseg.trkpt || []) {
        if (trkpt.time && typeof trkpt.time[0] === 'string') {
          timestamp = new Date(trkpt.time[0]);
        }
        if (trkpt.$?.lat && trkpt.$?.lon) {
          points.push({
            lat: parseFloat(trkpt.$.lat),
            lng: parseFloat(trkpt.$.lon),
          });
        }
      }
      if (points.length > 0) {
        parsedTracks.push({
          name,
          timestamp,
          type: trk.type,
          points,
        });
      }
    });
  });

  return parsedTracks;
};

const getFilePaths = async (directory) => {
  const files = await fs.readdir(directory);
  return files.flatMap((file) => {
    // TODO: eventually handle gzip
    const format = file.split('.').pop().toLowerCase();
    return format === 'gpx' ? `${directory}/${file}` : [];
  });
};

const parseFile = async (fileContent) => {
  return new Promise((resolve, reject) => {
    parseString(fileContent, (err, result) => {
      if (err) {
        reject(err);
      } else if (result.gpx) {
        const track = extractData(result.gpx);
        resolve(track);
      } else {
        reject(new Error("Can't extract GPX."));
      }
    });
  });
};

const readFile = async (filePath) => {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const parsedFile = await parseFile(fileContent);
  return parsedFile;
};

const readFiles = async (paths) =>
  Promise.all(paths.map((path) => readFile(path))).then((results) => results);

const gpxToJson = async () => {
  const paths = await getFilePaths('../activities');
  const data = await readFiles(paths);
  const flattenedData = data.flatMap((d) => d);
  const json = JSON.stringify(flattenedData);
  fs.writeFile('../public/activities.json', json, 'utf8', (error) => {
    if (error) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(error);
    }
    console.log('JSON file has been saved as ../public/activities.json');
  });
};

gpxToJson();
