CREATE TABLE `titles` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`type`	INTEGER NOT NULL DEFAULT 1,
	`name`	TEXT NOT NULL,
	`publisher`	TEXT,
	`year`	INTEGER,
	`released`	INTEGER,
	`runtime`	INTEGER,
	`plot`	TEXT,
	`plot_source_name`	TEXT,
	`plot_source_url`	TEXT,
	`teaser`	TEXT,
	`imdb_rating`	REAL,
	`imdb_url`	TEXT,
	`metascore_rating`	INTEGER,
	`metascore_url`	TEXT,
	`rotten_tomatoes_rating`	REAL,
	`rotten_tomatoes_url`	TEXT,
	`trailer`	TEXT,
	`modified`	INTEGER,
	`created`	INTEGER,
	`active`	INTEGER DEFAULT 0
);

CREATE INDEX modified_idx ON titles (modified);
CREATE INDEX active_idx ON titles (active);

INSERT into titles (name, type) VALUES ('Test', 1);
