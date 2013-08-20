// SHOW INFO BUTTON CLICK HANDLER
$('#search-results').on('click', '.showinfo', function(){
	// change button text to loading
	$(this).button('loading');
	
	// clear the old topic data 
	$('#topics').empty();
	$('#topics').append("<p class='text-left label label-info'>Topics:</p>");
	// clear new social-tag data
	$('#social-tags').empty();
	$('#social-tags').append("<p class='text-left label label-info'>Social Tags:</p>");
	// clear new entities data
	$('#entities').empty();
	$('#entities').append("<p class='text-left label label-info'>Entities:</p>");
	
	// fetch the url of the post from id of this button
	var uniqueId = $(this).attr('id');
	//alert(uniqueId);
	
	// clear the statusField
	$('#statusField'+uniqueId).empty();
	$('#statusField'+uniqueId).removeClass('alert alert-error pull-left');
	$('#statusField'+uniqueId).removeClass('alert alert-success pull-left');
	
	// hide the result box
	$('#resultbox').hide();
	// show the progress bar
	$('#progress').show();
	
	//alert(uniqueId);
	// fetch summary from <p> tag which has id as this uniqueId
	var summary = $('#'+uniqueId).text();
	//alert(summary);
	// make an ajax call to the servlet nad get info
	$.ajax({
		type: 'POST',
		//servlet url
		url: '../getmetadata',
		// parameters 
		data: {content: summary},
		// expected data-type of response
		dataType: 'json',
		// to execute when got the json result
		success: function(jsonResponse){			
			// clear the old topic data 
			$('#topics').empty();
			$('#topics').append("<p class='text-left label label-info'>Topics:</p>");	
			// add new topic data
			$.each(jsonResponse.topics, function(){
				var topicData="<p><span class='text-left'>" + this.categoryName + "</span><span class='pull-right'>" + this.score + "</span></p>";
				$('#topics').append(topicData);
			});
			
			// clear new social-tag data
			$('#social-tags').empty();
			$('#social-tags').append("<p class='text-left label label-info'>Social Tags:</p>");
			// add new social-tag data
			$.each(jsonResponse.socialTags, function(){
				var socialTagData="<p><span class='text-left'>" + this.originalValue + "</span><span class='pull-right'>" + this.importance + "</span></p>";
				$('#social-tags').append(socialTagData);
			});
			
			// clear new entities data
			$('#entities').empty();
			$('#entities').append("<p class='text-left label label-info'>Entities:</p>");
			// add new entities data
			$.each(jsonResponse.entities, function(){
				var entitiesData="<p><span class='text-left'>" + this._type + "</span><span class='pull-right'>" + this.name + "</span></p>";
				$('#entities').append(entitiesData);
			});
			
			//alert('success');
			// write the success status
			$('#statusField'+uniqueId).addClass('alert alert-success pull-left');
			$('#statusField'+uniqueId).append('Success!');
		},
		
		// to execute when error
		error: function(jqXHR, textStatus, errorThrown){
			//alert("error");
			//alert(textStatus);
			//alert(errorThrown);
			// print the error
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
			$('#progress').hide();
			// fade in the results
			$('#resultbox').fadeIn('slow', function(){
				
			});
		}
	});
});