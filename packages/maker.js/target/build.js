const browserify = require('browserify');
const fs = require('fs');
const utf8 = 'utf8';

// Add versioned header to the top of the TypeScript declaration file
const dts = './dist/index.d.ts';
const tsdHeader = fs.readFileSync('./target/tsd-header.txt', utf8);
const versionedHeader = tsdHeader.replace(/#VERSION#/, require('../package.json').version);
const content = fs.readFileSync(dts, utf8);
fs.writeFileSync(dts, versionedHeader + content, utf8);

// Add version code to the bottom of the JavaScript file
const js = './dist/index.js';
fs.appendFileSync(js, 'MakerJs.version = "' + require('../package.json').version + '";\n');

// Configure Browserify to expose makerjs as an AMD module
const b = browserify(js, {
    standalone: 'makerjs', // Expose makerjs as a UMD (Universal Module Definition) module
    plugin: ['licensify']
});

b.ignore('buffer');
b.bundle((err, buf) => {
    if (err) {
        console.error("Error during bundling:", err);
        return;
    }

    // Read and add header content
    const header = fs.readFileSync('./target/header.txt', utf8);
    const browserCode = header + buf.toString(utf8);

    // Write the browser-compatible code to the target output files
    fs.writeFileSync('./dist/browser.maker.js', browserCode, utf8);
    fs.writeFileSync('../../docs/target/js/browser.maker.js', browserCode, utf8);

    // Append the header to the node version
    const nodeCode = header + fs.readFileSync(js, utf8);
    const nodeFooter = fs.readFileSync('./target/node-requires.js', utf8);
    fs.writeFileSync(js, nodeCode + nodeFooter, utf8);

    console.log("Maker.js,  bezier-js built successfully for AMD compatibility.");
});
