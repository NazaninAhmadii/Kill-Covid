/***********************************************************
 * ******************** DOM Objects ************************
 * *********************************************************
 */
const ctr = myCanvas.getContext("2d");
let momImg = document.getElementById("mom");
let babylImg = document.getElementById("babyl");
let rewardImg = document.getElementById("reward");
let covidImg = document.getElementById("covid");
let food1Img = document.getElementById("food1");
let food2Img = document.getElementById("food2");
let food3Img = document.getElementById("food3");
let babyCryImg = document.getElementById("babycry");
let fightImg = document.getElementById("fight");
let lblAlert = document.getElementById("alertlbl");
let lblFood = document.getElementById("foodlbl");
let lblReward = document.getElementById("rewardlbl");
let lblVirus = document.getElementById("viruslbl");
let lblBabyBul = document.getElementById("babybulletlbl");

/***********************************************************
 * **************** Variable Definition*********************
 * *********************************************************
 */
const stepMax = 8;
const stepMin = 3;
const itemArr =[];
const bulletArr = [];
let foodImgArr = [food1Img, food2Img, food3Img];
let changeDirection = false;
let babyalive = true;


/***********************************************************
 * ********************* Functions *************************
 * *********************************************************
 */
const clearScreen = () => {
    ctr.clearRect (0, 0, myCanvas.width, myCanvas.height);
    reDraw();
}

const reDraw = () => {
    Nazanin.drawPlayer();
    if (babyalive=== true) {
        Baby.drawPlayer();
        Baby.movement();
    }
    

    let pX = Nazanin.xPos;
    let pY = Nazanin.yPos;
    let pSize = Nazanin.size;

    let bX = Baby.xPos;
    let bY = Baby.yPos;
    let bSize = Baby.size;
     
      
    for(let i=0; i< itemArr.length; i++){
        let iX = itemArr[i].xPos;
        let iY = itemArr[i].yPos;
        let iSize = itemArr[i].size;

        // Player collaps with Items
        if(pX < iX + iSize && pX + pSize > iX && pY < iY + iSize && pY + pSize > iY ){

            if(typeof(itemArr[i]) !== 'undefined') { 
                if(itemArr[i].type == 'covid') {
                    Nazanin.virus += 1;
                    lblVirus.innerHTML = `Virus: ${Nazanin.virus}`;
                    if(Nazanin.virus >= 3) {
                        alert("Oops!!! You Got Virus, Game is Over!");
                        location.reload();
                    }
                    // console.log('Virus is '+ Nazanin.virus);
                    if(itemArr[i].covidNum === 19) {
                        alert("Oops!!! You Got Covid-19, Game is Over!");
                        location.reload();
                    }
                    itemArr.splice(i, 1);
                }

                if(itemArr[i].type == 'food') {
                    Nazanin.food += 1;
                    lblFood.innerHTML = `Food: ${Nazanin.food}`;
                    itemArr.splice(i, 1);
                }

                if(itemArr[i].type == 'reward') {
                    Nazanin.reward += itemArr[i].reward;
                    lblReward.innerHTML = `Reward: ${Nazanin.reward}`;
                    if(Nazanin.reward >= 500) {
                        Nazanin.reward -= 500;
                        Nazanin.virus -= 1;
                        lblReward.innerHTML = `Reward: ${Nazanin.reward}`;
                        lblVirus.innerHTML = `Virus: ${Nazanin.virus}`;
                    }
                    itemArr.splice(i, 1);
                }
                
            } else {
                itemArr.splice(i, 1);
            }
          
        }
        if(iY > myCanvas.height){
            itemArr.splice(i, 1);
        }

        // Baby Collapse with COVID
        if(bX < iX + iSize && bX + bSize > iX && bY < iY + iSize && bY + bSize > iY ){
            if(typeof(itemArr[i]) !== 'undefined') { 
                if(itemArr[i].type == 'covid') {
                    alert("Oops!!! Baby Got Virus, Game is Over!");
                    location.reload();
                }

                if(itemArr[i].type == 'food') {
                    Baby.image = babylImg;
                    Baby.size = 50;
                    itemArr.splice(i, 1);
                }
                
            } else {
                itemArr.splice(i, 1);
            }
        } 

        itemArr[i].drawItem();


        // Shoot Bullet
        for(let j=0; j< bulletArr.length; j++) {
            let jX = bulletArr[j].xPos;
            let jY = bulletArr[j].yPos;
            let jSize = bulletArr[j].size;
            if(iX < jX + jSize && iX + iSize > jX && iY < jY + jSize && iY + iSize > jY ){
                itemArr.splice(i, 1);
                bulletArr.splice(j, 1);
                // console.log("collapsed");
            }
             
            bulletArr[j].drawItem();
            if(jY< 0) {
                bulletArr.splice(j, 1);
            }
           
        }
    }
}



/***********************************************************
 * **************** Object Definitions *********************
 * *********************************************************
 */

class Player {
    constructor ( x,y,size,step, image ) {
        this.xPos = x;
        this.yPos = y;
        this.size = size;
        this.step = step;
        this.image= image
    }

    drawPlayer() { 
        ctr.drawImage(this.image, this.xPos, this.yPos, this.size, this.size);
    }

    init () {
        this.drawPlayer();
    }
}

class Mom extends Player {
    constructor(x,y,size,step, image) {
        super(x,y,size,step, image);
        this.virus = 0;
        this.food = 5;
        this.reward = 0;
    }

    movement ( dir ) {
        if( dir === 37 ) { // move left
            if(this.xPos - this.step < 0) {
                this.xPos = 0;
            } else {
                this.xPos -= this.step;
            }
        } else if( dir === 39 ) { // move right
            if( this.xPos + this.step + this.size > myCanvas.width ) {
                this.xPos = myCanvas.width - this.size;
            } else {
                this.xPos += this.step;
            }
        } else if ( dir === 38 ) { // move up 
            if( this.yPos - this.step < (myCanvas.height / 2) ) {
                this.yPos = (myCanvas.height / 2);
            } else {
                this.yPos -= this.step;
            }
        } else if ( dir === 40 ) { // move down
            if( this.yPos + this.step + this.size > (myCanvas.height - 120) ) {
                this.yPos = myCanvas.height - 120; 
            } else {
                 this.yPos += this.step;
            }
        }

        clearScreen();
    }

    init () {
        super.init();

        const codeset = {13: false, 37:false, 38: false, 39:false, 40: false}
        window.addEventListener('keydown' ,function(e) {
            if (e.keyCode in codeset) {
                codeset[e.keyCode] = true;
                if(codeset[13]){
                    const bullet = new Bullet();
                    bullet.xPos = this.xPos + 25;
                    bullet.yPos = this.yPos - bullet.size;
                    bullet.drawItem();
                    bulletArr.push(bullet);
                    
                }
                if(codeset[37] || codeset [38] || codeset[39] || codeset[40]) {
                    this.movement(e.keyCode);
                }
                codeset[e.keyCode] = false;
            }
        }.bind(this));

        
    }
}


class Kid extends Player {
    constructor(x,y,size,step, image) {
        super(x,y,size,step, image);
        this.bulletCount = 3;
    }

    movement() {
        if(Baby.xPos + Baby.step + Baby.size > myCanvas.width ){
            changeDirection = true;
        } else if (Baby.xPos <= 0 ) {
            changeDirection = false;
        }
        if(Baby.xPos + Baby.step + Baby.size >= 0 && changeDirection == false) {
                Baby.xPos += Baby.step;
        } else if (changeDirection == true) {
                Baby.xPos -= Baby.step;
        }
        
    }

    init () {
        super.init();
        lblBabyBul.innerHTML = `Baby Bullet: ${this.bulletCount}`;
        const bcodeset = {32:false}
        window.addEventListener('keydown' ,function(e) {
            if (e.keyCode in bcodeset && this.bulletCount>0) {
                bcodeset[e.keyCode] = true;
                console.log(e.keyCode);
                if(bcodeset[32]) {
                    const bullet = new Bullet();
                    bullet.xPos = this.xPos + 25;
                    bullet.yPos = this.yPos - bullet.size;
                    bullet.drawItem();
                    bulletArr.push(bullet);
                    this.bulletCount -=1;
                    lblBabyBul.innerHTML = `Baby Bullet: ${this.bulletCount}`;
                }
                bcodeset[e.keyCode] = false;
            }
        }.bind(this));

        
    }
}





class Item {
    constructor(size, image, type) {
        this.yPos = 0;
        this.size = size;
        this.image = image;
        this.type = type;
        this.xPos = Math.floor(Math.random()*(myCanvas.width - this.size));
        this.step = Math.floor(Math.random() * (stepMax - stepMin + 1)) + stepMin;
    }

    moveDown() {
        this.yPos += this.step;
    }

    drawItem() {
        ctr.drawImage(this.image, this.xPos, this.yPos, this.size, this.size);
    }
}

class Reward extends Item {
    constructor(){
        super(30, rewardImg, 'reward');
        this.reward = this.pickReward(); 
    }

    pickReward() {
        const rewards = [200, 50, 20, 10, 5];
        const prob = Math.floor(Math.random() * rewards.length );
        return rewards[prob];
    }
}


class COVID extends Item {
    constructor() {
        super(40, covidImg, 'covid');
        this.covidNum = this.pickCovidNum();
    }

    pickCovidNum() {
        const covidNum = [10,17,18,19];
        const prob = Math.floor(Math.random() * covidNum.length );
        return covidNum[prob];
    }
}

class Food extends Item {
    constructor(image) {
        super(35, image, 'food');
    }
}

class Bullet extends Item {
    constructor() {
        super(20, fightImg, 'bullet');
        
    }

    moveUp() {
        this.yPos -= this.size;
    }
}

/***********************************************************
 * ***************** initiate Objects **********************
 * *********************************************************
 */
const Nazanin = new Mom(100, 580, 80, 32, momImg);
Nazanin.init();

const Baby = new Kid(0, 650, 50, 5, babylImg);
Baby.init();


lblVirus.innerHTML = `Virus: ${Nazanin.virus}`;
lblFood.innerHTML = `Food: ${Nazanin.food}`;
lblReward.innerHTML = `Reward: ${Nazanin.reward}`;


/***********************************************************
 * ******************* SetIntervals  ***********************
 * *********************************************************
 */
setInterval(() => {
    const prob = Math.floor(Math.random() * 10);
    if(prob <2) {
        itemArr.push( new Reward);
    } else if (prob>=2 && prob<5) {
        const foodi = Math.floor(Math.random() * 3) + 0;
        itemArr.push( new Food(foodImgArr[foodi]));
    } else {
        itemArr.push( new COVID);
    }
},800);

setInterval(() =>{ // we move items by it by loop through the array of objects we made in previouse setInterval
    for( let i=0; i < itemArr.length; i++) {
        itemArr[i].moveDown();
    }
    for( let j=0; j < bulletArr.length; j++) {
        bulletArr[j].moveUp();
    }

    clearScreen();
}, 100);

setInterval(() =>{ // consume the Food
   if (Nazanin.food>=1 && babyalive===true) {
    Nazanin.food -=1;
    Baby.image = babylImg;
    Baby.size = 50;
    lblAlert.innerHTML = "";
    lblFood.innerHTML = `Food: ${Nazanin.food}`;
   }
}, 2000);

setInterval(() =>{ // Baby Cries when get hungry
    if (Nazanin.food <= 0 && babyalive===true) {
        lblFood.innerHTML = `Food: ${Nazanin.food}`;
        Baby.image = babyCryImg;
        Baby.size = 55;
        lblAlert.innerHTML = "Baby is Hungry and Crying!";
    }
 }, 10000);




 /***********************************************************
 * ********************* Service worker *********************
 * **********************************************************
 */

 // does the browser support service workers?
 if ('serviceWorker' in navigator) {
    // fires when the service worker is ready
    navigator.serviceWorker.ready.then(reg => {
      // we have an active service worker working for us
      console.log(`Service Worker ready (Scope: ${reg.scope})`);
      // do something interesting, if you want...

    });
    // then register our service worker
    navigator.serviceWorker.register('./sw.js', { scope: '/Kill-Covid/' })
      .then(function (reg) {
        // display a success message
        console.log(`Service Worker Registration (Scope: ${reg.scope})`);
      })
      .catch(function (error) {
        // display an error message
        console.log(`Service Worker Error (${error})`);
      });
  } else {
    // happens when the app isn't served over a TLS connection (HTTPS)
    console.warn('Service Worker not available');
  }



///Image References
/// https://favpng.com/png_view/cartoon-baby-fever-baby-hospital-fever-disease-icon-png/4WVJUVfN
/// https://favpng.com/png_view/cartoon-baby-tummy-infant-face-child-clip-art-png/MUpWb8DC
/// https://favpng.com/png_view/food-vegetables-chinese-noodles-noodle-soup-namul-lamian-food-png/XcyeX012
/// https://emojiisland.com/pages/download-page?download=true&file=https://cdn.shopify.com/s/files/1/1061/1924/files/Slice_Of_Pizza_Emoji.png?9898922749706957214&name=Slice%20of%20Pizza%20Emoji
/// https://emojiisland.com/pages/download-page?download=true&file=https://cdn.shopify.com/s/files/1/1061/1924/files/Cheese_Burger_Emoji.png?9898922749706957214&name=Cheese%20Burger%20Emoji
/// iemoji.com/view/emoji/2780/skin-tones/woman-supervillain-medium-light-skin-tone
/// https://emojiisland.com/pages/download-page?download=true&file=https://cdn.shopify.com/s/files/1/1061/1924/files/Money_Emoji_Icon.png?11214052019865124406&name=Money%20Emoji%20[Free%20Download%20Money%20Face%20Emoji]
/// https://www.vecteezy.com/vector-art/204287-white-metallic-texture-background
/// Image by <a href="https://pixabay.com/users/iXimus-2352783/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4931132">Vektor Kunst iXimus</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4931132">Pixabay</a>
/// Image by <a href="https://pixabay.com/users/sergeitokmakov-3426571/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4886885">Sergei Tokmakov</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4886885">Pixabay</a>
/// Image by <a href="https://pixabay.com/users/CryptoSkylark-12887619/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4653401">CryptoSkylark</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4653401">Pixabay</a>
/// https://www.freepngimg.com/png/20084-batgirl-transparent