const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

//https://nodejs.org/en/knowledge/file-system/how-to-write-files-in-nodejs/
//https://www.geeksforgeeks.org/node-js-path-join-method/
exports.create = (text, callback) => {
  //error first callback pattern
  //each entry needs a new file, so ill use .writeFile
  //get the next id
  counter.getNextUniqueId((err,id) =>{
    //can use a template literal of the filepath to the datastore to create the txt file
    //and each todo is being stored in a txt file
    //write file needs new file path, the text of the todo(which is passed in), and a cb if theres an error
    //path.join(exports.dataDir, `${id}.txt`)
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
    // fs.writeFile(`./datastore/${id}.txt`, text, (err) =>{
      if(err){
        throw("Error writing file: ",err) ;
      }else{
        callback(null, {id: id, text: text});
      }
    });
  });
};


// exports.readAll = (callback) => {
//   // fs.readdir(path[, options], callback)
//   let result = [];
//   fs.readdir(exports.dataDir, (err, files) => {
//     if (err) {
//       throw("Error: Cannot read dir!")
//     } else {
//       for(let i = 0; i < files.length;i++){
//         result.push({id: files[i].substring(0,5),text:files[i].substring(0,5)})
//       }
//   }
//   callback(null, result);
//   });
// };

exports.readAll = (callback) => {
  // fs.readdir(path[, options], callback)
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw("Error: Cannot read dir!")
    } else {
    var result = [];
    _.map(files, (file) => {
      var id = file.replace('.txt', ''); //removes the .txt from the end
      result.push({id: id, text: id});
    });
  }
    callback(null, result);
  });
};

// exports.readAll = (callback) => {
//   var data = _.map(items, (text, id) => {
//     return { id, text };
//   });
//   callback(null, data);
// };

exports.readOne = (id, callback) => {
  //fs.readFile(path[, options], callback)
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, fileData) => {
    if (err) {
      callback(("Error, cannot read file!"));
    } else {
      callback(null, { id: id, text: fileData.toString()});
  }
});
};

// exports.readOne = (id, callback) => {
//   var text = items[id];
//   if (!text) {
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     callback(null, { id, text });
//   }
// };

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
