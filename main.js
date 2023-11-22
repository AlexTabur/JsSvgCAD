
var settings = {
	mode: "select",
	gridSnap:false,
	gridXOffset: 50,
	gridYOffset: 50,
	gridXStep: 50,
	gridYStep: 50
},
x=0,
y=0;
actionsDictionary={};
actionsDictionary['line']={
	move:()=>{
		if(points){
			preview.innerHTML=`<line x1="${points[0]}" y1="${points[1]}" x2="${x}" y2="${y}"/>`	
		}
	},mousedown:()=>{
		if(!points.length){
			points=[x,y]
		}else{
			fromPreviewToReality();
			points=[x,y]
		}
	}
}
actionsDictionary['circle']={
	move:()=>{
		if(points){
			preview.innerHTML=`<circle cx="${points[0]}" cy="${points[1]}" r="${((points[0]-x)**2+(points[1]-y)**2)**0.5}"/>`	
		}
	},mousedown:()=>{
		if(!points.length){
			points=[x,y]
		}else{
			fromPreviewToReality();
			points=[x,y]
		}
	}
}
actionsDictionary['circle3']={
	move:()=>{
		if(points){
			if (points.length==2) {
				preview.innerHTML=`<circle cx="${points[0]}" cy="${points[1]}" r="${3}"/>`
			}
			if (points.length==4) {
			let x1=points[0],x2=points[2],y1=points[1],y2=points[3],x3=x,y3=y;
			let xc=0.5*((y1-y2)*(x2**2+y2**2-y3**2-x3**2)+(y2**2+x2**2-x1**2-y1**2)*(y2-y3))/((y2-y3)*(x2-x1)-(y1-y2)*(x3-x2)),
				yc=(xc-(x1+x2)*0.5)*(x2-x1)/(y1-y2)+(y1+y2)/2,
				r=((xc-x1)**2+(yc-y1)**2)**0.5;
			preview.innerHTML=`
			<circle cx="${x1}" cy="${y1}" r="${3}"/>
			<circle cx="${x2}" cy="${y2}" r="${3}"/>
			<circle cx="${x3}" cy="${y3}" r="${3}"/>
			<circle cx="${xc}" cy="${yc}" r="${r}"/>`
			}
		}
	},mousedown:()=>{
		if (points.length<3) {
			points.push(x, y)
		}
		else{
			fromPreviewToReality();
			points.shift()
			points.shift()
			points.push(x, y)
		}
	}
}
actionsDictionary['select']={
	mousedown:()=>{points=[];},
	move:()=>{}
}

//M a b Q c d x y  -  length=4
//M a b Q c d e f  g h x y - length=8
//M a b Q c d e f  g h i j x y - length=12
actionsDictionary['bcurve']={
	move:()=>{
		let str="Q "
		if(points.length>=4&&points.length%4==0){
			for (var i = 2; i < points.length; i+=2) {
				str+=`${points[i]} ${points[i+1]} `
			}
			str+=`${x} ${y} `
			preview.innerHTML=`<path d="M ${points[0]} ${points[1]} ${str}"/>`
		}
	},mousedown:()=>{
		points.push(x, y)
	}
}
//M a b C c d e f x y - length=6
//M a b C c d e f g h  i j k l x y - length=12
//M a b C c d e f g h  i j k l m n  o p r s x y - length=18
/*actionsDictionary['ccurve']={
	move:()=>{
		let str="C "
		if(points.length>=6&&points.length%6==0){
			for (var i = 2; i < points.length; i+=2) {
				str+=`${points[i]} ${points[i+1]} `
			}
			str+=`${x} ${y} `
			preview.innerHTML=`<path d="M ${points[0]} ${points[1]} ${str}"/>`
		}
	},mousedown:()=>{
		points.push(x, y)
	}
}*/
//M 0 1 C 2 3 0 1 x y - length=2*2
//M 0 1 C 2 3 0 1 4 5  4 5 4 5 x y - length=3*2
//M 0 1 C 2 3 2 3 4 5  4 5 4 5 6 7  6 7 6 7 x y - length=4*2
actionsDictionary['ccurve']={
	move:()=>{
		let str="C "
		if(points.length>=4&&points.length%2==0){
			points.push(x, y)
			for (var i = 2; i < points.length; i+=2) {
				str+=`${points[i]} ${points[i+1]} ${points[i]} ${points[i+1]} ${points[i+2]} ${points[i+3]} `
			}
			points.pop()
			points.pop()
			preview.innerHTML=`<path d="M ${points[0]} ${points[1]} ${str}"/>`
		}
	},mousedown:()=>{
		points.push(x, y)
	}
}
drawGridX=()=>{
	gridX.innerHTML="";
	for (var i = settings.gridXOffset; i < 800; i+=settings.gridXStep) {
		gridX.innerHTML+=`<line x1="${i}" y1="0" x2="${i}" y2="800"/>`
	}	
}
drawGridY=()=>{
	gridY.innerHTML="";
	for (var i = settings.gridYOffset; i < 800; i+=settings.gridYStep) {
		gridY.innerHTML+=`<line y1="${i}" x1="0" y2="${i}" x2="800" />`
	}	
}
window.onload=()=>{
	drawGridX();
	drawGridY();
}
var	points = [];
field.onmousedown=(e)=>{
	actionsDictionary[settings.mode].mousedown();	
}
fromPreviewToReality=()=>{
	reality.innerHTML+=preview.innerHTML;
	preview.innerHTML="";
}
window.onkeydown=(e)=>{
	switch(e.key){
	case "Escape":{
			points=[];
			preview.innerHTML=""
			mode="select"
	}}
}
field.onmousemove=(e)=>{
	x=e.layerX;
	y=e.layerY;	
	
	if (settings.gridSnap) {
		x-=settings.gridXOffset;
		x=Math.round(x/settings.gridXStep)*settings.gridXStep;
		x+=settings.gridXOffset;

		y-=settings.gridYOffset;
		y=Math.round(y/settings.gridYStep)*settings.gridYStep;
		y+=settings.gridYOffset;
	}
	actionsDictionary[settings.mode].move();	
}




downloadSVG=()=>{
	let style = `stroke:#00ff00;
			stroke-width:2;
			fill:transparent;`
	var eee = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="800" height="800" style="${style}"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   >${reality.innerHTML}</svg>`
	download(eee, "bruh.svg", "image/svg+xml")
}
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}