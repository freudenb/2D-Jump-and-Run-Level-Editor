<?php
//Ordner erstellen mit Timestamp als Namen
//sqlite datei erstellen mit levelnamen als name
//tabellen erstellen
//daten in tabellen eintragen
//echo link auf sqlite datei

$LevelName = $_POST['LevelName'];
$LevelObjekte = json_decode($_POST['LevelObjekte'],true);


$pfad = "./levels/".time().rand(0,100);
mkdir($pfad,0777,true);
$pfad .= "/".$LevelName.".sqlite";
if($db = new SQLite3($pfad)){
	
	$db->exec("CREATE TABLE highscore (time INTEGER NOT NULL , score INTEGER NOT NULL , deaths INTEGER NOT NULL )");
	$db->exec("INSERT INTO 'highscore' VALUES (99999999,0,99)");
	$db->exec("CREATE TABLE 'levelobjekte' ('X' FLOAT NOT NULL , 'Y' FLOAT NOT NULL , 'Width' FLOAT NOT NULL , 'Height' FLOAT NOT NULL , 'ColorR' INTEGER NOT NULL , 'ColorG' INTEGER NOT NULL , 'ColorB' INTEGER NOT NULL , 'PointToX' FLOAT, 'PointToY' FLOAT, 'Typ' VARCHAR NOT NULL , 'Velocity' INTEGER)");

	for($i = 0; $i<count($LevelObjekte);$i++){
		
		$sql = "INSERT INTO 'levelobjekte' VALUES (";
		$sql .= $LevelObjekte[$i]["Rect"]["left"].",";
		$sql .= $LevelObjekte[$i]["Rect"]["top"].",";
		$sql .= $LevelObjekte[$i]["Rect"]["width"].",";
		$sql .= $LevelObjekte[$i]["Rect"]["height"].",";
		$sql .= $LevelObjekte[$i]["ColorR"].",";
		$sql .= $LevelObjekte[$i]["ColorG"].",";
		$sql .= $LevelObjekte[$i]["ColorB"].",";
		$sql .= $LevelObjekte[$i]["pointTo"]["x"].",";
		$sql .= $LevelObjekte[$i]["pointTo"]["y"].",";
		$sql .= "'".$LevelObjekte[$i]["Type"]."',";
		$sql .= $LevelObjekte[$i]["velocity"];
		$sql .= ")";
		$db->exec($sql);
	}
	//Downloadlink
	echo "<button class='menuButton2' type='button' value='Download ".$LevelName."' name='DownloadButton' id='DownloadButton' onclick='location=\"".$pfad."\"'>Download ".$LevelName."</button>";
}
else{
echo "<p style='color:red;'>Level Datei konnte nicht erstellt werden!</p>";
}






?>