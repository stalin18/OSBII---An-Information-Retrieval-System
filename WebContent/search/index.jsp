<!DOCTYPE html>
<html lang='en'>
	<head>   
		<meta charset='utf-8'>
		<meta name='description' content='A web service which automatically attaches rich semantic metadata to news, blog posts or the content you submit'>  
		<meta name='keywords' content='osbii, bigdata, metadata, semantics'>
		<meta name='author' content='stalin'>

		<title>Search Results|OSBII</title>      

		<link href='../bootstrap/css/bootstrap.min.css' rel='stylesheet'>    
		<link href='../bootstrap/css/docs.css' rel='stylesheet'>
	</head>
	
	<body>	
		<!--navigation bar-->
		<div class='navbar navbar-fixed-top'>
			<div class='navbar-inner'>
				<div class='container'>
					<ul class='nav'>
						<li><a class='brand' href='../'>OSBII</a></li>
						<li class='divider-vertical'></li>
						<li class='active'><a href='../'><i class='icon-home'></i>&nbsp;Home</a></li>
						<li><a href='../docviewer/'><i class='icon-book'></i>&nbsp;Document Viewer</a></li>
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
			<div class='container'>
				<h1 class='text-center'>OSBII</h1>
				<p class='text-center'> A web service which automatically attaches rich semantic metadata to news, blog posts or any content you submit.</p>
			</div>			
		</header>		
	
		<!-- main content -->
		<!-- search heading with term -->
		<div class='container-fluid'><br><br>
			<div class='row-fluid'>
				<div class='span12 well text-center'>
					<h2 id='search-heading'></h2>
				</div>
			</div>
		</div>
		
		<!-- search body with results -->
		<div class='container-fluid'><br>
			<div class='row-fluid'>
				<!-- sidebar -->
				<div class='span4'>
					<div class='container-fluid'>
						<fieldset>
							<legend class='text-center'>Metadata:</legend>
							<div class="progress progress-striped active" id='progress'>
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
										<p class='text-left label label-info'>Social Tags:</p>
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
				<!-- results area -->
				<div class='span8' id='search-results'>
					<!-- process json and insert search results here -->
				</div>
			</div>
		</div>
		
		<!--footer-->
		<footer class='footer'>
			<div class='container'>
				<p>&copy; OSBII 2013</p>
			</div>
		</footer>

		<!--include all scripts at last to improve response time-->
		<script src='//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js'></script>
		<script type='text/javascript' src='../bootstrap/js/getsearchresults.js'></script>
		<script type='text/javascript'>
			$(document).ready(function(){
				// hide the resultbox progress bar
				$('#progress').hide();
				
				// fetch the serch query from the form query-box
				var query = '<%=request.getParameter("query-box") %>';
				
				// call the search results fetcher
				showResults(query);
			});
		</script>
		<script type='text/javascript' src='../bootstrap/js/bootstrap.min.js'></script>
		<script type='text/javascript' src='../bootstrap/js/searchjquery.js'></script>
		<script type='text/javascript' src='../bootstrap/js/autocomplete.js'></script>
	</body>
</html>