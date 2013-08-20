// DOCVIEWER FORM SUBMISSION HANDLER
$('#submit').click(function(){
	
	// get the content from textarea
	var contentvalue=$('#contentbox').val();
	
	if(!$.trim(contentvalue)){
		// do nothing if nothing is entered into the textbox
	}
	else{
		
		// hide the form
		$('#docviewerform').hide();
		// hide the result box
		$('#resultbox').hide();		
		// show the main-progressbar
		$('#main-progressbar').show();
		// show the progress bar
		$('#meta-data-progressbar').show();
		
		// get the text from textarea and put it in annotated-text div to annotate it
		var text = $('#contentbox').val();
		
		// add new text
		$('#annotated-text').append(text);
		// now finally call the getAnnotations method to annotate
		getAnnotations();

		// remove any previous status, if any
		$('#statusDiv2').removeClass('alert alert-error');
		$('#statusDiv2').removeClass('alert alert-success');
		$('#statusDiv2').empty();

		// make an ajax call to servlet for json response
		$.ajax({
			type: 'POST',
			// servlet url
			url: '../getmetadata',
			// parameters and their values to pass
			data: {content: contentvalue},
			// expected data type of response
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
				$('#social-tags').append("<p class='text-left label label-info'>Social Tags (with Importance):</p>");
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
				
				// write the success status
				//$('#statusDiv2').addClass('alert alert-success');
				//$('#statusDiv2').append('Success!');
			},
			
			// to execute when error
			error: function(jqXHR, textStatus, errorThrown){
				//alert("Server error! Try again later!");
				// write the error status
				//$('#statusDiv2').addClass('alert alert-error');
				// check if error thrown is 'Internal Server Error', then report request timed out!
				if(errorThrown=='Internal Server Error'){
					//$('#statusDiv2').append('Request Timed-Out! Try Again!');
				} else{
					//$('#statusDiv2').append('Error: '+ errorThrown);
				}
			},
			
			// always executed at last whether success or error
			complete: function(){
				// bring back submit button to its original state
				//$('#submit').button('reset');
		
				// hide the progress bar
				$('#meta-data-progressbar').hide();
				// fade in resultbox
				$('#resultbox').fadeIn('slow', function(){
					
				});
			}
		});
	}
});

// BACK BUTTON CLICK HANDLER
$('#back-button').click(function(){
	// finally hide the annotated result div
	$('#annotated-result').hide();
	
	// destroy the annotations
	$('#annotated-text').annotate('destroy');
	// clear any previous content from annotated-text div
	$('#annotated-text').empty();
	
	// show the docviewerform again with original text
	$('#docviewerform').show();
});

// CHOOSE BEST BUTTON CLICK HANDLER
$('#choose-best-button').click(function(){
	$('#annotated-text').each(function(){
	        $(this).annotate('acceptAll', function(report){
	            console.log('AcceptAll finished with the report:', report);
	        });
	});
});

// NEW CONTENT BUTTON CLICK HANDLER
$('.newcontent').on('click', function(){
	// clear the old topic data 
	$('#topics').empty();
	$('#topics').append("<p class='text-left label label-info'>Topics:</p>");
	// clear new social-tag data
	$('#social-tags').empty();
	$('#social-tags').append("<p class='text-left label label-info'>Social Tags:</p>");
	// clear new entities data
	$('#entities').empty();
	$('#entities').append("<p class='text-left label label-info'>Entities:</p>");
	
	// remove any previous status, if any
	$('#statusDiv2').removeClass('alert alert-error');
	$('#statusDiv2').removeClass('alert alert-success');
	$('#statusDiv2').empty();
	
	// empty the textarea
	$('#contentbox').val('');
	
	// destroy the annotations
	$('#annotated-text').annotate('destroy');
	// clear any previous content from annotated-text div
	$('#annotated-text').empty();
	
	// hide the annotation-result div and show the docviewerform div back
	$('#annotated-result').hide();
	$('#docviewerform').fadeIn('slow', function(){
		
	});
});
