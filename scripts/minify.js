const fs = require('fs')
const uglifyjs = require('uglify-js')
const files = [
  './lib/index.js',
  './lib/modules/VSSM.js',
  './lib/modules/VSSMParam.js',
  './lib/modules/VSSMState.js'
].map(file =>
  fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .map(l => {
      if (l.includes('export default')) l = l.replace('export default', '')
      return l
    })
    .filter(l => !l.startsWith('import'))
    .join('\n')
)
const result = uglifyjs.minify(files)

if (result.error) throw new Error(`Failed to minify: ${result.error}`)
fs.writeFileSync('./lib/vssm.min.js', result.code)
console.log('vssm.min.js minified successfuly!')
