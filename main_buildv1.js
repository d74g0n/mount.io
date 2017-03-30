/* global Phaser */

// Project: Mount.io - main.js
// Author: d74g0n
// Dependancies: Phaser
// Desc: Main file of mount your friends clone + socket.io

var game = new Phaser.Game(1920,720, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var keyinputs;
var playerobj;
var gp = navigator.getGamepads()[0];

var lastPart;
var forcebase;
var maxForce = 20000000;
var result;
var allgravity = 1400;
allgravity = 600;
var vforce = 200; //weak
    vforce = 500;

var musicLoop;

//var debugging = true;
var debugging = false;

var debug01;
var debug02;

var xHand;
var aHand;
var yHand;
var bHand;

var aStuck = false;
var xStuck = false;
var bStuck = false;
var yStuck = false;
var xHx;
var xHy;

// playerobj body parts:
var pT; // torso
var pH; // head
var pLA; // left arm
var pRA; // right arm
var pLL; // left leg
var pRL; // right leg

function preload() {
        this.load.image('background', 'img/bg02.png');
        this.load.image('head', 'img/head.png');
        this.load.image('torso', 'img/torso.png');
        this.load.image('innerlimb', 'img/innerlimb.png');
        this.load.image('xa', 'img/xa.png');
        this.load.image('xb', 'img/xb.png');
        this.load.image('xx', 'img/xx.png');
        this.load.image('xy', 'img/xy.png');
        
        game.load.audio('xote1', 'img/xote2.mp3');
        game.load.audio('xote2', 'img/xote1.mp3');
}

function create() {
        this.background = this.game.add.sprite(0,0,'background');
        this.background.scale.setTo(3);
        
        musicLoop = game.add.audio('xote1');
        game.sound.setDecodedCallback(musicLoop, startTunes, this);
        
        
        
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = allgravity;

        createPlayer(540,360);
          
//        playerobj.setAll('inputEnabled', true); //allow ripoff of parts with mouse
//        playerobj.callAll('input.enableDrag', 'input');
    
        keyinputs = game.input.keyboard.createCursorKeys();

//        game.add.tween(playerobj.scale).to( {x: 1.1, y: 1.1}, 10000, Phaser.Easing.Back.InOut, true, 0, false).yoyo(true);


        game.physics.p2.restitution = 0.8;
        game.physics.p2.friction = 500;
        game.physics.p2.updateBoundsCollisionGroup(); //bounds collide all.
        // collider logic:
        xHand.body.onBeginContact.add(xHit, this);
        yHand.body.onBeginContact.add(xHit, this);
        aHand.body.onBeginContact.add(xHit, this);
        bHand.body.onBeginContact.add(xHit, this);
}

function xHit (body, bodyB, shapeA, shapeB, equation) {

    debug01 = equation[0].bodyA.parent;
    debug02 = equation[0].bodyB.parent.sprite.key; // this is the image key of what touched.

        if (body)
        {
            result = 'You last hit: ' + body.sprite.key;
        }
        else
        {
            result = 'world contact!'; //DEBUG ME NOT WORKING RIGHT

            if (equation[0].bodyB.parent.sprite.key = 'xx'){
            xHand.body.setZeroVelocity();
            xHand.body.mass = 1000;
            }

            if (equation[0].bodyB.parent.sprite.key = 'xy'){
            yHand.body.setZeroVelocity();
            yHand.body.mass = 1000;
            }
        
            if (equation[0].bodyB.parent.sprite.key = 'xa'){
            aHand.body.setZeroVelocity();
            aHand.body.mass = 1000;
            }

            if (equation[0].bodyB.parent.sprite.key = 'xb'){
            bHand.body.setZeroVelocity();
            bHand.body.mass = 1000;
            }

    
    }
    
}

function startTunes() {
//    musicLoop.loop = true;
//    musicLoop.play();
}


function update() {
      
    pollinputs(); //read controller axis variables
    updatePlayer(); //apply forces
    
    straightenhead(); // VANITY
    
}

function createPlayer(x,y){
 var torsoCollisionGroup = game.physics.p2.createCollisionGroup(); //still unused kinda?
 var limbCollisionGroup = game.physics.p2.createCollisionGroup();  // seperates them from eachother tho so half used?

 var uniTint = Math.random() * 0xffffff;
// var height = 20;
// var width = 16; 
    //Torso
    newPart = game.add.sprite(x, y, 'torso', 1);
    newPart.anchor.setTo(0.5,1);
    newPart.scale.setTo(0.5);
    game.physics.p2.enable(newPart, debugging);
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(torsoCollisionGroup);
    newPart.tint = Math.random() * 0xffffff;
                                                               pT = newPart; 
                                                               pT.body.mass = 1;
    lastPart = newPart;
    // Head
    newPart = game.add.sprite(x, y, 'head');
    newPart.anchor.setTo(0.5,-1);
    newPart.scale.setTo(0.5);
    game.physics.p2.enable(newPart, debugging);
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                             pH = newPart;
                                                             pH.body.mass = 1;
    game.physics.p2.createRevoluteConstraint(newPart, [0, 20], lastPart, [0, -50], maxForce);
    // Left Arm
    newPart = game.add.sprite(x-45, y-20, 'innerlimb');
    newPart.scale.setTo(0.5);
    newPart.anchor.setTo(0.5,1);
    game.physics.p2.enable(newPart, debugging);
    
    newPart.body.collideWorldBounds = true;
    
    newPart.body.setCollisionGroup(limbCollisionGroup);
    
                                                            pLA = newPart;
                                                            pLA.body.mass = 1;
    game.physics.p2.createRevoluteConstraint(newPart, [0, -35], lastPart, [-45, -20], maxForce);
    // Left Hand
    newPart = game.add.sprite(x, y, 'xx');
    newPart.scale.setTo(0.05);
    newPart.anchor.setTo(0.5,0.5);
    game.physics.p2.enable(newPart, debugging);
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                xHand = newPart;
                                                                
    game.physics.p2.createRevoluteConstraint(newPart, [0, 0], pLA, [0, 35], maxForce);
    // Right Arm 
    newPart = game.add.sprite(x+50, y-20, 'innerlimb');
    newPart.scale.setTo(0.5);
    newPart.anchor.setTo(0.5,1);
    game.physics.p2.enable(newPart, debugging);
    
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                pRA = newPart;
                                                                pRA.body.mass = 1;
    game.physics.p2.createRevoluteConstraint(newPart, [0, -35], lastPart, [45, -20], maxForce);
    // Right Hand
    newPart = game.add.sprite(x, y, 'xa');
    newPart.scale.setTo(0.05);
    newPart.anchor.setTo(0.5,0.5);
    game.physics.p2.enable(newPart, debugging);
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                aHand = newPart;
    game.physics.p2.createRevoluteConstraint(newPart, [0, 0], pRA, [0, 35], maxForce);
    // Left Leg
    newPart = game.add.sprite(x-20, y+40, 'innerlimb');
    newPart.scale.setTo(0.5);
    newPart.anchor.setTo(0.5,1);
    game.physics.p2.enable(newPart, debugging);
    
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                pLL = newPart;
                                                                pLL.body.mass = 1;
    game.physics.p2.createRevoluteConstraint(newPart, [0, -35], lastPart, [-20, 40], maxForce);
    // Left Foot/Hand
    newPart = game.add.sprite(x, y, 'xy');
    newPart.scale.setTo(0.05);
    newPart.anchor.setTo(0.5,0.5);
    game.physics.p2.enable(newPart, debugging);
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                yHand = newPart;
    game.physics.p2.createRevoluteConstraint(newPart, [0, 0], pLL, [0, 35], maxForce);
    // Right Leg
    newPart = game.add.sprite(x+25, y+40, 'innerlimb');
    newPart.scale.setTo(0.5);
    newPart.anchor.setTo(0.5,1);
    game.physics.p2.enable(newPart, debugging);
    
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                pRL = newPart;
                                                                pRL.body.mass = 1;
    game.physics.p2.createRevoluteConstraint(newPart, [0, -35], lastPart, [+25, 40], maxForce);
    //Right Foot/Hand
    newPart = game.add.sprite(x, y, 'xb');
    newPart.scale.setTo(0.05);
    newPart.anchor.setTo(0.5,0.5);
    game.physics.p2.enable(newPart, debugging);
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                bHand = newPart;
                                                                
    game.physics.p2.createRevoluteConstraint(newPart, [0, 0], pRL, [0, 35], maxForce);
    
//    pH.body.mass = 0.05;
//    pT.body.mass = 0.05;
  
    
} // end of createplayer()

function dotheliftmove (limb) {
    
    limb.body.velocity.x = vforce * -axeLx * 0.8; //picks up off ground. (could use collider logic)
    limb.body.velocity.y = vforce * -axeLy * 0.8; 
    
}

function updatePlayer () {
    
    stoplogospin();
    
       var gp = navigator.getGamepads()[0];
       
        if (gp.buttons[0].pressed) { //A aHand right of pRA right arm
        aHand.body.mass = 1;       
        aHand.body.velocity.x = vforce * axeLx; 
        aHand.body.velocity.y = vforce * axeLy; 
               
               if (gp.buttons[4].pressed){
                       dotheliftmove(pRA);
                }
        }
        // B = 1
        // y = 3
        if (gp.buttons[2].pressed) { //X xHand left of pLA left arm
            xHand.body.mass = 1;
            xHand.body.velocity.x = vforce * axeLx; 
            xHand.body.velocity.y = vforce * axeLy;
                
               if (gp.buttons[4].pressed){
                       dotheliftmove(pLA);
                }
        }
        
        if (gp.buttons[3].pressed) { //Y yHand left of pLL left leg
            yHand.body.mass = 1;
            yHand.body.velocity.x = vforce * axeLx; 
            yHand.body.velocity.y = vforce * axeLy;
                
               if (gp.buttons[4].pressed){
                       dotheliftmove(pLL);
                }
        }
        if (gp.buttons[1].pressed) { //X xHand right of pRL right leg
            bHand.body.mass = 1;        
            bHand.body.velocity.x = vforce * axeLx; 
            bHand.body.velocity.y = vforce * axeLy;
                
               if (gp.buttons[4].pressed){
                       dotheliftmove(pRL);
                }
        }
//        if (gp.buttons[9].pressed) {
//             
//             if (game.paused){
//                 game.paused = false;
//                 xStuck = false;
//            }else{
//                 game.paused = true;
//                 xStuck = true;
//            }
//        }
}

function pollinputs () {
  // update axes variables
    axeLx = gp.axes[0];
    axeLy = gp.axes[1];
    axeRx = gp.axes[2];
    axeRy = gp.axes[3];
}

function render () { // Last stop before screen.
    if (debugging){
        debugreadout(10,25);
    }
}

function straightenhead () {
    pH.body.rotation = 0;
 }

function stoplogospin () {
    //Xbox Control Graphic Stabilizer
    xHand.body.rotation = 0;
    yHand.body.rotation = 0;
    bHand.body.rotation = 0;
    aHand.body.rotation = 0;
}

function debugreadout (dx,dy) {
   
   var ox = dx;
   var oy = dy;
   var vspacer = 20;
   var hspacer = 340;
    
   var gp = navigator.getGamepads()[0];
   game.debug.text('0 L Analog X:'+axeLx, dx, dy); 
   game.debug.text('1 L Analog Y:'+axeLy, dx, dy+= vspacer);     
   game.debug.text('2 R Analog X:'+axeRx, dx, dy+= vspacer); 
   game.debug.text('3 R Analog Y:'+axeRy, dx, dy+= vspacer);     
   game.debug.text('-=-=-=-=-=-[Controller]=-=-=-=-=-=-', dx, dy+= vspacer); 
   game.debug.text('hRot:'+ pH.body.rotation, dx+ hspacer, dy=oy); 
   game.debug.text('xHx:'+ xHx, dx+ hspacer, dy+= vspacer); 
   game.debug.text('xHy:'+ xHy, dx+ hspacer, dy+= vspacer); 
   game.debug.text('xStuck:'+ xStuck, dx+ hspacer, dy+= vspacer); 
   game.debug.text('-=-=-=-=-=-[xCollision]=-=-=-=-=-=-', dx+ hspacer, dy+= vspacer); 
   
   game.debug.text('COL1:'+ debug01, dx+ hspacer, dy+= vspacer); 
   game.debug.text('COL2:'+ debug02, dx+ hspacer, dy+= vspacer); 
}  
