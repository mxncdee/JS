import Matrix from './matrix.js'

console.log("TETRIS.JS LOADED");

const screen = document.getElementById('screen');
const ctx = screen.getContext('2d');

const COLOR1='#00AA8D';
const COLOR2='#00BF9A';
const SCALE_F= 20;


//console.log(SCALE_F);


class Tetromino {
    constructor() {

        this.elements=new Matrix(4,4);
        this.elements.set(1,0,1);
        this.elements.set(1,1,0);
        this.elements.set(1,1,1);
        this.elements.set(1,2,1);
        this.pos ={
            x:10,
            y:5
        }
        this.color='red'
    }

    collideBoarders(cols){
        let collide = false;
        this.elements.forEach((v,x,y) => {
            if ((v !== 0) && 
                x+this.pos.x < 0 || 
                y+this.pos.x > cols){
                collide= true;
                return
                }
        })
        return collide;
    }

    collideBottom(rows) {
        let collide = false;
        this.elements.forEach((v,x,y) => {
            if (v !== 0 &&               
                y+this.pos.y >= rows){
                collide= true;
                return
                }
        })
        return collide;

    }


draw(ctx) {
    ctx.fillStyle=this.color;
    this.elements.forEach((v,x,y) => {
       // console.log(v,x,y);
        if(v !== 0){
            ctx.fillRect(x+this.pos.x,y+this.pos.y,1,1);
        }
    });
}
}

let t = new Tetromino();


ctx.scale(SCALE_F, SCALE_F);

function drawGameBoard(){


    // disegna le righe verdi
    for (let i = 0; i < screen.width/SCALE_F ; i++){
        // zona di gioco righe pari e dispari
        ctx.fillStyle = i % 2 === 0 ? COLOR1 : COLOR2;
        ctx.fillRect(i , 0, 1, screen.height/SCALE_F);
        //console.log(i);
    }

}

/*  ctx.fillStyle = 'green'; BLOCCO VERDE
    ctx.fillRect(5, 5, 1, 1);
*/

window.addEventListener('keyup', (event) => {
    console.log("UP", event.key)
})

window.addEventListener('keydown', (event) => {
    const {key} = event;
    // direzione in cui sto andando
    let direction =0;
    if (key === 'ArrowLeft'){
        direction = -1;
        } else if (key === 'ArrowRight'){
            direction = 1;
        }
        t.pos.x +=direction;
    //console.log(t.collideBoarders(screen.width(SCALE_F)))
    if (t.collideBoarders(screen.width / SCALE_F) && direction !== 0){
        console.log('COLLIDE')
        t.pos.x -= direction;
    }

       
    // non fa update verifica
    console.table(t.pos)
})

let lastTime=0;
//1 secondo per scendere, da usare per aumentare la difficoltà
let dropInterval = 1000; 
let lastDropDt=0;

function DropUpdate(dt){
    if (t.collideBottom(screen.height/SCALE_F)){
        t.pos.y=0;
    }
}

function update(time=0) {
    let dt= (time-lastTime);
    DropUpdate(dt);
    lastDropDt +=dt;
    if (lastDropDt > dropInterval){
        t.pos.y++;
        lastDropDt=0;
    }

    drawGameBoard();
    t.draw(ctx);
   //console.log(dt)
    lastTime=time;
    requestAnimationFrame(update);

}

update();


// elementi del tetris una matrice 4x4 (abbiamo 7 pezzi in totale)

/*
function forEachElement(el,cb){
    return () => {
        el.forEach((row,y) => {
            row.forEach((v,x)=> {
                cb(v,x,y);
            })
        })
    }

}

function drawElement2(el) {
    forEachElement(el,(v,x,y) => {
        // elementi disegnati 
        // console.log(v,x,y)
             if (v!==0){
                ctx.fillRect(x,y,1,1)
            }
        }); 
    }
*/

function drawElement(el){
    el.forEach((row,y)=> {
        row.forEach((v,x) => {
             if (v!==0){
                ctx.fillRect(x,y,1,1)
            }
        }); 
    });
}

//drawElement2(element);