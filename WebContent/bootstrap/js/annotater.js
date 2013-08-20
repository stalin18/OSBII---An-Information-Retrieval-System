function getAnnotations(){
	// get a vie instance
	var vie = new VIE();
	
	// configure the vie instance
    vie.use(new vie.StanbolService({
    	// stanbol url
        url: 'http://dev.iks-project.eu:8081',
        // using default enhancer
        enhancer: { chain: 'default' }	
    }));
    
    // main function to annotate
    $('#annotated-text').annotate({
        vie: vie,
        debug: true,
        continuousChecking: true,
        autoAnalyze: true,
        showTooltip: false,
        decline: function(event, ui){
            console.info('decline event', event, ui);
        },
        select: function(event, ui){
            console.info('select event', event, ui);
        },
        remove: function(event, ui){
            console.info('remove event', event, ui);
        },
        success: function(event, ui){
            console.info('success event', event, ui);

            // hide the main-progressbar
			$('#main-progressbar').hide();
			// fade in the annotated-result div
			$('#annotated-result').fadeIn('slow', function(){
				
			});
        },
        error: function(event, ui){
            console.info('error event', event, ui);
            alert(ui.message);
        }
    });
}