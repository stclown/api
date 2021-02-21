const mongoose = require('mongoose');

module.exports = {
    connect: DB_HOST => {
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        //mongoose.set('useUnifiedTopology', false);

        mongoose.connect(DB_HOST);

        mongoose.connection.on('error', err => {
            console.error(err);
            console.log('Błąd połączenia z mongo');
            process.exit();
        });
    },
    close: () => {
        mongoose.connection.close();
    }
}