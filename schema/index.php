<?php
$string = file_get_contents("entidades.json");
$schemas=json_decode($string,true);
?>
<!DOCTYPE HTML>
<html>
<head>
<title>
RDFa - Schema 
</title>
	<link rel="stylesheet" href="../libs/bootstrap/css/bootstrap.min.css" media="all" />
	<link rel="stylesheet" href="index.css" media="all" />
	<script type="text/javascript" src="../libs/jstree/_lib/jquery.js"></script>
	<script type="text/javascript" src="../libs/jstree/_lib/jquery.hotkeys.js"></script>
	<script type="text/javascript" src="../libs/jstree/jquery.jstree.js"></script>
</head>
<body>
<div class="page-header" id="page_header">
	<h2>
		Selecciona el schema
	</h2>
</div>
<div id="area2">
	<input id="schema_search" type="text" class="input span5 search-query" placeholder="Search">
	<div id="schema_types">
		<ul>
			<li id="root">
				<a href="http://schema.org">Schemas</a>
			</li>
		</ul>
	</div>
</div>
<script type="text/javascript">
$(function () {
	$('#area2').css('width','500px');
	$("#schema_types")
		.jstree({
			"themes" : {"icons" : false},
			"plugins" : ["themes","html_data","ui","crrm","hotkeys","checkbox"],
			"core" : { "initially_open" : [ "schema_root" ] }		
		}).bind("loaded.jstree", function (event, data) {			
		}).bind("select_node.jstree", function (e, data) {
		    var href = data.rslt.obj.children("a").attr("href");
		    window.open(href);
		  });
	$("#schema_search").keyup(function(event){		
		if(event.keyCode == 13){ 
			handleSearch($("#schema_search").val().trim());
		}		
		var k=$("#schema_search").val().trim();
		setTimeout(function() {
			handleSearch($("#schema_search").val().trim());
		}, 300);
	});	
});
</script>
</body>
</html>
