import express from "express";

import axios from "axios";

import responseTime from "response-time";

import redis from "redis";

const client = redis.createClient({
	host: "localhost",
	port: 6379,
});

const app = express();

app.use(responseTime());

app.get("/characters", async (req, res) => {
	client.get("characters", (err, reply) => {
		if (reply) {
			return res.json(JSON.parse(reply));
		}
	});

	const response = await axios.get(
		"https://rickandmortyapi.com/api/character"
	);

	client.set("characters", JSON.stringify(response.data), (err, reply) => {
		if (err) {
			console.log(err);
		}

		res.json(response.data);
	});
});

app.get("/characters/:id", async (req, res) => {

    client.get(`character:${req.params.id}`, (err, reply) => {
        if (reply) {
            return res.json(JSON.parse(reply));
        }
    });

	const response = await axios.get(
		`https://rickandmortyapi.com/api/character/${req.params.id}`
	);

    client.set(`character:${req.params.id}`, JSON.stringify(response.data), (err, reply) => {
        if (err) {
            console.log(err);
        }

        res.json(response.data);
    });
});

app.listen(3000, () => {
	console.log("Example app listening on port 3000!");
});
