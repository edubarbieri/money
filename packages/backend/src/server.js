const app = require('./app')
const {port} = require('./env')
app().then(server => {
    server.listen(port, () => {
        console.log(`================= Server running in port ${port} =================`);
    });
});