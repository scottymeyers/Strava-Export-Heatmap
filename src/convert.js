const { promises: fs } = require('fs');
const FitParser = require('fit-file-parser').default;
const pako = require('pako');
const parseString = require('xml2js').parseStringPromise;

const fitParser = new FitParser({ force: true });

const WRITE_PATH = '../public/activities.json';
const READ_DIR = '../activities';

const { log } = console;

// properly categorize activities when importing data from other services
function mapActivityType(type) {
  switch (type) {
    case 'Cycling':
    case 'Biking':
      return ['1'];
    case 'Running':
      return ['9'];
    default:
      return [type];
  }
}

async function getFilePaths(files) {
  return files.flatMap((file) => {
    const format = file.split('.').pop().toLowerCase();
    return ['gpx', 'gz'].includes(format) ? `${READ_DIR}/${file}` : [];
  });
}

// GPS Exchange Format
async function processGPX(data) {
  try {
    const parsedString = await parseString(data);
    if (parsedString && parsedString.gpx) {
      const { gpx } = parsedString;
      if (!gpx.trk) return [];

      const parsedTracks = [];

      gpx.trk.forEach((trk) => {
        const name = trk.name && trk.name.length > 0 ? trk.name[0] : 'untitled';
        log(`Processing ${name}`);
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
    }
    return [];
  } catch (error) {
    log(error);
  }
}

// Flexible and Interoperable Data Transfer (FIT) protocol
function processFIT(data) {
  const name = data.file_ids?.[0]?.manufacturer;
  log(`Processing ${name}`);
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
}

async function readFile(path) {
  const fileContent = await fs.readFile(path);
  if (/\.gz$/i.test(path)) {
    if (/\.fit.gz$/i.test(path)) {
      const decompressedFileContent = pako.inflate(fileContent);
      return new Promise((resolve, reject) => {
        fitParser.parse(decompressedFileContent, (error, data) => {
          if (error) reject(error);
          return resolve(processFIT(data));
        });
      });
    } else {
      const decompressedFileContent = pako.inflate(fileContent, {
        to: 'string',
      });
      return await processGPX(decompressedFileContent);
    }
  } else {
    return await processGPX(fileContent);
  }
}

(async () => {
  const files = await fs.readdir(READ_DIR);
  const paths = await getFilePaths(files);
  const data = await Promise.all(paths.map((path) => readFile(path)));
  const jsonString = JSON.stringify(data.flatMap((d) => d));

  fs.writeFile(WRITE_PATH, jsonString, { encoding: 'utf8' }).then(() => {
    log(`JSON has been saved to ${WRITE_PATH.replace('../', '')}`);
  });
})();
