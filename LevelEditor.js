//Globale Variablen
//Position der Maus auf Canvas
var MousePosOnCanvas = new Point(0,0);
//Flag bei mouseover  auf true gesetzt
var MouseOnCanvas = true;
//Flag bei onclick true
var MouseDown = false;
//groesse der Grid Kacheln
var GridTileSize = new Point(16,16);
//groesse des gesamten Editor "welt"
var WorldSize = new Point(9600,9600);

var ActiveButtonBorderColor = "rgb(0,255,0)";
var InactiveButtonBorderColor = "grey";

var ActiveButtonBorderStyle = "inset";
var InactiveButtonBorderStyle = "outset";
//Haupklasse des LevelEditors welche alle Komponenten zusammenfuerht
function LevelEditor(){
	//canvas
	this.canvas = document.getElementById("canvas");
	//2d kontext der canvas zum zeichnend der objekte
	this.ctx = canvas.getContext("2d");
	//definiert wie schnell sich die Ansicht verschiebt bei Mausposition am Rand
	this.ScrollSpeed = 30;
	//ausgewaehlte Farbe fuer die Platformen
	this.ColorR = 0;
	this.ColorG = 255;
	this.ColorB = 0;
	//Image des Endzoneobjektes
	this.EndzoneImage = new Image();
	this.EndzoneImage.src = "./sprites/endzone.png";
	
	this.CheckpointImage = new Image();
	this.CheckpointImage.src = "./sprites/cpactive.png";
	
	this.PickupImage = new Image();
	this.PickupImage.src = "./sprites/pickup.png";
	
	this.DeathzoneImage = new Image();
	this.DeathzoneImage.src = "./sprites/DeathZoneIcon.png";

	//Font der Koordinaten anzeige
	this.Font = "16px Arial";
	this.FontColor = "white";
	//Array in das alles Levelobjekte gepackt werden
	this.LevelObjekte = new Array();
	
	//position des viewport
	this.ViewportPos = new Point(0,0);
	//position der mouse in der gesamten welt ( Viewportposition + Mouseposition auf Canvas = Weltposition)
	this.MouseWorldPos = new Point(0,0);
	//groesse der Welt
	this.MaxMapSize = new Point(9600,9600);
	//Alle Werkzeuge instanzieren
	this.Platzieren = new ToolPlatzieren();
	this.Entfernen = new ToolEntfernen();
	this.Verschieben = new ToolVerschieben();
	
	//Array mit Objekttypen
	this.ObjectTypes = new Array();
	this.ObjectTypes["StaticPlatform"] = "StaticPlatform";
	this.ObjectTypes["MovingPlatform"] = "MovingPlatform";
	this.ObjectTypes["Deathzone"] = "Deathzone";
	this.ObjectTypes["Checkpoint"] = "Checkpoint";
	this.ObjectTypes["Pickup"] = "Pickup";
	this.ObjectTypes["Endzone"] = "Endzone";
	//Gerade ausgewaehltes Objekt
	this.activeObjectType = this.ObjectTypes["Deathzone"];
	
	//Array mit code fuer die Werkzeuge
	this.Tools = new Array();
	this.Tools["Platzieren"] = 0;
	this.Tools["Entfernen"] = 1;
	this.Tools["Verschieben"] = 2;
	//Gerade ausgewaehltes Werkzeug
	this.activeTool = this.Tools["Verschieben"];
	
	//Erstellt die das Grid Image
	this.Grid = createGrid();
	
	
	//kontinuierlich ausgefuerhte Methode die die Objekte und Tools aktualisiert und auf Eingaben reagiert
	this.update = function(){
	
		console.log("MousePosOnCanvas: "+MousePosOnCanvas.x+"/"+MousePosOnCanvas.y);
		console.log("Mousedown: "+MouseDown);
		console.log("ViewportPos: "+this.ViewportPos.x+"/"+this.ViewportPos.y)
		console.log("MouseWorldPos: "+this.MouseWorldPos.x+"/"+this.MouseWorldPos.y)
		this.scroll();
		
		if(this.activeTool == this.Tools["Platzieren"]){
			
			this.Platzieren.update(this.MouseWorldPos, this.LevelObjekte, this.activeObjectType, this.ColorR, this.ColorG, this.ColorB);
		}
		
		if(this.activeTool == this.Tools["Entfernen"]){
			
			this.Entfernen.update(this.MouseWorldPos, this.LevelObjekte);
		}
		
		if(this.activeTool == this.Tools["Verschieben"]){
			
			this.Verschieben.update(this.MouseWorldPos, this.LevelObjekte);
		}
		
	}
	
	//Methode die alle Levelobjekte zeichnet
	this.drawLevelObjekte = function(){
	
		for(var i = 0; i<this.LevelObjekte.length;i++){
		
			
			if(this.activeTool == this.Tools["Verschieben"]){
			
				var p = new Point(0,0);
				p = this.getCanvasPos(this.LevelObjekte[i].getRect().left, this.LevelObjekte[i].getRect().top);
				
				this.Verschieben.onMouseOver(this.ctx,this.LevelObjekte[i],p,this.MouseWorldPos);
				
			}
			
			
			if(this.isLevelObjektOnScreen(this.LevelObjekte[i]) && this.LevelObjekte[i].IsDeleted == false){
			
				this.drawLevelObjekt(this.LevelObjekte[i]);
				
			}
			
		
		}
		
	
	}
	
	//Methode di auf unterschiedliche Art ein Levelobjekt zeichnet
	this.drawLevelObjekt = function(LevelObjekt){
	
		var p = this.getCanvasPos(LevelObjekt.getRect().left, LevelObjekt.getRect().top);
	
		if(LevelObjekt.Type == this.ObjectTypes["StaticPlatform"]){
		
		
			//Zeichnet ein Rechteck und eine Border darum
			this.ctx.fillStyle=LevelObjekt.getFillColorString();
			this.ctx.fillRect(p.x,p.y,LevelObjekt.getRect().width,LevelObjekt.getRect().height);
			this.ctx.strokeStyle=LevelObjekt.getStrokeColorString();
			this.ctx.strokeRect(p.x,p.y,LevelObjekt.getRect().width,LevelObjekt.getRect().height);
			
		}
		if(LevelObjekt.Type == this.ObjectTypes["MovingPlatform"]){
		
		
			//Zeichnet ein Rechteck und eine Border darum
			this.ctx.fillStyle=LevelObjekt.getFillColorString();
			this.ctx.fillRect(p.x,p.y,LevelObjekt.getRect().width,LevelObjekt.getRect().height);
			this.ctx.strokeStyle=LevelObjekt.getStrokeColorString();
			this.ctx.strokeRect(p.x,p.y,LevelObjekt.getRect().width,LevelObjekt.getRect().height);
			//Zeichnet eine Linie vom Center des Objekts bis zum PointTO Punkt zu welchen sich die Platform im Spiel hinbewegen wird
			this.ctx.strokeStyle="blue";
			this.ctx.beginPath();
			this.ctx.moveTo(p.x + LevelObjekt.getRect().width/2, p.y + LevelObjekt.getRect().height/2)
			var pt = this.getCanvasPos(LevelObjekt.pointTo.x, LevelObjekt.pointTo.y);
			this.ctx.lineTo(pt.x, pt.y);
			this.ctx.stroke();
			this.ctx.beginPath();
			this.ctx.arc(pt.x,pt.y,5,0,2*Math.PI);
			this.ctx.fillStyle = "blue";
			this.ctx.fill();
			
	
			
		}
		if(LevelObjekt.Type == this.ObjectTypes["Deathzone"]){
		
			//Zeichnet Rechteck mit Border und Bild im Center um Deathzone von normaler Platform unterschieden zu koennen
			this.ctx.fillStyle="rgba(255,0,0,0.25)";
			this.ctx.fillRect(p.x,p.y,LevelObjekt.getRect().width,LevelObjekt.getRect().height);
			this.ctx.strokeStyle="rgb(255,0,0)";
			this.ctx.strokeRect(p.x,p.y,LevelObjekt.getRect().width,LevelObjekt.getRect().height);
			
			this.ctx.drawImage(this.DeathzoneImage, (p.x + LevelObjekt.getRect().width / 2) - this.DeathzoneImage.width/2, (p.y + LevelObjekt.getRect().height/2) - this.DeathzoneImage.height/2);
			
			
		}
		//Zeichnet Bild
		if(LevelObjekt.Type == this.ObjectTypes["Endzone"]){
			
			this.ctx.drawImage(this.EndzoneImage, p.x, p.y);
			
		
		}
		
		if(LevelObjekt.Type == this.ObjectTypes["Checkpoint"]){
			
			this.ctx.drawImage(this.CheckpointImage, p.x, p.y);
			
		
		}
		
		if(LevelObjekt.Type == this.ObjectTypes["Pickup"]){
			
			this.ctx.drawImage(this.PickupImage, p.x, p.y);
			
		}
		
	
	}
	//Wird bei Klick auf einen Toolbutton aufgerufen, stellt erst alle Buttons auf inaktiv und dann das soeben gewaehlte auf aktiv
	this.setTool = function(toolnumber){
				
		var Buttons = new Array(document.getElementById("PlatzierenButton"),document.getElementById("EntfernenButton"),document.getElementById("VerschiebenButton"));
		for(var i = 0; i<Buttons.length; i++){
		
			Buttons[i].style.borderColor = InactiveButtonBorderColor;
			Buttons[i].style.borderStyle = InactiveButtonBorderStyle;
		
		}
		Buttons[toolnumber].style.borderColor = ActiveButtonBorderColor;
		Buttons[toolnumber].style.borderStyle = ActiveButtonBorderStyle;
		this.activeTool = toolnumber;
	}
	//Aehnlich wie set Tool nur fuer den Objekttyp
	this.setObjectType = function(objecttype){
	
		var Buttons = new Array(document.getElementById("StaticPlatformButton"),document.getElementById("MovingPlatformButton"),document.getElementById("DeathzoneButton"),document.getElementById("CheckpointButton"), document.getElementById("EndzoneButton"), document.getElementById("PickupButton") );
		for(var i = 0; i<Buttons.length; i++){
		
			
			Buttons[i].style.borderColor = InactiveButtonBorderColor;
			Buttons[i].style.borderStyle = InactiveButtonBorderStyle;
		
		}
	
		document.getElementById(objecttype+"Button").style.borderColor = ActiveButtonBorderColor;
		document.getElementById(objecttype+"Button").style.borderStyle = ActiveButtonBorderStyle;
		this.activeObjectType = objecttype;
	}
	//Setzt die gerade gewaehlte Farbe nach ueberpruefung ob Farbe in richtigen Format angegeben, 0 - 255
	this.setSelectedColor = function(){
	
		var r = document.getElementById("ColorR").value;
		var g = document.getElementById("ColorG").value;
		var b = document.getElementById("ColorB").value;
		
		if(IsColorValid(r) && IsColorValid(g) && IsColorValid(b)){
		
			document.getElementById("colorPreview1").style.backgroundColor="rgb("+r+","+g+","+b+")";
		
			this.ColorR = r;
			this.ColorG = g;
			this.ColorB = b;
		
		}
		
		
		
	
	}
	//Setzt die Farbe des gerade ausgewaehlten Objekts
	this.setCurrentlySelectedObjectColor = function(){
	
		var r = document.getElementById("sColorR").value;
		var g = document.getElementById("sColorG").value;
		var b = document.getElementById("sColorB").value;
		
		if(IsColorValid(r) && IsColorValid(g) && IsColorValid(b)){
		
			document.getElementById("colorPreview2").style.backgroundColor="rgb("+r+","+g+","+b+")";
			
			var obj = this.Verschieben.getCurrentlySelectedObject();
			
			obj.ColorR = r;
			obj.ColorG = g;
			obj.ColorB = b;
		
		}
		
	}
	//Setzt alle weiteren Parameter des gerade ausgewaehlten Objekts
	this.setCurrentlySelectedObjectParameter = function(){
	
		var obj = this.Verschieben.getCurrentlySelectedObject();
		
		var x = document.getElementById("ObjektXInput").value;
		var y = document.getElementById("ObjektYInput").value;
		var width = document.getElementById("ObjektWidthInput").value;
		var height = document.getElementById("ObjektHeightInput").value;
		var speed = document.getElementById("PlatformSpeedInput").value;
		//Prueft ob es sich um eine Zahl handelt
		if(!isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height) && !isNaN(speed)){
		
			obj.Rect.left = parseInt(x);
			obj.Rect.top = parseInt(y);
			obj.Rect.width = parseInt(width);
			obj.Rect.height = parseInt(height);
			obj.velocity = parseInt(speed);
		
		}
		
		
	}
	//errechnet die Position des Objektes auf dem Canvas bei Angabe der Welt Position
	this.getCanvasPos = function(ObjektWorldPosX, ObjektWorldPosY){
	
		return new Point(ObjektWorldPosX - this.ViewportPos.x, ObjektWorldPosY - this.ViewportPos.y);
	}
	//Prueft ob Objekt gerade im Bereich des Viewports liegt
	this.isLevelObjektOnScreen = function(LevelObjekt){
	
		if(kollisionBetween(LevelObjekt.getRect(),new Rect(new Point(this.ViewportPos.x, this.ViewportPos.y), new Point(this.canvas.width, this.canvas.height)))){
		
			return true;
			
		}
		else{
		
			return false;
		}
		
	}
	//Zeichnet eine blaue Border um das Objekt welches mit dem Verschieben Tool ausgewaehlt wurde
	this.highlightCurrentlySelectedObjekt = function(){
	
		var selobj = this.Verschieben.getCurrentlySelectedObject();
		
		if(selobj.IsDeleted == false){
			
			var pt = this.getCanvasPos(selobj.getRect().left, selobj.getRect().top);
			this.ctx.strokeStyle="blue";
			this.ctx.strokeRect(pt.x-1,pt.y-1,selobj.getRect().width+2,selobj.getRect().height+2);
			
		}
		
	
	}
	
	//Funktion die alle Objekte die sich im Bereich des Viewports befinden zeichnet und den Teil des Gridgitters der gerade Sichtbar ist
	this.draw = function(){
		
		
		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
		//this.ctx.drawImage(this.Grid,this.ViewportPos.x,this.ViewportPos.y,this.canvas.width,this.canvas.height,0,0,this.canvas.width,this.canvas.height);
		
		//Nimmt einen Teil des Grids der gerade sichtbar ist und zeichnet ihn auf die Canvas
		var imgData = this.Grid.getContext("2d").getImageData(this.ViewportPos.x,this.ViewportPos.y,this.canvas.width,this.canvas.height);
		this.ctx.putImageData(imgData,0,0);
		
		
		this.highlightCurrentlySelectedObjekt();
		
		this.drawLevelObjekte();
		//Zeichnet falls das Tool Platzieren ausgewaehlt wurde das Objekt welches gerade mit der Maus aufgezogen wird
		if(this.activeTool == this.Tools["Platzieren"] && this.Platzieren.isPlacing()){
			this.drawLevelObjekt(this.Platzieren.getCurrentLevelEntity());
		}
		
		
		//Zeichnet die Weltkoordinaten
		this.ctx.fillStyle=this.FontColor;
		this.ctx.font=this.Font;
        this.ctx.fillText(Math.floor(this.MouseWorldPos.x)+"/"+Math.floor(this.MouseWorldPos.y),10,20);
				
		
	}
	
	//wird alle 40 ms aufgerufen
	this.run = function(){
		
		this.update();
		this.draw();
		
	
	}
	//Sobald Maus auf dem Canvas und am Rand der Canvas den Viewport  verschieben 
	this.scroll = function(){
	
		
		if(MouseOnCanvas){
			
			if(MousePosOnCanvas.x < 30 && this.ViewportPos.x > 0){
				this.ViewportPos.x -= this.ScrollSpeed;
			}
			
			if(MousePosOnCanvas.y < 30 && this.ViewportPos.y > 0){
				this.ViewportPos.y -= this.ScrollSpeed;
			}
			
			if((MousePosOnCanvas.x > this.canvas.width - 30) && this.ViewportPos.x + this.canvas.width < this.MaxMapSize.x){
				this.ViewportPos.x += this.ScrollSpeed;
			}
			
			if(MousePosOnCanvas.y > this.canvas.height - 30 && this.ViewportPos.y + this.canvas.height < this.MaxMapSize.y){
				this.ViewportPos.y += this.ScrollSpeed;
			}
			
			this.MouseWorldPos.x = this.ViewportPos.x + MousePosOnCanvas.x
			this.MouseWorldPos.y = this.ViewportPos.y + MousePosOnCanvas.y
		}
	}


}




//Wird bei body onload aufgerufen, startet den Level Editor
function main(){

	//Instanziert ein Level Editor Objekt
	le = new LevelEditor();
	//Instanziert das Objekt mit welchen die AJAX Abfrage erstellt, gesendet und und die Antwort vom Server empfangen wird
	saveLevel = new SaveLevel();
	
	canvas = document.getElementById("canvas");
	//Fuegt dem Canvas Element mehrere Listener hinzu die sich um die Maus eingabe kuemmern
	canvas.addEventListener("mousedown",function(event){
		MouseDown = true;
		event.preventDefault();
	},false);
	
	
	canvas.addEventListener("mouseup",function(event){
		MouseDown = false;
		
	},false);
	
	canvas.addEventListener("mouseover",function(event){
		console.log("mouseoncanvas");
		MouseOnCanvas = true;
	},false);
	
	canvas.addEventListener("mouseout",function(event){
		MouseOnCanvas = false;
	},false);
	
	canvas.addEventListener("mousemove",function(event){
	
		rect = canvas.getBoundingClientRect()
		MousePosOnCanvas.x = event.clientX - rect.left;
		MousePosOnCanvas.y = event.clientY - rect.top;
	
	
	},false);
	//Alle 40 ms wird der Leveleditor aktualisiert
	setInterval(function(){le.run()},40);
	
	
	







}