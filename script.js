var canvas=null,ctx=null,c,r,flag=0;
var h=320, w=485;  //canvas  height and width
var radius=8,count=0,score=0,lives=3;
var velx=2, vely=-2;
var paddleHeight=10, paddleWidth=75, paddleX=(w-paddleWidth)/2;  //starting point on X axis (centre)
var rkey=false, lkey=false;
var brickRow=5, brickCol=6, brickWidth=75, brickHeight=15, brickPadding=5,brickX,brickY,b;
//brickOffsetTop=0, brickOffsetLeft=0
var x=paddleX+paddleWidth/2, y=h-paddleHeight-radius;  //initial position of ball
//bricks will be stored in a 2D array
var bricks = [];
var relativeX;

$(document).ready(function(){
    
    setup();
    
    draw();
//    setInterval(draw, 12);//runs the function every 25 milliseconds
//    

    var strt=document.getElementById('start');
    var pau=document.getElementById('pause');
    strt.addEventListener("click", function(){if(flag==0){flag=1; draw();}}, false);
    pau.addEventListener("click", function(){flag=0;}, false);
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);   
    document.addEventListener("mousemove", mouseMoveHandler, false);   
    
});

function setup(){
    
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext("2d");
    canvas.height=320;
    canvas.width=485;
    flag=0;
    bricksetup();
    
}

function bricksetup(){
    
    for(c=0; c<brickCol; c++) {
        
        bricks[c] = [];
        
        for(r=0; r<brickRow; r++) {
       
            bricks[c][r] = { x: 0, y: 0, status: 1 };   //status is for marking whether we want to paint that brick or not
            
            if(count%4==0){
                bricks[c][r].color="yellow";
            }
            else if(count%4==1){
                bricks[c][r].color="green";
            }
            else if(count%4==2){
                bricks[c][r].color="crimson";
            }
            else if(count%4==3){
                bricks[c][r].color="orange";
            }
            count++;
            
        }
    }
    
}

function drawBall(){
    
    ctx.beginPath();
    ctx.arc(x,y,radius,0,2*Math.PI);
    ctx.fillStyle="red";
    ctx.fill();
    ctx.closePath();
    
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX,h-paddleHeight,paddleWidth,paddleHeight);
    ctx.fillStyle = "teal";
    ctx.fill();
    ctx.closePath();
}

function drawBricks(){
    
    for(c=0;c<brickCol;c++){
        
        for(r=0;r<brickRow;r++){
            
            if(bricks[c][r].status == 1){
                
                brickX = (c*(brickWidth+brickPadding))+brickPadding;
                brickY = (r*(brickHeight+brickPadding))+brickPadding;
                bricks[c][r].x=brickX;
                bricks[c][r].y=brickY;
                ctx.beginPath();
                ctx.rect(brickX,brickY,brickWidth,brickHeight);
                ctx.fillStyle=bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
                
            }
            
        }
        
    }
    
}

function drawScore(){
    
    ctx.font="16px Helvetica";
    ctx.fillStyle="White";
    ctx.fillText("Score : "+score,8,h-8);
    
}

function drawLives(){
    
    ctx.font="16px Helvetica";
    ctx.fillStyle="White";
    ctx.fillText("Lives : "+lives,w-67,h-8);
    
}

function collision(){
    
    for(c=0;c<brickCol;c++){
        
        for(r=0;r<brickRow;r++){
            
            b=bricks[c][r];
            //all 4 of these conditions should be satisfied for changing direction when collision takes place
            
            if(b.status==1){
                
                if(x>=b.x-(brickPadding/2) && x<=b.x+brickWidth+(brickPadding/2)){
                    
                    if(y-radius==b.y+brickHeight || y+radius==b.y){
                        
                        vely=-vely;
                        b.status=0;
                        score++;
                        
                        if(score==brickRow*brickCol){
                            
                            alert("You Win, Congratulations!");
                            document.location.reload();
                            
                        }
                        
                    }
                    
                }
                
            }
            
        }
        
    }
    
}

function draw(){
    
    ctx.clearRect(0,0,w,h);
    drawBall();
    drawPaddle();
    drawBricks();
    collision();
    drawScore();
    drawLives();
    
    x+=velx;
    y+=vely;
    
    if(x + velx > w-radius || x + velx < radius) {
        velx = -velx;
    }

    if(y + vely < radius ) {
        vely = -vely;
    }
    
    else if(y+vely==h-radius-paddleHeight && x>=paddleX && x<=paddleX+paddleWidth){
        
        vely=-vely;
        
    }
        
    else if(y+vely>h-radius){
        
//        alert("Game Over");
//        document.location.reload();     //reload page
        
        lives--;
        flag=0;
        if(lives==0){
            
            alert("Game Over. Your Score is : "+score);
            document.location.reload();
            score=0;
            
        }
        
        else{
            
            paddleX=(w-paddleWidth)/2;
            x=paddleX+paddleWidth/2;
            y=h-paddleHeight-radius;
            velx=2;
            vely=-2;
            
        }
        
    }
        
    
    if(rkey && paddleX<w-paddleWidth-5) {
        paddleX+= 3;
    }
    
    else if(lkey && paddleX>5) {
        paddleX-= 3;
    }
    
    if(flag==1){
        
        requestAnimationFrame(draw);
        
    }
    
}

function keyDownHandler(e) {
    // 37 for left key
    // 39 for right key
    if(e.keyCode == 39) {
        rkey = true;
    }
    else if(e.keyCode == 37) {
        lkey = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rkey = false;
    }
    else if(e.keyCode == 37) {
        lkey = false;
    }
}

function mouseMoveHandler(e){
    
//    clientX property returns the horizontal coordinate
//    clientY property returns the vertical coordinate
//    var x = event.clientX;     // Get the horizontal coordinate
//    var y = event.clientY;     // Get the vertical coordinate
//    relativeX is equal to relative horizontal posn of mouse pointer
    
//    relativeX=e.clientX;
    relativeX=e.clientX-canvas.offsetLeft;
    
    if(relativeX>paddleWidth/2 && relativeX+paddleWidth/2<canvas.width){
        
//        paddleX=relativeX;
        paddleX=relativeX-paddleWidth/2;
        
    }
    
}