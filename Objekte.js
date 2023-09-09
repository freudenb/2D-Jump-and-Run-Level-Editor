//Objekt welches einen Punkt repraesentiert
function Point(x,y){
	this.x = x;
	this.y = y

}
//Rechteck aus zwei Punkten fuer Position und Groesse
function Rect(pos,size){

	this.left = pos.x;
	this.top = pos.y;
	this.width = size.x;
	this.height = size.y;
}
//Checkt ob sich zwei Rechtecke ueberlappen
function kollisionBetween(r1, r2){

	    
    if (r1.left + r1.width < r2.left || r1.left > r2.left + r2.width){
        
        return false;
    }
    if (r1.top + r1.height < r2.top || r1.top > r2.top + r2.height){
        
		return false;
    }
    return true;


}
//Prueft Farbwert auf gueltigkeit
function IsColorValid(color){
	
		if(!isNaN(color) && color >= 0 && color <= 255 ){
		
			return true;
		}
		else{
		
			return false;
		}
	
}
//Erstellt eine offscreen Canvas auf welche ein 9600 x 9600 grosses Gitternetz gezeichnet wird
function createGrid(){
		
		var c = document.createElement("canvas");
		//Vorrausladen der Canvas bei Seitenaufruf
		c.onload = function(){
			
			
		};
		//groesse der Canvas setzen mit globaler variable WorldSize
		//Scheitert manchmal im Firefox "NS ERROR ..." evtl. canvas zu gross!?
		c.width = WorldSize.x;
		c.height = WorldSize.y;
		//2d Kontext zum zeichnen
		var cx = c.getContext("2d");
		
		//Farbe der Linien
		cx.strokeStyle="rgba(200,200,200,0.25)"
		for(var i = 0; i<(WorldSize.x/GridTileSize.x); i++){
			//Zeichnet alle vertikalen Linien
			cx.beginPath();
			cx.moveTo(i*GridTileSize.x,0);
			cx.lineTo(i*GridTileSize.x, WorldSize.y);
			cx.stroke();
			
		
		
		}
		//Zeichnet alle horizontalen Linien
		for(var i = 0; i<(WorldSize.y/GridTileSize.y); i++){
		
			cx.beginPath();
			cx.moveTo(0,i*GridTileSize.y);
			cx.lineTo(WorldSize.x, i*GridTileSize.y);
			cx.stroke();
		
		}
		
		return c;
}


function getGridPos(Pos){
//errechnet Anhand einer Koordinate die naechste Stelle auf dem Gitternetz
return new Point(Math.floor(Pos.x/GridTileSize.x) * GridTileSize.x, Math.floor(Pos.y/GridTileSize.y) * GridTileSize.y);

}


//Objekt welche ein Levelobjekt repraesentiert 
function LevelEntity(x,y,w,h, ColorR, ColorG, ColorB, typ){
	//Levelobjekte grundsaetzlich ein Viereck
	//Position und groesse
	this.Rect = new Rect(new Point(x,y), new Point(w,h));
	this.Rect.left = x;
	this.Rect.top = y;
	this.Rect.width = w;
	this.Rect.height = h;
	//Farbe des Objekts
	this.ColorR = ColorR;
	this.ColorG = ColorG;
	this.ColorB = ColorB;
	//String mit dem Typ des Objekts
	this.Type = typ
	
	//Nur fuer Objekte vom Typ MovingPlatform von bedeutung
	//Bestimmt den Punkt zu den sich die Platform im Spiel hinbewegen
	this.pointTo = new Point(0,0);
	//Geschwindigkeit der MovingPlatform
	this.velocity = 100;
	//Flag welches gesetzt wird sollte der Benutzer mit dem Entfernen Tool auf das Objekt klicken
	this.IsDeleted = false;
	
	
	this.getRect = function(){
	
		return this.Rect;
	}
	
	this.setRectWidth = function(w){
	
		this.Rect.width = w;
	}
	
	this.setRectHeight = function(h){
	
		this.Rect.height = h;
	}
	//Gibt einen String zurueck der die Farbe der zu zeichnenden Border bestimmt
	this.getStrokeColorString = function(){
	
		return "rgb("+this.ColorR+","+this.ColorG+","+this.ColorB+")";
	}
	//Gbit einen String zureck der die Fuellfarbe bestimmt
	this.getFillColorString = function(){
	
		return "rgba("+this.ColorR+","+this.ColorG+","+this.ColorB+","+0.25+")";
	}

}