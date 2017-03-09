#!/usr/bin/env node
//gain access to the core module "stream"
const {Readable, Writable, Transform } = require('stream');
const {createReadStream, writeFile} = require('fs');

//grab arguments from console
let fileArg = process.argv[2];
let destArg = process.argv[3];

//ReadStream
//create a read stream
const readStream = createReadStream(fileArg);
//create new instances of each of the stream classes below
const writeStream = Writable();
const transformStream = Transform();

//define the readStream so that on data
readStream.on('data', buffer => {
    readStream.pause();
    //the data is pushed
    readStream.push(buffer);

});
//at the end of the data, push null to signify the end
readStream.on('end', ()=> {
    readStream.push(null);

});

//define the inner methods
//transformStream
transformStream._transform = (buffer, encoding, done) => {
  //take the data passed to it, convert it to a string,
  //and then convert it to upper case
  done(null, `${buffer.toString().toUpperCase()}`)
}

//Write
  //take the data passed to it
writeStream._write = (buffer, _, done) => {
  //grab the destination file from the 2nd argument from the terminal
  //and write the data received to the file passed to it
  writeFile(destArg, buffer, 'utf8', (err) =>{
    if (err) throw err;
  })

  done;
}

//Pipe
//take the data from the read stream, pass it to the transform stream and then
//pass the transformed data to the write stream
readStream.pipe(transformStream).pipe(writeStream);
