<?php 
$string = file_get_contents("entidades.json");
$schemas=json_decode($string,true);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Colores para las entidades</title>
	<link rel="stylesheet" href="coloresSchema.css" type="text/css"/>
	<link rel="stylesheet" href="../css/rdfa.css" type="text/css"/>
	<script type="text/javascript" src="../libs/jstree/_lib/jquery.min.js"></script>
</head>
<body>
<table cellspacing="1" cellpadding="2" align="center"></table>
<script>
function rgb2hex(rgb){
	 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	 return "#" +
	  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
	}
</script>
</body>
</html>
