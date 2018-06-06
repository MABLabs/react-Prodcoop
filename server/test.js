const express = require('express')
const app = express()

app.get('/', (req, res) => {

    const { spawn } = require('child_process');
    const pyProg = spawn('python',['./myhcsr04.py']);

    pyProg.stdout.on('data', function(data) {

        console.log(data.toString());
        res.write(data);
        res.end('end');

    });
})

app.listen(4000, () => console.log('app listening on port 4000!'))
