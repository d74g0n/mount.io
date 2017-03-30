/* global Phaser */

// Project: Mount.io - main.js
// Author: d74g0n
// Dependancies: Phaser.js, gamepad.js
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
allgravity = 300;
//allgravity = 0;

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
        this.load.image('head', 'img/dhead.png');
        this.load.image('torso', 'img/torso.png');
        this.load.image('dong', 'img/dong.png');
        
        // Arms L/R Top/Bot
        this.load.image('lat', 'img/lat.png');
        this.load.image('lab', 'img/lab.png');
        this.load.image('rat', 'img/rat.png');
        this.load.image('rab', 'img/rab.png');
        
        // Legs L/R Top/Bot
        this.load.image('llt', 'img/llt.png');
        this.load.image('llb', 'img/llb.png');
        this.load.image('rlt', 'img/rlt.png');
        this.load.image('rlb', 'img/rlb.png');        
        
        // Xbox Buttons
        this.load.image('xa', 'img/xa.png');
        this.load.image('xb', 'img/xb.png');
        this.load.image('xx', 'img/xx.png');
        this.load.image('xy', 'img/xy.png');
        
        game.load.audio('xote1', 'img/xote2.mp3');
        game.load.audio('xote2', 'img/xote1.mp3');
}

function create() {
        // *Building Set
        this.background = this.game.add.sprite(0,0,'background'); // make background.
        this.background.scale.setTo(3);
        
        musicLoop = game.add.audio('xote1'); // add audio
        game.sound.setDecodedCallback(musicLoop, startTunes, this); // loop audio callbackness
   
        // *Physics Bootup
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = allgravity;
        
        // *Spawn Player
        createPlayer(540,360);
          
//        playerobj.setAll('inputEnabled', true); //allow ripoff of parts with mouse
//        playerobj.callAll('input.enableDrag', 'input');
    
        keyinputs = game.input.keyboard.createCursorKeys();

//        game.add.tween(playerobj.scale).to( {x: 1.1, y: 1.1}, 10000, Phaser.Easing.Back.InOut, true, 0, false).yoyo(true);

        // physics tweaks
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
//            xHand.body.setZeroVelocity();
//            xHand.body.mass = 1000;
            }

            if (equation[0].bodyB.parent.sprite.key = 'xy'){
//            yHand.body.setZeroVelocity();
//            yHand.body.mass = 1000;
            }
        
            if (equation[0].bodyB.parent.sprite.key = 'xa'){
//            aHand.body.setZeroVelocity();
//            aHand.body.mass = 1000;
            }

            if (equation[0].bodyB.parent.sprite.key = 'xb'){
//            bHand.body.setZeroVelocity();
//            bHand.body.mass = 1000;
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
    newPart.anchor.setTo(0.5,0.5);
    newPart.scale.setTo(1);
    game.physics.p2.enable(newPart, debugging);
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(torsoCollisionGroup);
    newPart.tint = uniTint;
                                                               pT = newPart; 
                                                               pT.body.mass = 1;
                                                               pT.body.moves = false;
    lastPart = newPart;
    // Head
    newPart = game.add.sprite(x, y, 'head');
    newPart.anchor.setTo(0.5,-1);
    newPart.scale.setTo(1);
    game.physics.p2.enable(newPart, debugging);
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
    newPart.tint = uniTint;
                                                             pH = newPart;
                                                             pH.body.mass = 1;
    game.physics.p2.createRevoluteConstraint(newPart, [0, 20], lastPart, [0, -50], maxForce);
    // Left Arm Top
    newPart = game.add.sprite(x-35, y-45, 'lat');
    newPart.scale.setTo(1);
    newPart.anchor.setTo(1,.5);
    game.physics.p2.enable(newPart, debugging);
    newPart.tint = uniTint;
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
    
    pLAT = newPart;
    pLAT.body.mass = 1;
    game.physics.p2.createRevoluteConstraint(newPart, [0, -35], lastPart, [-35, -40], maxForce); // constraint seem to be the actual positioning system.
    
    // Left bottom
    newPart = game.add.sprite(x, y, 'lab');
    newPart.scale.setTo(-1);
    newPart.anchor.setTo(-1,0.5);
    game.physics.p2.enable(newPart, debugging);
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                pLAB = newPart;
       newPart.tint = uniTint;                                  pLAB.body.mass = 1;                          
    game.physics.p2.createRevoluteConstraint(newPart, [0,30], pLAT, [0, 40], maxForce); //constraint is last operation of each body piece
       
        // Left Hand
    newPart = game.add.sprite(x, y, 'xx');
    newPart.scale.setTo(0.05);
    newPart.anchor.setTo(0.5,0.5);
    game.physics.p2.enable(newPart, debugging);
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                xHand = newPart;
    game.physics.p2.createRevoluteConstraint(newPart, [0,0], pLAB, [0, -40], maxForce);
    
    // Right Arm top
    newPart = game.add.sprite(x+50, y-20, 'rat');
    newPart.scale.setTo(1);
    newPart.anchor.setTo(0.5,1);
    game.physics.p2.enable(newPart, debugging);
        newPart.tint = uniTint;
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                pRAT = newPart;
                                                                pRAT.body.mass = 1;
    game.physics.p2.createRevoluteConstraint(newPart, [0,-35], lastPart, [35, -40], maxForce);

    //right arm bottom
    newPart = game.add.sprite(x+50, y-20, 'rab');
    newPart.scale.setTo(-1);
    newPart.anchor.setTo(0.5,1);
    game.physics.p2.enable(newPart, debugging);
        newPart.tint = uniTint;
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                pRAB = newPart;
                                                                pRAB.body.mass = 1;
    game.physics.p2.createRevoluteConstraint(newPart, [0, 35], pRAT, [0, 40], maxForce);
    
    // Right Hand
    newPart = game.add.sprite(x, y, 'xa');
    newPart.scale.setTo(0.05);
    newPart.anchor.setTo(0.5,0.5);
    game.physics.p2.enable(newPart, debugging);
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                aHand = newPart;
    game.physics.p2.createRevoluteConstraint(newPart, [0, 0], pRAB, [0, -40], maxForce);
    
    // Left Leg Top
    newPart = game.add.sprite(x-20, y+40, 'llt');
    newPart.scale.setTo(1);
    newPart.anchor.setTo(0.5,1);
    game.physics.p2.enable(newPart, debugging);
        newPart.tint = uniTint;
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                pLLT = newPart;
                                                                pLLT.body.mass = 1;
    game.physics.p2.createRevoluteConstraint(newPart, [0, -25], lastPart, [-35, 40], maxForce);
    
    // Left Leg Bottom
        newPart = game.add.sprite(x-20, y+40, 'llb');
    newPart.scale.setTo(1);
    newPart.anchor.setTo(0.5,1);
    game.physics.p2.enable(newPart, debugging);
        newPart.tint = uniTint;
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                pLLB = newPart;
                                                                pLLB.body.mass = 1;
    game.physics.p2.createRevoluteConstraint(newPart, [0, -25], pLLT, [0, 25], maxForce);
    
    // Left Foot YBUTTON
    newPart = game.add.sprite(x, y, 'xy');
    newPart.scale.setTo(0.05);
    newPart.anchor.setTo(0.5,0.5);
    game.physics.p2.enable(newPart, debugging);
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                yHand = newPart;
    game.physics.p2.createRevoluteConstraint(newPart, [0, 0], pLLB, [0, 35], maxForce);
    
    
    // Right Leg top
    newPart = game.add.sprite(x+25, y+40, 'rlt');
    newPart.scale.setTo(1);
    newPart.anchor.setTo(0.5,1);
    game.physics.p2.enable(newPart, debugging);
        newPart.tint = uniTint;
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                pRLT = newPart;
                                                                pRLT.body.mass = 1;
    game.physics.p2.createRevoluteConstraint(newPart, [0, -25], lastPart, [+35, 40], maxForce);
    
    //right leg bottom
        newPart = game.add.sprite(x-20, y+40, 'rlb');
    newPart.scale.setTo(1);
    newPart.anchor.setTo(0.5,1);
    game.physics.p2.enable(newPart, debugging);
        newPart.tint = uniTint;
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                pRLB = newPart;
                                                                pRLB.body.mass = 1;
    game.physics.p2.createRevoluteConstraint(newPart, [0, -25], pRLT, [0, 25], maxForce);
     
    
    //Right Foot/Hand
    newPart = game.add.sprite(x, y, 'xb');
    newPart.scale.setTo(0.05);
    newPart.anchor.setTo(0.5,0.5);
    game.physics.p2.enable(newPart, debugging);
    newPart.body.collideWorldBounds = true;
    newPart.body.setCollisionGroup(limbCollisionGroup);
                                                                bHand = newPart;
                                                                
    game.physics.p2.createRevoluteConstraint(newPart, [0, 0], pRLB, [0, 35], maxForce);

xHand.body.fixedRotation = true;
yHand.body.fixedRotation = true;
bHand.body.fixedRotation = true;
aHand.body.fixedRotation = true;

xHand.restitution = 0.1;
yHand.restitution = 0.1;
bHand.restitution = 0.1;
aHand.restitution = 0.1;
    
} // end of createplayer()

function dotheliftmove (limb) {
    
    limb.body.velocity.x = vforce * -axeLx * 0.8; //picks up off ground. (could use collider logic)
    limb.body.velocity.y = vforce * -axeLy * 0.8; 
    
}

function updatePlayer () {
//    
//    stoplogospin();
    
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
    //Xbox Controller button Graphic Stabilizer
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
