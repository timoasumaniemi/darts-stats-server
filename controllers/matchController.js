const dbPool = require('../db_connection/db_connection');

const sqlCmd = {
    CREATE_NEW_501_TRAINING_MATCH: 'INSERT INTO 501_training_matches (player_id, match_date) VALUES (?,NOW())',
    CHECK_PLAYER_EXISTS: 'SELECT EXISTS( SELECT * FROM players WHERE player_id=?) as playerExists',
    CHECK_501_TRAINING_MATCH_EXISTS: 'SELECT EXISTS( SELECT training_match_id FROM 501_training_matches WHERE training_match_id=?) as matchExists',
    GET_LAST_TRAINING_LEG_NRO: 'SELECT leg_number FROM 501_training_legs WHERE training_match_id=?',
    CREATE_NEW_TRAINING_LEG: 'INSERT INTO 501_training_legs (training_match_id, leg_number, current_score) VALUES(?,?,?)'
}

/**
 * Creates new 501 training match
 */
async function createNewTrainingMatch(playerId) {
    let dbConnection;

    try {
        let matchId;

        dbConnection = await dbPool.getConnection();
        const [result] = await dbConnection.execute(sqlCmd.CHECK_PLAYER_EXISTS, [playerId])

        // 'playerExists' has value 1 if player exists, 0 if not
        if (result[0].playerExists == 1) {
            await dbConnection.beginTransaction();
            const [result] = await dbConnection.execute(sqlCmd.CREATE_NEW_501_TRAINING_MATCH, [playerId]);

            // Retrieve match ID from the result
            matchId = result.insertId;
        }
        else {
            const msg = "No player found with ID: " + playerId;
            throw new Error(msg);
        }

        await dbConnection.commit();

        return matchId;
    } catch (error) {
        await dbConnection.rollback();
        throw error;
    }
}

/**
 * Creates a new leg for 501 training match.
 * Requires: matchId
 */
async function createNewTrainingLeg(matchId, startingScore) {
    let dbConnection;
    try {
        dbConnection = await dbPool.getConnection();

        // Check that match id exist's
        const [matchExistsResult] = await dbConnection.execute(sqlCmd.CHECK_501_TRAINING_MATCH_EXISTS, [matchId]);
        if (matchExistsResult[0].matchExists == 1) {
            await dbConnection.beginTransaction();
            let legNumber = 0

            // Get last leg number
            const [legNumberResult] = await dbConnection.execute(sqlCmd.GET_LAST_TRAINING_LEG_NRO, [matchId]);

            if (legNumberResult.length > 0) {

                legNumber = legNumberResult[0].leg_number + 1
            }

            // Create a new leg
            const [newLegResult] = await dbConnection.execute(sqlCmd.CREATE_NEW_TRAINING_LEG, [matchId, legNumber, startingScore]);

            // Retrieve training leg ID from the result
            trainingLegId = newLegResult.insertId;

            await dbConnection.commit();
            return { training_leg_id: trainingLegId, leg_number: legNumber };
        }
        else {
            const msg = "No match found with ID: " + matchId;
            throw new Error(msg);
        }
    } catch (error) {
        await dbConnection.rollback();
        throw error;
    }
}


module.exports = { createNewTrainingMatch, createNewTrainingLeg };