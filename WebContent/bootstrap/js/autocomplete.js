// global variable to check if there is any request pending
var running=0;

// typeahead function
$('#search-field').typeahead({
	
    source: function(query, process){
    	// check if any request pending
    	if(running){
    		return;
    	}
    	
    	// set return to 1 to indicate that this request is pending
    	running = 1;
    	
    	// fetch suggestions from solr suggester
        $.getJSON('http://localhost:8983/solr/suggest/?q='+ query.toLowerCase() +'&wt=json&json.wrf=?', {

        })
        	.done(function(response){
	            var suggestions=[];
	            
	            if((response.spellcheck)&&(response.spellcheck.suggestions[1])){
	            	$.each(response.spellcheck.suggestions[1].suggestion, function(){
		                // add the suggestions into the array
		                suggestions.push(this);
		            });
	            }   
	            
	            // add the suggestions array to display in typeahead
	            process(suggestions);
	        })
	        
	        .fail(function(jqXHR, textStatus, errorThrown){
				//alert('Error: ' + errorThrown);
			})
			.always(function(){
				// request completed, so set running to false
				running = 0;
			});
    },
    
    // sort the suggestions
	sort: function(items){
		return items.sort();
	},
	
	// submit the form when a suggestion is selected
	updater: function(item){
		// alert(item);
		$('#search-field').val(item);
		$('#search-form').submit();
		return item;
	}
});