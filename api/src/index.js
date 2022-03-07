const express = require('express')
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

createGridIfNotExists()

app.get('/', (req, res) => {
    res.send('This is the API for Grid Paint')
})

app.get('/grid', (req, res) => {
    try {
        const grid = JSON.parse(fs.readFileSync('grid.txt', 'utf8'))
        res.send(grid)
    } catch (err) {
        console.error(err)
    }
})

app.post('/grid', (req, res) => {
    try {
        let grid = JSON.parse(fs.readFileSync('grid.txt', 'utf8'))
        grid[req.body.x][req.body.y] = !grid[req.body.x][req.body.y]
        fs.writeFileSync('grid.txt', JSON.stringify(grid), 'utf8')
        res.status(201).end()
    } catch (err) {
        console.error(err)
    }
})

app.listen(port, () => {
    console.log(`Started on port ${port}`)
})

function createGridIfNotExists() {
    try {
        if (!fs.existsSync('grid.txt')) {
            let grid = []
            let first_array = []
            const [x_dims, y_dims] = [96, 54] // 96x54

            for (let y = 0; y < y_dims; y++) {
                first_array.push(false)
            }

            for (let x = 0; x < x_dims; x++) {
                grid.push([...first_array])
            }

            try {
                fs.writeFileSync('grid.txt', JSON.stringify(grid), 'utf8')
            } catch (err) {
                console.error(err)
            }
        }
    } catch (err) {
        console.error(err)
        process.exit()
    }
}
