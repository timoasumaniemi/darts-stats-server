const dbPool = require('../db_connection/db_connection');

const sqlCmd = {
    CREATE_NEW_501_TRAINING_MATCH: 'INSERT INTO 501_training_matches (player_id, match_date) VALUES (?,NOW())',
    CHECK_PLAYER_EXISTS: 'SELECT EXISTS( SELECT * FROM players WHERE player_id=?) as playerExists',
    GET_LAST_CREATED_MATCH_ID: 'SELECT LAST_INSERT_ID()'
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
            const [result] = await dbPool.execute(sqlCmd.CREATE_NEW_501_TRAINING_MATCH, [playerId]);

            // Retrieve match ID from the result
            matchId = result.insertId;
        }
        else {
            const msg = "No player found with ID: " + playerId;
            await dbConnection.rollback();
            throw new Error(msg);
        }

        await dbConnection.commit();

        return matchId;
    } catch (error) {
        throw error;
    }
}

module.exports = { createNewTrainingMatch };