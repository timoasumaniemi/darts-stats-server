const { createNewTrainingMatch, createNewTrainingLeg } = require('../controllers/matchController');
const router = require('express').Router();


/**
 * Create a new 501 training match.
 * Requires: player_id 
 */
router.post('/createNewTrainingMatch', async(req, res) => {
    try{

        // Create a new match
        // ---------------------------
        const playerId = req.body.player_id;
        const matchId = await createNewTrainingMatch(playerId);
        
        console.log("Creating new match for " + playerId);
        res.status(200).json("501 Training Match created, ID: " + matchId);
    }catch(error){
        const msg = error.message;
        console.log(msg);
        res.status(500).json(msg);
    }
});

/**
 * Create a new 501 training leg.
 * Requires: match_id
 */
router.post('/createNewTrainingLeg', async(req, res)=>{
    try{
        const matchId = req.body.match_id;
        const result = await createNewTrainingLeg(matchId);
        console.log("Training leg created, ID: " + result.training_leg_id + " NRO: " + result.leg_number);
        res.status(200).json(`Leg created: Leg number=${result.leg_number}, Leg ID=${result.training_leg_id}`);
    }catch(error){
        const msg = error.message;
        console.log(msg)
        res.status(500).json(msg)
    }
});

module.exports = router;