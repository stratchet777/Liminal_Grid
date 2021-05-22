let space = [];
let x = 0;
let y = 0;
let selectElement= '';
let _Element= null;
let rules = {
    "A":{gap:["F","G"],space:[]},
    "B":{gap:["D","F"],space:["E","G"]},
    "C":{gap:[],space:[]},
    "D":{gap:["B","F","G"],space:[]},
    "E":{gap:["F"],space:["B"]},
    "F":{gap:["E","D","B","A"],space:["G"]},
    "G":{gap:["D","A"],space:["F","B"]},
}
let icons = {
    A:"services icons-07.svg",
    B:"services icons-01.svg",
    C:"services icons-06.svg",
    D:"services icons-02.svg",
    E:"services icons-05.svg",
    F:"services icons-04.svg",
    G:"services icons-03.svg",
}

function createSpace(x,y){
    space = [];
    for (let i = 0 ; i < x ; i++){
        space.push([]);
        for (let k = 0 ; k< y; k++){
            space[i].push(-1);
        }
    }
}
function printspace(){
    for (let i= 0; i < y ; i++){
        let text = '';
        for (let k = 0 ;  k < x ;k++){
            text += space[i][k]+' ';
        }
        console.log(text);
    }
}
function generateGrid(){
    let table = document.getElementById('my-table');
    table.innerHTML = '';
    for (let i = 0 ; i<x;i++){
        let row = generateRow(i,y);
        table.append(row);
    }
}

function generateRow(rowNumber,columns){
    let ele = document.createElement('tr');
    for (let i = 0 ; i<columns;i++){ 
        let col = generateCol(rowNumber,i);
        ele.append(col);
    }
    return ele;
}

function generateCol(row,col){
    let ele = document.createElement('td');
    ele.setAttribute('id','col-'+row+'-'+col);
    ele.setAttribute('onclick','putElement(this)');
    return ele;
}

function GenerateGrid_click(){
    x = parseInt(document.getElementById('x-coord').value);
    y = parseInt(document.getElementById('y-coord').value);
    createSpace(x,y);
    generateGrid();
}
function selectedElement(sender){
    if (sender.classList.contains('selected-element'))
    {
        sender.classList.remove('selected-element');
        selectElement = '';
        _Element = null;
    }
    else{
    Array.from(document.querySelectorAll('.selected-element')).forEach(function(ele,ind){
        ele.classList.remove('selected-element');
    })
    sender.classList.add('selected-element');
    selectElement = sender.getAttribute('data-input');
    _Element = sender;
    }
}

function putElement(sender){
    if (selectElement)
    {
        let rowcol = sender.getAttribute('id').split('-');
        let _x = parseInt(rowcol[1]);
        let _y = parseInt(rowcol[2]);
        
        let currentError = gapError(_x,_y);
        if (currentError.currentError ==1){
            Swal.fire('Gap Rule Error',`<p style='display:flex;align-items:center'>There must be gap between&nbsp; <span class='td-inner td-inner-bg' style='background:url("assets/logos/${icons[currentError.value]}");display:inline-block;'></span>
            &nbsp;and &nbsp;<span class='td-inner td-inner-bg' style='background:url("assets/logos/${icons[selectElement]}")'></span>
            `,'error');
            
            currentError='';
            return;
        }
        currentError = spaceError(_x,_y);
        if (currentError.currentError ==1){
            Swal.fire('Space Rule Error', `<p style='display:flex;align-items:center;'>There must be tile space between &nbsp;<span class='td-inner td-inner-bg' style='background:url("assets/logos/${icons[currentError.value]}");display:inline-block;'></span>
            &nbsp;and&nbsp; <span class='td-inner td-inner-bg' style='background:url("assets/logos/${icons[selectElement]}");display:inline-block'></span>
            `,'error');
            currentError='';
            return;
        }
        space[_x][_y] = selectElement;
        $(sender).html(`<span class="td-inner td-inner-bg" style='background:url("assets/logos/${icons[selectElement]}")'></span>`);
        selectedElement(_Element);
    }

}

function gapError(_x,_y,invert){
    debugger;
    let currentError = '';
    let _v = '';
    if(_x-1 >=0){
        let value  = space[_x-1][_y];
        _v = value;
        currentError = checkRules(value,invert);
    }
    if (_x+1 < x && currentError == ''){
        let value  = space[_x+1][_y];
        _v = value;
        currentError = checkRules(value,invert);
    }
    if (_y-1 >= 0 && currentError == ''){
        let value  = space[_x][_y-1];
        _v = value;
        currentError = checkRules(value,invert);
    }
    if (_y+1 < y && currentError == ''){
        let value  = space[_x][_y+1];
        _v = value;
        currentError = checkRules(value,invert);
    }
    return {currentError:currentError,value:_v};
}
function spaceError(_x,_y){
    let currentError = '';
    let _value = '';
    if(_x-2 >=0){
        let value  = space[_x-2][_y];
        _value = value;
        let value2 = space[_x-1][_y];
        if ((spaceRule(value) && value2 !=-1))
        currentError = 1
    }
    if (_x+2 < x && currentError == ''){
        let value  = space[_x+2][_y];
        _value = value;
        let value2 = space[_x+1][_y];
        if ((spaceRule(value) && value2 !=-1))
        if (currentError=='')
        currentError = 1
    }
    if (_y-2 >= 0 && currentError == ''){
        let value  = space[_x][_y-2];
        _value = value;
        let value2 = space[_x][_y-1];
        if ((spaceRule(value) && value2 !=-1))
        if (currentError=='')
        currentError = 1
    }
    if (_y+2 < y && currentError == ''){
        let value  = space[_x][_y+2];
        _value = value;
        let value2 = space[_x][_y+1];
        if ((spaceRule(value) && value2 !=-1))
        if (currentError=='')
        currentError = 1
    }
    if (currentError==''){
        let ge = gapError(_x,_y,true);
        return {currentError:ge.currentError,value:ge.value} ;
    }
    
    else return {currentError:currentError,value:_value};
}

function checkRules(value,invert){
    if (invert){
        for (let i =0;i<rules[selectElement].space.length;i++){
            if (rules[selectElement].space[i] == value)
            return 1;
        }
    }else{
        for (let i =0;i<rules[selectElement].gap.length;i++){
            if (rules[selectElement].gap[i] == value)
            return 1;
        }
    }
    
    
    return '';
}
function spaceRule(value){
    for (let i =0;i<rules[selectElement].space.length;i++){
        if (rules[selectElement].space[i] == value)
        return 1;
    }
    return '';
}

