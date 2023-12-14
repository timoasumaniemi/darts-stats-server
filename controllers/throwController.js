const dbPool = require('../db_connection/db_connection');


const sqlCmd = {
    GET_CURRENT_TRAINING_SCORE_AND_DARTS: "SELECT current_score, player_darts_thrown FROM 501_training_legs WHERE training_leg_id=?",
    SAVE_NEW_TRAINING_SCORE: "UPDATE 501_training_legs SET current_score=?, player_darts_thrown=? WHERE training_leg_id=?",
    SET_TRAINING_CHECKOUT_SCORE: "UPDATE 501_training_legs SET checkout_score=?, player_darts_thrown=?, current_score=0 WHERE training_leg_id=?"
}

async function saveScoreForTrainingThrow(legId, points, checkoutOnDart) {
    try {
        // Get current score
        let pointsMade = 0;
        let currentDartsThrown = 0;
        const [rows] = await dbPool.execute(sqlCmd.GET_CURRENT_TRAINING_SCORE_AND_DARTS, [legId]);

        if (rows.length == 0) {
            throw new Error("No leg found on Leg ID=" + legId);
        }

        const currentScore = rows[0].current_score;
        const currentDarts = rows[0].player_darts_thrown;

        // If current score is 0 it means current leg is already finished
        if (currentScore === 0) {
            throw new Error("Leg already finished! ID= " + legId);
        }

        for (var point of points) {
            pointsMade += parseInt(point);
            currentDartsThrown++;
        }

        // CHECKOUT HANDLING
        // --------------------------------------------
        if (checkoutOnDart != 0) {
            // double check that checkout score is calculated correctly
            if (currentScore - pointsMade != 0) {

                // check if remaining score is possible to checkout (should be more than 1), if busted, leave current score as it is
                let scoreToSave = currentScore;
                if (currentScore - pointsMade >= 2) {
                    scoreToSave -= pointsMade;
                }

                // add thrown darts (busted round adds 3 darts) in to stats and throw error for wrong checkout
                const totalDarts = currentDarts + 3;
                console.log("Darts thrown=" + totalDarts);
                await dbPool.execute(sqlCmd.SAVE_NEW_TRAINING_SCORE, [scoreToSave, totalDarts, legId])
                throw new Error("Checkout not possible, remaining points=" + scoreToSave + " , points made=" + pointsMade);
            }

            const totalDarts = currentDarts + checkoutOnDart;
            console.log("Checkout on " + checkoutOnDart + " dart! Checkout score=" + pointsMade);
            await dbPool.execute(sqlCmd.SET_TRAINING_CHECKOUT_SCORE, [pointsMade, totalDarts, legId]);
        }
        // SCORE THROW HANDLING
        // --------------------------------------------
        else {
            const totalScore = currentScore - pointsMade;

            // double check that total score doesn't go under 0
            if (totalScore <= 0) {
                // add thrown darts (busted round adds 3 darts) in to stats and throw error for busted score
                const totalDarts = currentDarts + 3;
                console.log("Darts thrown=" + totalDarts);
                await dbPool.execute(sqlCmd.SAVE_NEW_TRAINING_SCORE, [currentScore, totalDarts, legId]);
                throw new Error("Busted, remaining points=" + currentScore + " , points made=" + pointsMade);
            }

            const totalDarts = currentDarts + currentDartsThrown;
            console.log("Darts thrown=" + totalDarts);

            console.log("Scored points=" + pointsMade + ", Current score=" + totalScore);
            await dbPool.execute(sqlCmd.SAVE_NEW_TRAINING_SCORE, [totalScore, totalDarts, legId]);
        }
    } catch (error) {
        throw error;
    }
}

module.exports = { saveScoreForTrainingThrow };