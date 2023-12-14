const { createNewTrainingMatch, createNewTrainingLeg } = require('../controllers/matchController');
const { saveScoreForTrainingThrow } = require('../controllers/throwController');
const router = require('express').Router();


/**
 * Create a new 501 training match.
 * Requires: player_id 
 */
router.post('/createNewTrainingMatch', async (req, res) => {
    try {

        // Create a new match
        // ---------------------------
        const playerId = req.body.player_id;
        const matchId = await createNewTrainingMatch(playerId);

        console.log("Creating new match for " + playerId);
        res.status(200).json("501 Training Match created, ID: " + matchId);
    } catch (error) {
        const msg = error.message;
        console.log(msg);
        res.status(500).json(msg);
    }
});

/**
 * Create a new 501 training leg.
 * Requires: match_id, starting_score
 */
router.post('/createNewTrainingLeg', async (req, res) => {
    try {
        const matchId = req.body.match_id;
        const startingScore = req.body.starting_score;
        const result = await createNewTrainingLeg(matchId, startingScore);
        console.log("Training leg created, ID: " + result.training_leg_id + " NRO: " + result.leg_number);
        res.status(200).json(`Leg created: Leg number=${result.leg_number}, Leg ID=${result.training_leg_id}`);
    } catch (error) {
        const msg = error.message;
        console.log(msg);
        res.status(500).json(msg);
    }
});

/**
 * Saves throw details
 * Requires: leg_id, player_id, [points], checkout_on_dart
 * (if checkout_on_dart is 0, it will be considered as a normal throw. 
 * 1, 2 and 3 values indicates on which dart the checkout was made)
 */
router.post('/saveThrow', async (req, res) => {
    try {
        const type = req.body.match_type;
        //On type 1, separate match throw handling
        if (type == 1) {
            // TBD:
        }
        // On type 2, separate training throw handling
        else if (type == 2) {
            const trainingLegId = req.body.training_leg_id;
            const points = req.body.points;
            const checkoutOnDart = parseInt(req.body.checkout_on_dart);

            await saveScoreForTrainingThrow(trainingLegId, points, checkoutOnDart);
            console.log(`Throw saved, ID=${trainingLegId}, Points= ${points}`);
            res.status(200).json("Throw saved");
        }
        else {
            throw new Error("unknown match type")
        }

    } catch (error) {
        const msg = error.message;
        console.log(msg);
        res.status(500).json(msg);
    }
});

module.exports = router;