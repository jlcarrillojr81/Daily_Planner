\c daily_planner;

DROP TABLE IF EXISTS events;
CREATE TABLE events (
    id serial,
    time VARCHAR,
    activity varchar(50),
    location varchar(50),
    notes text
);

INSERT INTO events (time, activity, location, notes) VALUES ('0300', 'Wake Up', 'Home', 'Get ready');
INSERT INTO events (time, activity, location, notes) VALUES ('0400', 'Start Class', 'Office', 'Get ready to learn');
