(function () {
    "use strict";
    
    var padButtons = document.getElementsByClassName('pad-button'),
        tabMenus = document.getElementsByClassName('tab-menu'),
        readyOperands = document.getElementsByClassName('ready-operand'),
        resultOperands = document.getElementsByClassName('result-operand'),
        readyMenus = tabMenus[0],
        resultMenus = tabMenus[1],
        forEach = Array.prototype.forEach,
        readyText = "",
        DECIMAL_NUMBER = "10進数",
        BINARY_NUMBER = "2進数",
        OCTAL_NUMBER = "8進数",
        HEX_NUMBER = "16進数",
        readyState = 10,
        resultState = 10,
        shift = 0;
    
    function padHighlight() {
        forEach.call(padButtons, function (elem, i) {
            if(i > 15) { return; }
            
            if (i < (readyState - 1)) {
                elem.className = "pad-button";
            } else {
                elem.className = "pad-button dark-button";
            }
            if (elem.innerHTML === "0") {
                elem.className = "pad-button zero-button";
            }
        });
    }
    
    function varidator(text) {
        var permit = false;
        
        if (readyText === "" && text === "0") { return false; }
                
        if (readyState === 10) {
            permit = text.match(/^[0-9]+$/);
        } else if (readyState === 2) {
            permit = text.match(/^[0-1]+$/);
        } else if (readyState === 8) {
            permit = text.match(/^[0-7]+$/);
        } else {
            permit = true;
        }
        
        return permit;
    }
    
    function isOperator(text) {
        return text.match(/^[÷,×,+,\-]+$/);
    }
    
    function isAC(text) {
        return text.match(/^[AC]+$/);
    }
    
    function isEqual(text) {
        return text.match(/^[=]+$/);
    }
    
    // 
    function removeChildClassName(element) {
        forEach.call(element.childNodes, function (elem) {
            elem.className = "";
        });
    }
    
    function updateResultDisplay() {
        resultOperands[0].innerHTML = parseInt(readyOperands[0].innerHTML, readyState).toString(resultState);
        if (shift > 0) { resultOperands[1].innerHTML = readyOperands[1].innerHTML; }
        if (shift > 1) { resultOperands[2].innerHTML = parseInt(readyOperands[2].innerHTML, readyState).toString(resultState); }
        if (shift > 2) { resultOperands[3].innerHTML = "="; }
        if (shift > 3) { resultOperands[4].innerHTML = parseInt(readyOperands[4].innerHTML, readyState).toString(resultState); }
    }
    
    function convertReadyDisplay(after, before) {
        readyOperands[0].innerHTML = parseInt(readyOperands[0].innerHTML, before).toString(after);
        if (shift > 1) { readyOperands[2].innerHTML = parseInt(readyOperands[2].innerHTML, before).toString(after); }
        if (shift > 2) { readyOperands[3].innerHTML = "="; }
        if (shift > 3) { readyOperands[4].innerHTML = parseInt(readyOperands[4].innerHTML, before).toString(after); }
    }
    
    function desimalStringToNumber(text) {
        var number = 0;
        switch (text) {
        case DECIMAL_NUMBER:
            number = 10;
            break;
        case OCTAL_NUMBER:
            number = 8;
            break;
        case BINARY_NUMBER:
            number = 2;
            break;
        case HEX_NUMBER:
            number = 16;
            break;
        }
        return number;
    }
    
    // call clicked ready tab menu 
    function clickedReadyTabMenu(event) {
        if (event.target.nodeName !== "A") { return; }
        removeChildClassName(readyMenus);
        event.target.parentNode.className = "selected";
        
        
        var before = readyState;
        readyState = desimalStringToNumber(event.target.innerHTML);
        
        if (readyState === before) { return; }
        convertReadyDisplay(readyState, before);
        padHighlight();
        return false;
    }
    
    // call clicked result tab menu 
    function clickedResultTabMenu(event) {
        if (event.target.nodeName !== "A") { return; }
        removeChildClassName(resultMenus);
        event.target.parentNode.className = "selected";
        
        resultState = desimalStringToNumber(event.target.innerHTML);
        updateResultDisplay();
        return false;
    }
            
    
    function padAC() {
        shift = 0;
        readyText = "";
        
        readyOperands[0].innerHTML = 0;
        readyOperands[1].innerHTML = "";
        readyOperands[2].innerHTML = 0;
        readyOperands[3].innerHTML = "=";
        readyOperands[4].innerHTML = "";
        
        resultOperands[0].innerHTML = 0;
        resultOperands[1].innerHTML = "";
        resultOperands[2].innerHTML = 0;
        resultOperands[3].innerHTML = "=";
        resultOperands[4].innerHTML = "";
    }
    
    function sum(a, b) {
        a = parseInt(a, readyState);
        b = parseInt(b, readyState);
        return parseInt(a + b, 10).toString(readyState);
    }
    
    function sub(a, b) {
        a = parseInt(a, readyState);
        b = parseInt(b, readyState);
        return parseInt(a - b, 10).toString(readyState);
    }
    
    function mul(a, b) {
        a = parseInt(a, readyState);
        b = parseInt(b, readyState);
        return parseInt(a * b, 10).toString(readyState);
    }
    
    function div(a, b) {
        if (a === 0) { return "NaN"; }
        a = parseInt(a, readyState);
        b = parseInt(b, readyState);
        return parseFloat(a / b, 10).toString(readyState);
    }
    
    function calc() {
        var ope1 = readyOperands[0].innerHTML,
            ope2 = readyOperands[1].innerHTML,
            ope3 = readyOperands[2].innerHTML,
            result = "";
        
        switch (ope2) {
        case "+":
            result = sum(ope1, ope3);
            break;
        case "-":
            result = sub(ope1, ope3);
            break;
        case "×":
            result = mul(ope1, ope3);
            break;
        case "÷":
            result = div(ope1, ope3);
            break;
        default:
            break;
        }
         
        return result;
    }
    
    function showResult() {
        var result = calc();
        shift = 4;
        readyOperands[shift].innerHTML = result;
        updateResultDisplay();
    }
    
    function padOperator(text) {
        if (shift > 1) {
            shift = 4;
            showResult();
            return;
        }
        
        // View に書き込み
        shift += 1;
        readyOperands[shift].innerHTML = text;

        // 待機テキストを初期化
        readyText = "";

        // シフト
        shift += 1;
    }
    
    // call clicked pad button  
    function clickedPad(event) {
        var value = event.target.innerHTML;
        
        // click AC button
        if (isAC(value)) {
            padAC();
            return;
        }
        
        // click Equal button
        if (isEqual(value)) {
            if (shift < 2) { return; }
            showResult();
            return;
        }
        
        // click operator button
        if (isOperator(value)) {
            padOperator(value);
        } else {
            // number varidator
            if (!varidator(value)) { return; }
        
            readyText += value;
            readyOperands[shift].innerHTML = readyText;
        }
        

        updateResultDisplay();
        
        //left += 1;
        return false;
    }
    
    
    function init() {
        
        // register event listener for the pad button 
        forEach.call(padButtons, function (elem) {
            elem.addEventListener("click", clickedPad);
        });

        // register event listener for the tab menu
        forEach.call(readyMenus.childNodes, function (elem) {
            elem.addEventListener("click", clickedReadyTabMenu);
        });
        
        forEach.call(resultMenus.childNodes, function (elem) {
            elem.addEventListener("click", clickedResultTabMenu);
        });
        
        padHighlight();
    }
    
    init();
}());