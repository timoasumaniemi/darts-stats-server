const db_pool = require('../db_connection/db_connection');

const router = require('express').Router();


/**
 * Add new player
 */
router.post('/createPlayer', async (req, res) => {
    const playerName = req.body.player_name;
    console.log("trying to add player: " + playerName);

    try {
        await db_pool.execute("INSERT INTO players(player_name) VALUES (?)", [playerName]);
        res.status(200).json("Player added! " + playerName);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }

    console.log("Player Added!");
});

/**
 * Get all players and id's
 */

router.get('/getPlayers', async (req, res) => {

    try {
        const [players] = await db_pool.execute("SELECT * FROM players");
        res.status(200).json(players);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;