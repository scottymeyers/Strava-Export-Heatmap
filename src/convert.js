const { promises: fs } = require('fs');
const pako = require('pako');
const parseString = require('xml2js').parseStringPromise;

const parseGpx = (gpx) => {
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
        let activityType = [...trk.type];
        if (trk.type[0] === 'Biking') {
          activityType[0] = '1';
        }
        if (trk.type[0] === 'Running') {
          activityType[0] = '9';
        }
        parsedTracks.push({
          name,
          timestamp,
          type: activityType,
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
    const format = file.split('.').pop().toLowerCase();
    return ['gpx', 'gz'].includes(format) ? `${directory}/${file}` : [];
  });
};

const parseFileData = async (fileContent) => {
  const { gpx } = await parseString(fileContent);
  return gpx ? parseGpx(gpx) : [];
};

const readFile = async (filePath) => {
  const fileContent = await fs.readFile(filePath);
  const isGzipped = /\.gz$/i.test(filePath);
  const fileData = isGzipped
    ? pako.inflate(fileContent, { to: 'string' })
    : fileContent;
  return await parseFileData(fileData);
};

const readFiles = async (paths) => {
  const data = await Promise.all(
    paths.map((filePath) => readFile(filePath))
  ).then((fileData) => fileData);
  const flattened = data.flatMap((d) => d);
  return JSON.stringify(flattened);
};

const gpxToJson = async () => {
  const filePaths = await getFilePaths('../activities');
  const json = await readFiles(filePaths);

  fs.writeFile('../public/activities.json', json, 'utf8', (error) => {
    if (error) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(error);
    }
    console.log('JSON file has been saved as ../public/activities.json');
  });
};

gpxToJson();
