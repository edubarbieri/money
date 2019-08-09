const app = require('./app')
const {port} = require('./env')
const {sequelize} = require('./db')

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`================= Server running in port ${port} =================`);
    });
});