<!DOCTYPE html>
<html lang='en'>
	<head>   
		<meta charset='utf-8'> 
		<meta name='description' content='A web service which automatically attaches rich semantic metadata to news, blog posts or the content you submit'>  
		<meta name='keywords' content='osbii, bigdata, metadata, semantics'>
		<meta name='author' content='stalin'>

		<title>OSBII</title>      

		<link href='bootstrap/css/bootstrap.min.css' rel='stylesheet'>    
		<link href='bootstrap/css/docs.css' rel='stylesheet'>
	</head>

	<body>	
		<!--navigation bar-->
		<div class='navbar navbar-fixed-top'>
			<div class='navbar-inner'>
				<div class='container'>
					<ul class='nav'>
						<li><a class='brand' href='./'>OSBII</a></li>
						<li class='divider-vertical'></li>
						<li class='active'><a href='./'><i class='icon-home'></i>&nbsp;Home</a></li>
						<li><a href='./docviewer/'><i class='icon-book'></i>&nbsp;Document Viewer</a></li>
					</ul>
					<!--  add a search form -->
					<form id='search-form' class='navbar-search pull-right' action='search/' method='POST'>
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

		<!--main content-->
		<!--categories section-->
		<div class='container-fluid'><br><br>
			<div class='row-fluid'>
				<div class='span12 text-center'>
					<div class='btn-group' data-toggle='buttons-radio' id='category-buttons'>
						<button class='category-btn btn btn-large' id='26'>Top News</button>
						<button class='category-btn btn btn-large' id='3'>Politics</button>
						<button class='category-btn btn btn-large' id='10'>Products</button>
						<button class='category-btn btn btn-large' id='30'>Technology</button>
						<button class='category-btn btn btn-large' id='16'>Programming</button>
						<button class='category-btn btn btn-large' id='22'>Business</button>
						<button class='category-btn btn btn-large' id='6'>Entertainment</button>
						<button class='category-btn btn btn-large' id='2'>Industry</button>
						<button class='category-btn btn btn-large' id='15'>IT</button>
						<button class='category-btn btn btn-large' id='8'>Science</button>
						<button class='category-btn btn btn-large' id='27'>Sports</button>
					</div>
				</div>
			</div>
		</div>

		<!--display feeds-->
		<div class='container-fluid'><br><br>
			<div class='row-fluid'>
				<!--sidebar-->
				<div class='span4'>
					<!-- progressbar for meta-data table -->
					<div class='progress progress-striped active' id='meta-data-progressbar'>
						<div class='bar' style='width: 70%;'></div>
					</div>
					<!-- meta-data table -->
					<div id='meta-data-table'>
						<!-- table for topics -->
					</div>
				</div>
				
				<!--feeds area-->
				<div class='span8 well'>
					<!-- progress bar -->
					<div class='progress progress-striped active' id='feeds-progressbar'>
						<div class='bar' style='width: 60%;'></div>
					</div>
					<!--process json and insert feeds here-->
					<div id='feeds'>
					
					</div>
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
		<script type="text/javascript" src='bootstrap/js/savearticles.js'></script>
		<script type='text/javascript' src='bootstrap/js/getnews.js'></script>
		<script type='text/javascript'>
			$(document).ready(function(){
				// hide the resultbox progress bar
				$('#progress').hide();
				// load top news by default
				$('#26').click();				
			});
		</script>
		<script type='text/javascript' src='bootstrap/js/bootstrap.min.js'></script>
		<script type='text/javascript' src='bootstrap/js/homejquery.js'></script>
		<script type='text/javascript' src='bootstrap/js/autocomplete.js'></script>		
	</body>
</html>
