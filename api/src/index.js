const express = require('express')
const fs = require('fs')
const cors = require('cors')

const app = express()
const port = 3000

app.use(cors())

createBitmapIfNotExists()

app.get('/', (req, res) => {
    res.send('This is the API for Grid Paint')
})

app.get('/grid', (req, res) => {
    try {
        const data = fs.readFileSync('bitmap.txt', 'utf8')
        res.send(JSON.parse(data))
    } catch (err) {
        console.error(err)
    }
})

app.listen(port, () => {
    console.log(`Started on port ${port}`)
})


function createBitmapIfNotExists() {
    try {
        if (!fs.existsSync('bitmap.txt')) {
            let bitmap = []
            let first_array = []
            const [x_dims, y_dims] = [96, 54]

            for (let y = 0; y < y_dims; y++) {
                first_array.push(false)
            }

            for (let x = 0; x < x_dims; x++) {
                bitmap.push([...first_array])
            }

            try {
                fs.writeFileSync('bitmap.txt', JSON.stringify(bitmap), 'utf8')
            } catch (err) {
                console.error(err)
            }
        }
    } catch (err) {
        console.error(err)
        process.exit()
    }
}
