<!DOCTYPE html>
<html lang='en'>
	<head>
		<meta charset='utf-8'>
		<meta name='description' content='Attaches rich semantic data to the submitted content'>
		<meta name='keywords' content='osbii, bigdata, metadata, semantics'>
		<meta name='author' content='stalin'>

		<title>OSBII Document Viewer</title>

		<link rel='stylesheet' type='text/css' href='../bootstrap/css/bootstrap.min.css'>
		<link rel='stylesheet' type='text/css' href='../bootstrap/css/docs.css'>
		
		<!-- stylesheets for annotation go here -->
		<link rel='stylesheet' href='../bootstrap/css/jquery-ui.min.css'>
	    <link rel='stylesheet' href='../bootstrap/css/jquery.ui.all.css'>
	    <link rel='stylesheet' href='../bootstrap/css/annotate.css'>  
	</head>

	<body xmlns:sioc     = "http://rdfs.org/sioc/ns#"
          xmlns:skos     = "http://www.w3.org/2004/02/skos/core#"
          xmlns:schema   = "http://schema.org/">
		
		<!--navigation bar-->
		<div class='navbar navbar-fixed-top'>
			<div class='navbar-inner'>
				<div class='container'>
					<ul class='nav'>
						<li><a class='brand' href='../'>OSBII</a></li>
						<li class='divider-vertical'></li>
						<li><a href='../'><i class='icon-home'></i>&nbsp;Home</a></li>
						<li class='active'><a href='./'><i class='icon-book'></i>&nbsp;Document Viewer</a></li>
					</ul>
					<!--  add a search form -->
					<form id='search-form' class='navbar-search pull-right' action='../search/' method='POST'>
						<input name='query-box' type='text' class='search-query' id='search-field' placeholder='Search' autocomplete='off' data-provide='typeahead'>
					</form>
				</div>
			</div>
		</div>

		<!--header-->
		<header class='jumbotron subhead'>
			<div class='container-fluid'>
				<h2>Document Viewer</h2>
				<p>Attach rich semantic data to your content.</p>
			</div>
		</header>

		<!--main content-->
		<div class='container-fluid'><br><br>
			<!-- row to display new content button -->
			<div class='row-fluid'>
				<button type='button' class='newcontent btn btn-info' id='newcontent'>New Content</button><br><br>
			</div>
			<!-- row containing sidebar and docviewerform -->
			<div class='row-fluid'>
				<!--sidebar-->
				<div class='span4'>
					<div class='container-fluid well'>
					    <fieldset>
					   		<legend class='text-center'>Metadata:</legend>
					   		<!-- progressbar for metadata -->
					    	<div class="progress progress-striped active" id='meta-data-progressbar'>
					   			<div class="bar" style="width: 60%;"></div>
					    	</div>
							<div id='resultbox'>
								<div class='row-fluid'>
									<div class='span12 well' id='topics'>
									<p class='text-left label label-info'>Topics:</p>								
										<!--add topics here-->
									</div>
								</div>
								<div class='row-fluid'>
									<div class='span12 well' id='social-tags'>	
									<p class='text-left label label-info'>Social Tags (with Importance):</p>							
										<!--add social tags here-->
									</div>
								</div>
								<div class='row-fluid'>
									<div class='span12 well' id='entities'>
										<p class='text-left label label-info'>Entities:</p>
										<!-- add entities here-->
									</div>
								</div>
							</div>
					    </fieldset>
					</div>
				</div>
				<!-- main docviewer area -->
				<div class='span8 well'>
					<!-- progressbar for main -->
			    	<div class="progress progress-striped active" id='main-progressbar'>
			   			<div class="bar" style="width: 60%;"></div>
			    	</div>
					<!-- div to show the annotated text -->
					<div id='annotated-result'>
						<fieldset>
							<legend>Annotated text:</legend>
							<div id='statusDiv1'>
							</div>
							<div id='annotated-text'>
							</div>
							<br>
							<button id='back-button' type='button' class='btn btn-primary' data-loading-text='loading..'>Back to Original Text</button>							
							<button id='choose-best-button' type='button' class='btn btn-primary' data-loading-text='loading..'>Select Best</button>
						</fieldset>
					</div>
					<!-- div containing form to accept text -->
					<div>
						<form id='docviewerform'>
							<fieldset>
								<legend>Enter your text here:</legend>
								<div id='statusDiv2'>
								</div>
								<textarea id='contentbox' name='contentbox' class='span12' rows='10'></textarea><br>
								<button id='submit' type='button' class='btn btn-primary' data-loading-text='loading..'>Submit</button>							
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		</div>		

		<!--footer-->
		<footer class='footer'>
			<div class='container-fluid'>
				<p>&copy; OSBII 2013</p>
			</div>
		</footer>

		<!--include all scripts at last to improve response time-->
		<script src='//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js'></script>
		<script type="text/javascript">
			$(document).ready(function(){
				// hide meta-data-progressbar and main-progressbar 
				$('#meta-data-progressbar').hide();
				$('#main-progressbar').hide();
				
				// hide the annotated-result div
				$('#annotated-result').hide();
			});
		</script>
		<script type='text/javascript' src='http://code.jquery.com/ui/1.10.3/jquery-ui.js'></script>
		<script type='text/javascript' src='../bootstrap/js/bootstrap.min.js'></script>
		<script type='text/javascript' src='../bootstrap/js/autocomplete.js'></script>	
		
		<!-- scripts for annotation go here -->
	    <script type='text/javascript' src='../bootstrap/js/underscore-min.js'></script>
	    <script type='text/javascript' src='../bootstrap/js/backbone.min.js'></script>	
	    <script type='text/javascript' src='../bootstrap/js/jquery.rdfquery.debug.js'></script>
	    <script type='text/javascript' src='../bootstrap/js/vie.js'></script>
	    <script type='text/javascript' src='../bootstrap/js/vie.entitypreview.js'></script>
	    <script type='text/javascript' src='../bootstrap/js/annotate.js'></script>
	    
	    <!-- manual script for annotation -->
	    <script type='text/javascript' src='../bootstrap/js/annotater.js'></script>
	    
	    <!-- main js for this file to be loaded after other js because it uses functions defined in other js -->
	    <script type='text/javascript' src='../bootstrap/js/docviewerjquery.js'></script>
	</body>
</html>