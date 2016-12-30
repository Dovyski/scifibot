CREATE TABLE `titles` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`type`	INTEGER NOT NULL DEFAULT 1,
	`name`	TEXT NOT NULL,
	`publisher`	TEXT,
	`year`	INTEGER,
	`rated`	TEXT,
	`released`	INTEGER,
	`runtime`	INTEGER,
	`genre`	TEXT,
	`director`	TEXT,
	`plot`	TEXT,
	`teaser`	TEXT,
	`imdb_rating`	REAL,
	`metascore`	INTEGER,
	`rotten_tomatoes`	REAL,
	`trailer`	TEXT,
	`modified`	INTEGER,
	`created`	INTEGER
);

CREATE INDEX modified_idx ON titles (modified);

INSERT into titles (name) VALUES ('Test');
