-- Tables
CREATE TABLE Players (
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    player_name VARCHAR(50) NOT NULL,
    UNIQUE(player_name)
);

CREATE TABLE 501_Matches (
    match_id INT PRIMARY KEY AUTO_INCREMENT,
    match_date DATE NOT NULL,
    player1_id INT NOT NULL,
    player2_id INT,
    winner_id INT,
    FOREIGN KEY (player1_id) REFERENCES Players(player_id),
    FOREIGN KEY (player2_id) REFERENCES Players(player_id),
    FOREIGN KEY (winner_id) REFERENCES Players(player_id)
);

CREATE TABLE 501_Legs (
    leg_id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT NOT NULL,
    leg_number INT NOT NULL,
    player1_darts_thrown INT DEFAULT 0,
    player2_darts_thrown INT DEFAULT 0,
    checkout_score INT,
    winner_id INT,
    FOREIGN KEY (match_id) REFERENCES 501_Matches(match_id),
    FOREIGN KEY (winner_id) REFERENCES Players(player_id)
);

CREATE TABLE 501_Training_Matches (
    training_match_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT NOT NULL,
    match_date DATE NOT NULL
);

CREATE TABLE 501_Training_Legs (
    training_leg_id INT PRIMARY KEY AUTO_INCREMENT,
    training_match_id INT NOT NULL,
    leg_number INT NOT NULL,
    player_darts_thrown INT DEFAULT 0,
    checkout_score INT,
    FOREIGN KEY (training_match_id) REFERENCES 501_Training_Matches(training_match_id)
);

CREATE TABLE Throws (
    throw_id INT PRIMARY KEY AUTO_INCREMENT,
    leg_id INT NOT NULL,
    player_id INT NOT NULL,
    dart_number INT NOT NULL,
    hit_point VARCHAR(20) NOT NULL,
    score INT NOT NULL,
    FOREIGN KEY (leg_id) REFERENCES 501_Legs(leg_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
);

CREATE TABLE Training_Throws (
    throw_id INT PRIMARY KEY AUTO_INCREMENT,
    training_leg_id INT NOT NULL,
    player_id INT NOT NULL,
    dart_number INT NOT NULL,
    hit_point VARCHAR(20) NOT NULL,
    score INT NOT NULL,
    FOREIGN KEY (training_leg_id) REFERENCES 501_Training_Legs(training_leg_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id)
);





-- View for Player Statistics
CREATE VIEW PlayerStatistics AS
SELECT 
    p.player_id,
    p.player_name,
    COUNT(DISTINCT m.match_id) AS overall_matches_played,
    COUNT(leg501.leg_id) AS overall_legs_played,
    COUNT(CASE WHEN m.winner_id = p.player_id THEN 1 END) AS matches_won,
    COUNT(CASE WHEN m.winner_id != p.player_id THEN 1 END) AS matches_lost,
    COUNT(CASE WHEN t.score >= 100 THEN 1 END) AS hundred_plus_count,
    COUNT(CASE WHEN t.score >= 170 AND t.score <= 180 THEN 1 END) AS one_seventy_to_one_eighty_count,
    MAX(CASE WHEN t.score = 0 AND t.hit_point LIKE 'Double%' THEN t.score END) AS highest_checkout_score,
    MIN(leg501.leg_number) AS fastest_leg
FROM 
    Players p
LEFT JOIN 
    501_Matches m ON p.player_id IN (m.player1_id, m.player2_id)
LEFT JOIN 
    501_Legs leg501 ON m.match_id = leg501.match_id
LEFT JOIN 
    Throws t ON leg501.leg_id = t.leg_id
GROUP BY 
    p.player_id, p.player_name;
