const app = require('./app')
const {port} = require('./env')

app.listen(port, () => {
    console.log(`================= Server running in port ${port} =================`);
});