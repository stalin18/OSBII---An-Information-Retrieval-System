function showResults(query){
	// unique id for each article to fetch description on clicking on 'Show Info' button
	var uniqueId=0;
	// send the ajax request to solr and get the results
	$.getJSON('http://localhost:8983/solr/select/?q="' + query + '"&wt=json&json.wrf=?', {
		
	})
		.done(function(searchResult){
			// write the search heading
			$('#search-heading').html('Search Results for: \'' + query +'\'');
			// iterate over each article containing title and description and display it
			$.each(searchResult.response.docs, function(){
				// increment the uniqueId
				uniqueId++;
            	var result=	"<div class='media well'>"+
								"<div class='media-body'>"+
									"<h4 class='media-heading'><a href='"+ this.url +"'>"+ this.title +"</a></h4><br>"+
									"<p id='result"+ uniqueId + "'>"+ this.description +"</p>"+
								"</div><br>"+
								"<div id='statusFieldresult"+ uniqueId +"'>"+
								"</div>"+
								"<button class='showinfo btn pull-right' data-loading-text='loading..' id='result"+ uniqueId +"'>Show Info</button>"+
							"</div>";
				
            	$('#search-results').append(result);
        	});
		})
		.fail(function(jqXHR, textStatus, errorThrown){
			alert('Error: ' + errorThrown);
		})
		.always(function(){
			
		});
}