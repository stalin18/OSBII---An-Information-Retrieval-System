// CATEGORIES BUTTON CLICK HANDLER
$('.category-btn').click(function(){
	var id = $(this).attr('id');
	getTopNews(id);
});

// SHOW INFO BUTTON CLICK HANDLER
$('#feeds').on('click', '.showinfo', function(){
	// change button text to loading
	$(this).button('loading');
	// empty meta-data-table div
	$('#meta-data-table').empty();
	// hide the meta-data-table
	$('#meta-data-table').hide();
	// show meta-data-progressbar
	$('#meta-data-progressbar').show();
	// clear the statusField
	$('#statusField'+uniqueId).empty();
	$('#statusField'+uniqueId).removeClass('alert alert-error pull-left');
	$('#statusField'+uniqueId).removeClass('alert alert-success pull-left');
	
	// fetch the uniqueId of this article
	var uniqueId = $(this).attr('id');
	//alert(uniqueId);

	// set titleId
	var titleId = 'title' + uniqueId;
	// fetch title
	var title = $('#'+titleId).text();
	alert(title);
	
	// fetch summary which has id as this uniqueId
	var summary = $('#'+uniqueId).text();	
	//alert(summary);
	
	// make an ajax call to the servlet and get the info
	$.ajax({
		type: 'POST',
		//servlet url
		url: 'getmetadata',
		// parameters 
		data: {content: summary},
		// expected data-type of response
		dataType: 'json',
		// to execute when got the json result
		success: function(jsonResponse){		
			// add title of article to meta-data-table
			//$('#meta-data-table').append(title.substring(0, 10) + '...');
			
			// add new topic data
			var topicTable = "<table class='table table-striped table-hover table-bordered'>" +
								"<caption>TOPICS FOUND:</caption>" +
								"<thead>" +
									"<tr>" +
										"<th>Topic</th>" +
										"<th>Score</th>" +
									"</tr>" +
								"</thead>" +
								"<tbody>";
			
			// variable to check if there is any topic
			var count = 0;
			$.each(jsonResponse.topics, function(){
				 count++;
				 
				 // create the topic-table
				 topicTable = topicTable + 
								"<tr class='info'>"+
									"<td>" + this.categoryName + "</td>"+
									"<td>" + this.score + "</td>"+
								"</tr>";							
			});
			// check if atleast one topic is present
			if(count){
				topicTable = topicTable + "</tbody>" +
										"</table>";
				
				// now append this table to meta-data-table div
				$('#meta-data-table').append(topicTable);
			}
			
			// add new socialtag data
			var socialTagTable = "<table class='table table-striped table-hover table-bordered'>" +
								"<caption>SOCIAL TAGS FOUND:</caption>" +
								"<thead>" +
									"<tr>" +
										"<th>Tag</th>" +
										"<th>Importance</th>" +
									"</tr>" +
								"</thead>" +
								"<tbody>";
			
			// variable to check if there is any social-tag
			var count = 0;
			$.each(jsonResponse.socialTags, function(){
				 count++;
				 
				 // create the social-tag-table
				 socialTagTable = socialTagTable + 
								"<tr class='info'>"+
									"<td>" + this.originalValue + "</td>"+
									"<td>" + this.importance + "</td>"+
								"</tr>";							
			});
			// check if atleast one social-tag is present
			if(count){
				socialTagTable = socialTagTable + "</tbody>" +
										"</table>";
				
				// now append this table to meta-data-table div
				$('#meta-data-table').append(socialTagTable);
			}
			
			// add new entities data
			var entitiesTable = "<table class='table table-striped table-hover table-bordered'>" +
								"<caption>ENTITIES FOUND:</caption>" +
								"<thead>" +
									"<tr>" +
										"<th>Type</th>" +
										"<th>Name</th>" +
									"</tr>" +
								"</thead>" +
								"<tbody>";
			
			// variable to check if there is any topic
			var count = 0;
			$.each(jsonResponse.entities, function(){
				 count++;
				 
				 // create the topic-table
				 entitiesTable = entitiesTable + 
								"<tr class='info'>"+
									"<td>" + this._type + "</td>"+
									"<td>" + this.name + "</td>"+
								"</tr>";							
			});
			// check if atleast one topic is present
			if(count){
				entitiesTable = entitiesTable + "</tbody>" +
										"</table>";
				
				// now append this table to meta-data-table div
				$('#meta-data-table').append(entitiesTable);
			}
			
			// write the success status
			$('#statusField'+uniqueId).addClass('alert alert-success pull-left');
			$('#statusField'+uniqueId).append('Success!');
		},
		
		// to execute when error
		error: function(jqXHR, textStatus, errorThrown){
			// clean the meta-data-table and write error
			$('#meta-data-table').empty();
			$('#meta-data-table').html("<h3 class='text-center'>There is an error!</h3>");	
			// write the error message
			$('#statusField'+uniqueId).addClass('alert alert-error pull-left');
			// check if error thrown is 'Internal Server Error', then report request timed out!
			if(errorThrown=='Internal Server Error'){
				$('#statusField'+uniqueId).append('Request Timed-Out! Try Again!');
			} else{
				$('#statusField'+uniqueId).append('Error: '+ errorThrown);
			}		
		},
		
		// always executed at last whether success or error
		complete: function(){
			// bring back submit button to its original state
			$('.showinfo').button('reset');
			// hide the progress bar
			$('#meta-data-progressbar').hide();
			// fade in the results
			$('#meta-data-table').fadeIn('slow', function(){
				
			});
		}
	});
});

// META DATA TABLE FILLER
function metaDataFiller(article){
	// fetch the article title and summary
	var title = article.title; //alert(title);
	var summary = article.summary;
	
	// hide the meta-data-table
	$('meta-data-table').hide();
	// show the meta-data-progressbar
	$('#meta-data-progressbar').show();
	
	// make an ajax call to CalaisCaller and fetch meta-data
	// make an ajax call to the servlet and get the info
	$.ajax({
		type: 'POST',
		//servlet url
		url: 'getmetadata',
		// parameters 
		data: {content: summary},
		// expected data-type of response
		dataType: 'json',
		// to execute when got the json result
		success: function(jsonResponse){
			// add title of article to meta-data-table
			//$('#meta-data-table').append("<h4>Metadata for: ' + title.substring(1, 10) + '</h4>");
			
			// add new topic data
			var topicTable = "<table class='table table-striped table-hover table-bordered'>" +
								"<caption>TOPICS FOUND:</caption>" +
								"<thead>" +
									"<tr>" +
										"<th>Topic</th>" +
										"<th>Score</th>" +
									"</tr>" +
								"</thead>" +
								"<tbody>";
			
			// variable to check if there is any topic
			var count = 0;
			$.each(jsonResponse.topics, function(){
				 count++;
				 
				 // create the topic-table
				 topicTable = topicTable + 
								"<tr class='info'>"+
									"<td>" + this.categoryName + "</td>"+
									"<td>" + this.score + "</td>"+
								"</tr>";							
			});
			// check if atleast one topic is present
			if(count){
				topicTable = topicTable + "</tbody>" +
										"</table>";
				
				// now append this table to meta-data-table div
				$('#meta-data-table').append(topicTable);
			}
			
			// add new socialtag data
			var socialTagTable = "<table class='table table-striped table-hover table-bordered'>" +
								"<caption>SOCIAL TAGS FOUND:</caption>" +
								"<thead>" +
									"<tr>" +
										"<th>Tag</th>" +
										"<th>Importance</th>" +
									"</tr>" +
								"</thead>" +
								"<tbody>";
			
			// variable to check if there is any social-tag
			var count = 0;
			$.each(jsonResponse.socialTags, function(){
				 count++;
				 
				 // create the social-tag-table
				 socialTagTable = socialTagTable + 
								"<tr class='info'>"+
									"<td>" + this.originalValue + "</td>"+
									"<td>" + this.importance + "</td>"+
								"</tr>";							
			});
			// check if atleast one social-tag is present
			if(count){
				socialTagTable = socialTagTable + "</tbody>" +
										"</table>";
				
				// now append this table to meta-data-table div
				$('#meta-data-table').append(socialTagTable);
			}
			
			// add new entities data
			var entitiesTable = "<table class='table table-striped table-hover table-bordered'>" +
								"<caption>ENTITIES FOUND:</caption>" +
								"<thead>" +
									"<tr>" +
										"<th>Type</th>" +
										"<th>Name</th>" +
									"</tr>" +
								"</thead>" +
								"<tbody>";
			
			// variable to check if there is any topic
			var count = 0;
			$.each(jsonResponse.entities, function(){
				 count++;
				 
				 // create the topic-table
				 entitiesTable = entitiesTable + 
								"<tr class='info'>"+
									"<td>" + this._type + "</td>"+
									"<td>" + this.name + "</td>"+
								"</tr>";							
			});
			// check if atleast one topic is present
			if(count){
				entitiesTable = entitiesTable + "</tbody>" +
										"</table>";
				
				// now append this table to meta-data-table div
				$('#meta-data-table').append(entitiesTable);
			}
		},
		
		// to execute when error
		error: function(jqXHR, textStatus, errorThrown){
			// clean and print error
			$('#meta-data-table').empty();
			$('#meta-data-table').html("<h3 class='text-center'>There is an error!</h3>");	
		},
		
		complete: function(){
			// hide the meta-data-progressbar
			$('#meta-data-progressbar').hide();
			// show the meta-data-table
			$('#meta-data-table').fadeIn('slow', function(){
				
			});
		}
	});
}