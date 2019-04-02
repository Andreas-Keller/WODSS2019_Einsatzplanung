// const firebase = require('./firebase.admin.js');
// const crud = require('./firebase.global.crud.js');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const getRandomID = () => {
    return (getRandomInt(9223372036854776000) + 1);
};


module.exports = {
    getRandomID
};