'use strict';
console.log('I am in the general funstions file');
//print the output given to the console.log
function cl(msg) {
    console.log(msg);
}

//returns an array of letters according to the language requird by lang parameter, and prop is for small or capital letters 
function getArrOfLetters(lang = 'en',prop = 'small'){
    // debugger
    var letters = [];
    if(lang === 'en'){
        if (prop === 'small'){
            for(var i = 97;i <= 122;i++)
                letters.push(String.fromCharCode(i))
        }
        else{
            for(var i = 65;i <= 90;i++)
                letters.push(String.fromCharCode(i))
        }
    }
  return letters;
}
var gLetters = getArrOfLetters('en','small');

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//return a random name from array names
function getRndName() {
    var namesLen = names.length - 1;
    var idx = getRandomInteger(0, namesLen);
    var name = names[idx];
    names.splice(idx,1);
    return name;
}

function getRandomNums(length = 3,min = 0,max = 0){
    var nums = [];
    for(var i = 0;i < length - 1;i++){
        var random = getRandomInteger(min, max);
        while(nums.indexOf(random) !== -1){
            random = getRandomInteger(min, max);
        }
        nums.push(random)
    }

   return nums;
}

function getWord(length){
	var word = "";
	for(var i = 0;i < length;i++){
		word += gLetters[getRandomInteger(0,gLetters.length-1)]
	}
	return word + ' ';
}

function getRandomNames(length ,isFullName){
    var cnt = 0;
    var fullNames = [];
    while(cnt < length){

        if(isFullName){
            var fullName = "";
            var rndLen = getRandomInteger(3, 7);
            var str = getWord(rndLen);

            var fstName = str.charAt(0).toUpperCase() + str.substr(1);

            rndLen = getRandomInteger(3, 7);
            str = getWord(rndLen);
            var lstName = str.charAt(0).toUpperCase() + str.substr(1);

            fullName = fstName + " " + lstName;
            fullNames.push(fullName)
            cnt++;
        }
    }
  return fullNames;
}

//this function checks validate numbers that where entered with prompt function 
function promptStr2Num(str) {
    if (str.trim() !== '' && !isNaN(str)) return +str;
    else return null;
}

function checkstrData(str) {
    if (str.trim() !== '') return str;
    else return null;
}

function numOf250Digits() {
    var strNum = '1';
    for (var i = 0; i < 248; i++) {
        strNum += '0';
    }

    return +strNum;
}

function getLengthNum(num) {
    return num.toString().length;
}

function isPrime(num) {
    // console.log('Checking num:', num);
    var div = 2;
    var numIsPrime = true;

    var limit = Math.sqrt(num);
    while (numIsPrime && div <= limit) {
        if (num % div === 0) {
            // console.log('Not a Prime, found divider: ', div);
            numIsPrime = false;
        }
        div++;
    }
    return numIsPrime;
}

function isPrimeeee() {
    var res = null;
    var x = numOf250Digits();
    var limit = x + 100000000000000000000000000000000;
    console.log(x);
    console.log(limit);

    for (; x < limit; x++) {
        if (isPrime(x)) {
            res = x;
            return res;
        }
    }
    return res;
}

function errMsgCL() {
    console.log('Wrong data was entered, please try again!');
}

function numLength(num) {
    var cnt = -1;
    //checking if the nums value is not a falsy one
    if (!isNaN(num) && (num || num === 0)) {
        cnt = num === 0 ? 1 : 0;
        while (num) {
            num = parseInt(num / 10);
            cnt++;
        }
    }
    return cnt;
}

//this function returns a random cell{i:i,j:j} in a given matrix length and columns 
function randomCell(rows,columns){

    var rndIdx = Math.floor(Math.random() * rows*columns);
    var row = Math.floor(rndIdx / columns);
    var col = rndIdx % columns;
    
    return {i:row,j:col}
}