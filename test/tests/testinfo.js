const data = require('./data')

const result1 = data.results[0].times
const result2 = data.results[1].times
let r1 = 0
let r2 = 0
for (let index = 0; index < result1.length; index++) {
	r1 += parseInt(result1[index])
}
for (let index = 0; index < result2.length; index++) {
	r2 += parseInt(result2[index])
}

console.log(r1 / result1.length, r2 / result2.length)
