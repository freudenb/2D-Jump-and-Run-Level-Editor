//Tool zum Platzieren von neuen Levelobjekten
//3 Phasen
//1. Klick Position des Objekts 
//2. bei gedrueckter Maustaste die Differenz von klick Position aus Phase 1 zu aktueller Mausposition ermitteln
//  und diese als Hoehe und Breite des platzierten Rechteckes setzen
//3. Loslassen der Maustaste Objekt in die Levelobjekt Liste eintragen

function ToolPlatzieren(){
	//Flag welches gesetzt wird wenn nach auswahl des Tools das erste mal auf die Canvas geklickt wird
	this.isPlacingObject = false;
	//Objekt welches gerade Platziert wird ber aufziehen des Rechteckes mit der Maus
	this.CurrenLevelEntity = new LevelEntity(0,0,0,0,255,255,255,"StaticPlatform");
	//Flag um zu bestimmen wann die maus gedrueckt wurde// zum unterscheiden der Phasen des Tools
	
	this.MousePressed = false;
	this.clickPos = new Point(0,0);
	this.releasePos = new Point(0,0);
	
	
	
	
	
	this.update = function(MouseWorldPos, LevelObjekte, activeObjectType, ColorR, ColorG, ColorB){
	
		if(this.isPlacingObject == false && this.MousePressed == false && MouseDown && MouseOnCanvas){
			//1. Phase platzieren starten
			this.MousePressed = true;
			this.isPlacingObject = true;
			
			
			
				this.clickPos  = getGridPos(MouseWorldPos);
				//var gridpos = getGridPos(MouseWorldPos);
				this.CurrenLevelEntity.Rect.left = this.clickPos.x;
				this.CurrenLevelEntity.Rect.top = this.clickPos.y;
				this.CurrenLevelEntity.Type = activeObjectType;
				//currentCOlor uebergeben
				this.CurrenLevelEntity.ColorR = ColorR;
				this.CurrenLevelEntity.ColorG = ColorG;
				this.CurrenLevelEntity.ColorB = ColorB;
				
		
		}
		
		if(MouseDown && this.isPlacingObject){
			//2. Phase aufziehen des Rechteckes
			this.releasePos = getGridPos(MouseWorldPos);
			//Unterscheiden zwischen den Objekttypen 
			//Nur MovingPlatform, StaticPlatform und Deathzone werden aufgezogen
			//Andere werden Positioniert anhand MousePosition
			if(activeObjectType == "Checkpoint" || activeObjectType == "Endzone" || activeObjectType == "Pickup"){
			
				
				this.CurrenLevelEntity.Rect.left = this.releasePos.x;
				this.CurrenLevelEntity.Rect.top = this.releasePos.y;
			
			}
			else{
			
				
				this.CurrenLevelEntity.setRectWidth(this.releasePos.x - this.clickPos.x);
				this.CurrenLevelEntity.setRectHeight(this.releasePos.y - this.clickPos.y);
				this.CurrenLevelEntity.pointTo = new Point(this.CurrenLevelEntity.Rect.left + this.CurrenLevelEntity.Rect.width /2, this.CurrenLevelEntity.Rect.top - 50);
				
				
				
			}
		}
		
		if(MouseDown == false && this.MousePressed){
			//3. Phase Platzieren beenden
			var lv;
			this.MousePressed = false;
			this.isPlacingObject = false;
			//Neues Levelobjekt Instanzieren mit den Werten des gerade platzierten Objektes
			if(activeObjectType == "Checkpoint"){
			
				lv = new LevelEntity(this.CurrenLevelEntity.Rect.left,this.CurrenLevelEntity.Rect.top,42,28,0,0,0, activeObjectType);
				
			}
			else if(activeObjectType == "Endzone"){
			
				lv = new LevelEntity(this.CurrenLevelEntity.Rect.left,this.CurrenLevelEntity.Rect.top,100,100,0,0,0, activeObjectType);
				
			
			}
			else if(activeObjectType == "Pickup"){
			
				lv = new LevelEntity(this.CurrenLevelEntity.Rect.left,this.CurrenLevelEntity.Rect.top,10,10,0,0,0, activeObjectType);
				
			}
			else{
				
				
				
				this.releasePos =  getGridPos(MouseWorldPos);
				
				
				var width = this.releasePos.x - this.clickPos.x;
				var height = this.releasePos.y - this.clickPos.y;
				//Bei negativer groesse wurde Objekt von rechts nach links aufgezogen
				//Dann Position des Rechteckes = der Punkt an dem die Maus losgelassen wurde anstatt der andem die Maus zum ersten mal gedrueckt wurde
				//Und absoluten Wert von Breite und Hoehe ermitteln
				if(width < 0){
					this.CurrenLevelEntity.Rect.left = this.releasePos.x;
					width = Math.abs(width);
				}
				
				if(height < 0){
					this.CurrenLevelEntity.Rect.top = this.releasePos.y;
					height = Math.abs(height);
				}
				
				this.CurrenLevelEntity.setRectWidth(width);
				this.CurrenLevelEntity.setRectHeight(height);
				
				this.isPlacingObject = false;
				
				lv = new LevelEntity(this.CurrenLevelEntity.Rect.left,this.CurrenLevelEntity.Rect.top,this.CurrenLevelEntity.Rect.width,this.CurrenLevelEntity.Rect.height,this.CurrenLevelEntity.ColorR,this.CurrenLevelEntity.ColorG,this.CurrenLevelEntity.ColorB, activeObjectType);
				lv.pointTo = new Point(this.CurrenLevelEntity.Rect.left + this.CurrenLevelEntity.Rect.width /2, this.CurrenLevelEntity.Rect.top - 50);
				
				
				
			}
			
			//platziertes Objekt in die Objektliste einfuegen
			if(this.CurrenLevelEntity.Type == "MovingPlatform" || this.CurrenLevelEntity.Type == "StaticPlatform" || this.CurrenLevelEntity.Type == "Deathzone"){
				//Pruefen ob mindestens ein GridTile gross
				
				if(this.CurrenLevelEntity.Rect.width >= GridTileSize.x && this.CurrenLevelEntity.Rect.height >= GridTileSize.y){
				
					LevelObjekte.push(lv);
				}
			
			}
			else{
	
				LevelObjekte.push(lv);
			}
			
		
		}
	
		
	
	}
	
	
	this.getCurrentLevelEntity = function(){
			
		return this.CurrenLevelEntity;
	}
	
	
	this.isPlacing = function(){
		return this.isPlacingObject;
	}



}

//Setzt das IsDeleted Flag bei Levelobjekt auf das geklickt wurde
function ToolEntfernen(){

	this.MousePressed = false;
	
	this.update = function(MouseWorldPos, LevelObjekte ){
	
		//Maustaste wurde gedrueckt
		if(this.MousePressed == false && MouseDown && MouseOnCanvas){
		
			
			this.MousePressed = true;
		
		}
		
		
		//Bei loslassen der Maustaste wird auf ueberlappen der Maus mit einem Levelobjekte geprueft
		//Falls Kollsision dann Flag setzen
		if(this.MousePressed && MouseDown == false && MouseOnCanvas){
		
			this.MousePressed = false;
			
			for(var i = 0; i<LevelObjekte.length; i++){
			
				if(kollisionBetween(LevelObjekte[i].getRect(), new Rect(MouseWorldPos,new Point(1,1)))){
					
					LevelObjekte[i].IsDeleted = true;
				}
				
			
			}
			
		
		}
		
	
	
	}



}

//Tool zum verschieben und vuswaehlen von Objekten 

function ToolVerschieben(){


	
	this.Verschieben = false;
	//Flag welches gesetzt wird wenn der Punkt zu dem sich eine MovingPlatform bewegt verschoben werden soll
	this.VerschschiebenPointTo = false;
	//Referenz auf gerade gewaehltes Levelobjekt im Levelobjekte Array
	this.CurrentSelectedObjekt = new LevelEntity(0,0,0,0,255,255,255,"StaticPlatform");
	
	this.update = function(MouseWorldPos, LevelObjekte ){
	
		console.log("verschObjekt: "+this.CurrentSelectedObjekt.Rect.left);
		//1. Phase Objekt auswaehlen
		if(MouseDown && MouseOnCanvas && this.Verschieben == false){
			
			
			
			for(var i = 0; i<LevelObjekte.length; i++){
				//Klick auf Objekt
				if(LevelObjekte[i].IsDeleted == false && kollisionBetween(LevelObjekte[i].getRect(), new Rect(MouseWorldPos,new Point(1,1)))){
						//Maus auf Objekt und geklickt , Referenz auf angeklicktes Objekt
						this.CurrentSelectedObjekt = LevelObjekte[i];
						//Parameter im Menu aktualisieren mit den Werten des gerade angeklickten Objektes
						this.setObjektMenu();
						this.Verschieben = true;
						
				}
				
				if(LevelObjekte[i].IsDeleted == false && LevelObjekte[i].Type == "MovingPlatform"){
					
					//Falls PointTo von Movingplatform verschoben werden soll
					//Kollsisions Rechteck am Ende der blauen Linie
					var pointToKollisionRect = new Rect(new Point(LevelObjekte[i].pointTo.x-5, LevelObjekte[i].pointTo.y-5), new Point(10,10));
								
					if(kollisionBetween(pointToKollisionRect, new Rect(MouseWorldPos,new Point(1,1)))){
					//Falls angeklickt Flags setzen und Referenz
						
						this.CurrentSelectedObjekt = LevelObjekte[i];
						this.VerschschiebenPointTo = true;
						this.Verschieben = true;
					}
					
				}
			
			}
			
			
		}
		
		if(MouseDown && MouseOnCanvas && this.Verschieben == true){
			
			//Objekt verschieben  Objekt an MouseWorld Position setzen
			var pt = getGridPos(MouseWorldPos);
			
			if(this.VerschschiebenPointTo){
			
				this.CurrentSelectedObjekt.pointTo.x = MouseWorldPos.x;
				this.CurrentSelectedObjekt.pointTo.y = MouseWorldPos.y;
			}
			else{
				//Menue aktualisieren
				this.setObjektMenu();
				this.CurrentSelectedObjekt.Rect.left = pt.x;
				this.CurrentSelectedObjekt.Rect.top = pt.y;
				if(this.CurrentSelectedObjekt.Type == "MovingPlatform"){
					this.CurrentSelectedObjekt.pointTo = new Point(this.CurrentSelectedObjekt.Rect.left + this.CurrentSelectedObjekt.Rect.width /2, this.CurrentSelectedObjekt.Rect.top - 50);
				}
			
			}
		

		
		}
		//2. Phase Maus losgelassen Objekt am Punkt des Loslassens platzieren
		if(MouseDown == false && MouseOnCanvas &&  this.Verschieben == true){
			
			var pt = getGridPos(MouseWorldPos);
			
			
			if(this.VerschschiebenPointTo){
			
				this.CurrentSelectedObjekt.pointTo.x = MouseWorldPos.x;
				this.CurrentSelectedObjekt.pointTo.y = MouseWorldPos.y;
				this.VerschschiebenPointTo = false;
			}
			else{
						
				this.CurrentSelectedObjekt.Rect.left = pt.x;
				this.CurrentSelectedObjekt.Rect.top = pt.y;
				if(this.CurrentSelectedObjekt.Type == "MovingPlatform"){
					this.CurrentSelectedObjekt.pointTo = new Point(this.CurrentSelectedObjekt.Rect.left + this.CurrentSelectedObjekt.Rect.width /2, this.CurrentSelectedObjekt.Rect.top - 50);	
				}
			
			}
			
			
			this.Verschieben = false;
			
		}
		

	}
	//Zeichnet bei Mouseposition auf einem Objekt einen blauen rand um das jeweilige Objekt
	this.onMouseOver = function(ctx, LevelObjekt, CanvasPos,MouseWorldPos){
		

		
		if(LevelObjekt.IsDeleted == false && kollisionBetween(LevelObjekt.getRect(), new Rect(MouseWorldPos,new Point(1,1)))){
		
				
				console.log("Canv:"+CanvasPos.y);
				ctx.strokeStyle="blue";
				ctx.strokeRect(CanvasPos.x-1,CanvasPos.y-1,LevelObjekt.getRect().width+2,LevelObjekt.getRect().height+2);
				
				
		}
			
		
						
	}
	
	
	
	
	this.getCurrentlySelectedObject = function(){
		return this.CurrentSelectedObjekt;
	}
	
	
	this.setObjektMenu = function(){
	//Setzt die Textfelder mit den aktuellen Werten
		document.getElementById("ObjektTypText").innerHTML = "Typ: "+this.CurrentSelectedObjekt.Type;
		document.getElementById("ObjektXInput").value = this.CurrentSelectedObjekt.getRect().left;
		document.getElementById("ObjektYInput").value = this.CurrentSelectedObjekt.getRect().top;
		document.getElementById("ObjektWidthInput").value = this.CurrentSelectedObjekt.getRect().width;
		document.getElementById("ObjektHeightInput").value = this.CurrentSelectedObjekt.getRect().height;
		document.getElementById("PlatformSpeedInput").value = this.CurrentSelectedObjekt.velocity;
		
		document.getElementById("sColorR").value = this.CurrentSelectedObjekt.ColorR;
		document.getElementById("sColorG").value = this.CurrentSelectedObjekt.ColorG;
		document.getElementById("sColorB").value = this.CurrentSelectedObjekt.ColorB;
		//Setzt die Farbe der Div inder die ausgewaehlte Farbe optisch angezeigt wird
		document.getElementById("colorPreview2").style.backgroundColor="rgb("+this.CurrentSelectedObjekt.ColorR+","+this.CurrentSelectedObjekt.ColorG+","+this.CurrentSelectedObjekt.ColorB+")";
				
		if(this.CurrentSelectedObjekt.Type == "Endzone" || this.CurrentSelectedObjekt.Type == "Checkpoint" || this.CurrentSelectedObjekt.Type == "Pickup"){
				//Bei bestimmten Typen groesse festgelegt deswegen Input Felder readonly
				document.getElementById("ObjektWidthInput").setAttribute("readOnly","readonly") 		
				document.getElementById("ObjektHeightInput").setAttribute("readOnly","readonly");
		
		}
		else{
			
			document.getElementById("ObjektWidthInput").removeAttribute("readOnly");
			document.getElementById("ObjektHeightInput").removeAttribute("readOnly");
		
		}
		if(this.CurrentSelectedObjekt.Type != "MovingPlatform"){
			
			
			document.getElementById("PlatformSpeedInput").setAttribute("readOnly","readonly");	
			document.getElementById("PlatformSpeedInput").value = 0;
		}
		
		if(this.CurrentSelectedObjekt.Type == "MovingPlatform"){
		
			document.getElementById("PlatformSpeedInput").removeAttribute("readOnly");
		
		}
		
		
		
		
		
	}


}
