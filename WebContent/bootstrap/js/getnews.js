// function to load news of given category
function getTopNews(newsId){
	// for assigning uniqueId to each feed
	var uniqueId=0;
	// delete news of previous category
	$('#feeds').empty();
	// show the feeds progressbar
	$('#feeds-progressbar').show();

	// send an ajax request using GET
	$.ajax({
		url: 'http://api.feedzilla.com/v1/categories/'+newsId+'/articles.json',
		type: 'GET',
		dataType: 'json',
		
		// to execute when successfully got json response
		success: function(response){
			//delete old feeds
			$('#feeds').empty(); 
			// hide the feeds-progressbar
			$('#feeds-progressbar').hide();
			
			// iterate over each article and fetch its details and display it
			$.each(response.articles, function(){
				// uniqueId for each feed
				uniqueId++;
            	var feed=	"<div class='media well'>"+
								"<div class='media-body'>"+
									"<h4 class='media-heading' id='title'" + uniqueId + ">"+ this.title +"</h4>"+
									"<h6>"+ this.publish_date +"</h6>"+
									"<p id='feed"+ uniqueId +"' >"+ this.summary +"</p>"+
									"<a href='"+ this.url +"' target='_blank'>Continue Reading</a>"+
								"</div><br><br>"+
								"<div id='statusFieldfeed"+ uniqueId +"'>"+
								"</div>"+
								"<button class='showinfo btn pull-right' data-loading-text='loading..' id='feed"+ uniqueId +"'>Show Info</button>"+
							"</div>";
				
            	$('#feeds').append(feed); 
            	
            	// update meta-data-table for article 1
            	if(uniqueId==1){
            		metaDataFiller(this);
            	}
        	});
			
			// call save articles script to save articles into database
			saveArticles(response);
		},
		
		// to execute when error
		error: function(jqXHR, textStatus, errorThrown){
			alert("There is some error.. Please try reloading the page!");
			$('#feeds').empty();
		},
		
		// execute at last whether success or error
		complete: function(){
			$('#feed1').click();
		}
	});
}