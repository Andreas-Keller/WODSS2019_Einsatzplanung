const uuidv4 = require('uuid/v4');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const getRandomID = () => {
    return (getRandomInt(9223372036854776000) + 1);
};

const getRandomUUID = () => {
    return uuidv4();
};

const getProjectsByInvolvedEmployeeId = (id) => {

};

module.exports = {
    getRandomID,
    getRandomUUID
};