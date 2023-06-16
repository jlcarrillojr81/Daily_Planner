\c daily_planner;

DROP TABLE IF EXISTS events;
CREATE TABLE events (
    id serial,
    date DATE,
    time TIME,
    activity varchar(50),
    location varchar(50),
    notes text
);