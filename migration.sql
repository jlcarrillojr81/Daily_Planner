\c daily_planner;

DROP TABLE IF EXISTS events;
CREATE TABLE events (
    id serial,
    date_column DATE,
    time_column TIME,
    activity varchar(50),
    location varchar(50),
    notes text
);