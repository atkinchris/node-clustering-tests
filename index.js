const os = require('os');
const http = require('http');
const cluster = require('cluster');

const numCPUs = Math.min(4, os.cpus().length)
const clusterEnabled = process.env.CLUSTERING_ENABLED === 'true'
const port = process.env.PORT

const handler = (req, res) => {
    console.log(`Handling request on ${process.pid}`)
    res.writeHead(200);
    res.end('hello world\n');
}

if (clusterEnabled) {
    if (cluster.isMaster) {
        console.log(`Master ${process.pid} is running`);
        console.log(`There are ${numCPUs} cores`)

        // Fork workers.
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    }
    else {
        http.createServer(handler).listen(port);
        console.log(`Worker ${process.pid} started`);
    }
}
else {
    http.createServer(handler).listen(port);
    console.log(`Single process ${process.pid} started`);
}
