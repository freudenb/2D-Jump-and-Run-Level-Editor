//Objekt zum uebertragen der Leveldaten zum Server per XMLHTTPREQUEST objekt
function SaveLevel(){

	var Request =  new XMLHttpRequest();
	var PhpFile = "SaveLevel.php";
	var loadingImg = new Image();
	loadingImg.src="./img/loading.gif";
	loadingImg.onload = function(){};
	//Methode die den Download Button bei fertigstellung der SQLite Datei erstellt 
	//Ansonsten Loading.gif anzeigen
	this.getDownloadLinkFromServer = function(){
	
		if(Request.readyState == 4 && Request.status==200){
			
			document.getElementById("DownloadLinkDiv").innerHTML = Request.responseText;
		
		}
		else{
			
			document.getElementById("DownloadLinkDiv").innerHTML = "<img src='"+loadingImg.src+"' alt='loading-gif'>";
		
		}
		
	}
	//Level pruefen auf bestimmte Kriterien
	//Mindestens ein Checkpoint muss gesetzt sein (Startpunkt des Levels)
	//Mindestens eine Endzone muss gesetzt sein (Endpunkt des Levels)
	//Levelname darf keine Sonderzeichen haben und muss mindestens 4 Zeichen lang sein
	//Alle Objekte mit gesetzten IsDeleted Flag ausschliessen
	this.validateLevel = function(Levelobjekte, LevelName){
		
		var fehlerText = "Problem:";
		if(LevelName.length < 4){
			fehlerText+="\nDer Name deines Levels ist zu kurz!";
		}
		
		if(LevelName.match(/[^a-zA-Z0-9]/)){
			fehlerText+="\nDer Name deines Levels enthält Sonderzeichen!";
		}
		
		var foundEndzone = false;
		var foundCheckpoint = false;
		for(var i = 0; i<Levelobjekte.length; i++){
		
			if(Levelobjekte[i].Type == "Checkpoint" && Levelobjekte[i].IsDeleted == false){
				foundCheckpoint = true;
				
			}
			
			if(Levelobjekte[i].Type == "Endzone"  && Levelobjekte[i].IsDeleted == false){
				foundEndzone = true;	
			}
			
		}
		if(foundCheckpoint == false){
			fehlerText+="\nMindestens einen Checkpoint setzen!";
		}
		if(foundEndzone == false){
			fehlerText+="\nMindestens eine Endzone setzen!";		
		}
		

		if(fehlerText.length != 8){
			
			alert(fehlerText);
			return false
		}
		else{
			//Alle Levelobjekte mit gesetzten IsDeleted Flag herrausfiltern
			
			var Obj = new Array();
			
			for(var i = 0; i<Levelobjekte.length; i++){
			
				if(Levelobjekte[i].IsDeleted == false){
				
					Obj.push(Levelobjekte[i]);
				}
			}
			
		
			return Obj;
		}
		
	
	}

	//Per POST die Daten an den Server senden
	//Das Levelobjekte Array mit JSON in einen JSON String umwandeln
	this.sendLevelDataToServer = function(Levelobjekte, LevelName){
	
		var objekte  = this.validateLevel(Levelobjekte, LevelName);
		if(objekte != false){
			
			
			Request.open("POST",PhpFile,true);
			Request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			//Request.open("GET",PhpFile+"?LevelName="+LevelName+"&LevelObjekte="+JSON.stringify(objekte),true);
			Request.onreadystatechange = this.getDownloadLinkFromServer;
			Request.send("LevelName="+LevelName+"&LevelObjekte="+JSON.stringify(objekte));
		
		
		}
			
	
	}
	
	

	







}

