// function to save the articles in database
function saveArticles(articlesJson){
	// convert JavaScript object to JSON object
	var articlesObject = JSON.stringify(articlesJson);
	
	// send an ajax request using GET
	$.ajax({
		type: 'POST',
		url: 'articlesaver',
		data: {articles: articlesObject},
		dataType: 'text',
		
		// to execute when successfully got response
		success: function(response){
			//alert('All articles saved to database! Response:' + response);
		},
		
		// to execute when error
		error: function(jqXHR, textStatus, errorThrown){
			//alert('Error saving articles: '+ errorThrown);
		},
		
		// execute at last whether success or error
		complete: function(){
			
		}
	});
}