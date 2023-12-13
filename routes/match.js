const { createNewTrainingMatch } = require('../controllers/matchController');
const router = require('express').Router();
/**
 * Start a new 501 training match.
 * Requires: player_id 
 */
router.post('/createNewTrainingMatch', async(req, res) => {
    try{
        const playerId = req.body.player_id;
        console.log("Creating new match for " + playerId);
        const matchId = await createNewTrainingMatch(playerId);
        res.status(200).json("501 Training Match created, ID: " + matchId);
    }catch(error){
        const msg = error.message;
        console.log(msg);
        res.status(500).json(msg);
    }
});

module.exports = router;