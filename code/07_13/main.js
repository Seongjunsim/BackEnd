// @ts-check
// Formatting, Linting , Type Checking
// Formatting: Prettier
// Linting: ESLint

console.log('__dirname', __dirname)
console.log('__filename', __filename)

// process.stdin.setEncoding('utf-8')
// process.stdin.on('data', (data) => {
//   console.log(data, data.length)
// })

setInterval(() => {
  console.log('interval')
}, 1000)
