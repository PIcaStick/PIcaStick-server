const fs = require('fs');

const config = require('../../../config.json');

const uploadedFilesConf = config['uploaded-files'];

function clearUploadedFiles() {
  return (new Promise((resolve, reject) => {
    fs.readdir(uploadedFilesConf['folder'], (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  }))
  .then(files => files.filter(file => file.startsWith('upload')))
  .then(files => {
    return files.map(file => {
      return new Promise((resolve, reject) => {
        const path = `${uploadedFilesConf['folder']}/${file}`;
        fs.unlink(path, err => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  })
  .then(promises => Promise.all(promises))
  .catch(error => {
    console.error(error);
    throw "Something goes wrong on uploaded files deletion";
  });
}

module.exports = clearUploadedFiles;