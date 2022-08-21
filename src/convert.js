const { promises: fs } = require('fs');
const FitParser = require('fit-file-parser').default;

const pako = require('pako');
const parseString = require('xml2js').parseStringPromise;

const fitParser = new FitParser({ force: true });

/*
                            /        - opens
                             \.gz    - matches ".gz" characters
                                 $   - matches the end of the string
                                  /  - closes
                                   i - case insensitive
  */
const isGzipped = (path) => /\.gz$/i.test(path);
/*
                        /            - opens
                         \.fit.gz    - matches ".fit.gz" characters
                                 $   - matches the end of the string
                                  /  - closes
                                   i - case insensitive
  */
const isFit = (path) => /\.fit.gz$/i.test(path);

const mapActivityType = (type) => {
  switch (type) {
    case 'Cycling': // Element FIT
    case 'Biking': // Strava GPX
    case '1':
      return ['1'];
    case 'Running': // Strava GPX
      return ['9'];
    default:
      return [];
  }
};

const getFilePaths = async (directory) => {
  const files = await fs.readdir(directory);
  return files.flatMap((file) => {
    const format = file.split('.').pop().toLowerCase();
    return ['gpx', 'gz'].includes(format) ? `${directory}/${file}` : [];
  });
};

const readFile = async (path) => {
  const fileContent = await fs.readFile(path);
  if (isGzipped(path)) {
    if (isFit(path)) {
      const decompressedFileContent = pako.inflate(fileContent);
      return new Promise((resolve, reject) => {
        fitParser.parse(decompressedFileContent, (error, data) => {
          if (error) reject(error);
          return resolve(processFitFileData(data));
        });
      });
    } else {
      const decompressedFileContent = pako.inflate(fileContent, {
        to: 'string',
      });
      return await processGpxFileData(decompressedFileContent);
    }
  } else {
    return await processGpxFileData(fileContent);
  }
};

const readFiles = async (paths) => {
  const data = await Promise.all(paths.map((path) => readFile(path))).then(
    (fileData) => fileData
  );
  const flattened = data.flatMap((d) => d);
  return JSON.stringify(flattened);
};

const gpxToJson = async () => {
  const paths = await getFilePaths('../activities');
  const json = await readFiles(paths);

  fs.writeFile('../public/activities.json', json, 'utf8', (error) => {
    if (error) {
      console.log('An error occured while writing JSON Object to File.');
      return error;
    }
    console.log('JSON file has been saved as ../public/activities.json');
  });
};

// GPS Exchange Format
const processGpxFileData = async (data) => {
  try {
    const parsedString = await parseString(data);
    if (parsedString) {
      return parseGpx(parsedString.gpx);
    }
    return [];
  } catch (error) {
    console.log('!', error);
  }
};

// Flexible and Interoperable Data Transfer (FIT) protocol
const processFitFileData = (data) => {
  const name = data.file_ids?.[0]?.manufacturer;
  console.log(`Processing ${name}`);

  return {
    name,
    points: data.records.flatMap((record) => {
      if (record.position_lat && record.position_long) {
        return {
          lat: record.position_lat,
          lng: record.position_long,
        };
      }
      return [];
    }),
    timestamp: data.activity?.timestamp,
    type: mapActivityType(data.workout.wkt_name),
  };
};

const parseGpx = (gpx) => {
  if (!gpx.trk) return [];

  const parsedTracks = [];

  gpx.trk.forEach((trk) => {
    const name = trk.name && trk.name.length > 0 ? trk.name[0] : 'untitled';
    console.log(`Processing ${name}`);

    trk.trkseg.forEach((trkseg) => {
      let points = [];
      let timestamp;
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
          type: mapActivityType(trk.type[0]),
          points,
        });
      }
    });
  });

  return parsedTracks;
};

gpxToJson();
