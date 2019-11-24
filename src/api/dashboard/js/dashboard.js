var SD = new function() {
    this.fillEntryFromJSONText = function(theJSONText) {
        if(theJSONText == '') {
            return;
        }

        var aData = JSON.parse(theJSONText);
        var aUpdate = {
            name: aData.Title,
            publisher: aData.Production,
            year: aData.Year,
            released: aData.Released,
            runtime: aData.Runtime.split(' ')[0],
            teaser: aData.Poster,
            plot_source_url: 'http://www.imdb.com/title/' + aData.imdbID,
            plot_source_name: 'IMDb',
            imdb_rating: aData.imdbRating,
            imdb_url: 'http://www.imdb.com/title/' + aData.imdbID,
            metascore_rating: aData.Metascore
        }

        console.debug(aData);

        for(var aName in aUpdate) {
            $('input[name=' + aName + ']').val(aUpdate[aName]);
            console.debug('Set ' + aName + ': ' + aUpdate[aName]);
        }

        $('textarea[name=plot]').val(aData.Plot);
        SD.refreshTeaserImage();
    };

    this.refreshTeaserImage = function() {
        var aURL = $('input[name=teaser]').val();
        $('#teaser_image').attr('src', aURL);

        console.debug('Teaser IMG element refreshed:', aURL);
    };

    this.initEntryPage = function() {
        $('#json_source').on('change', function(theEvent) {
            SD.fillEntryFromJSONText($(this).val());
        });

        $('input[name=teaser]').change(function() {
            SD.refreshTeaserImage();
        });

        $('#json_tools').click(function() {
            $('#tools').slideToggle();
        });
    };
}
