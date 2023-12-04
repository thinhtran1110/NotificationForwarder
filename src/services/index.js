const axios = require("axios");

const apiService = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Token": process.env.PUSHER_ACCESS_TOKEN,
    },
});

module.exports = {
    apiService,
};
