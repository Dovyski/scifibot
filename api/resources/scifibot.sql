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

INSERT INTO `titles` (id,type,name,publisher,year,released,runtime,plot,plot_source_name,plot_source_url,teaser,imdb_rating,imdb_url,metascore_rating,metascore_url,rotten_tomatoes_rating,rotten_tomatoes_url,trailer,modified,created,active) VALUES (1,1,'Terminator 2: Judgment Day','TriStar Pictures',1991,'',137,'A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her ten year old son, John Connor, from a more advanced cyborg.','','','https://images-na.ssl-images-amazon.com/images/M/MV5BMGU2NzRmZjUtOGUxYS00ZjdjLWEwZWItY2NlM2JhNjkxNTFmXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',8.5,'http://www.imdb.com/title/tt0103064/',75,'http://www.metacritic.com/movie/terminator-2-judgment-day',93.0,'https://www.rottentomatoes.com/m/terminator_2_judgment_day/','https://www.youtube.com/watch?v=-W8CegO_Ixw',1499540201,1499540201,1);
