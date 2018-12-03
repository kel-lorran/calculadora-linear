const getDataInput = () =>{
    const getFieldRestric = ( className) =>{
        //debugger
        let nodes = document.getElementsByClassName( className);
        let arrayResultValues = [];
        for( let i = 0; i < nodes.length; i++){
            arrayResultValues.push( nodes[i].value ? parseFloat( nodes[i].value) : 0 );
        }
        return arrayResultValues;
    }
    const makeArrayRestric = ( a1, a2, a3) => {
        return a1.map( (e, i , a) => [e,a2[i],a3[i]]);
    }
    let arrayFObjetivo =[]
    arrayFObjetivo.push( parseFloat (document.getElementById('f-o-constX').value));
    arrayFObjetivo.push( parseFloat( document.getElementById('f-o-constY').value));

    let arrayTempXs = getFieldRestric('restricX');
    let arrayTempYs = getFieldRestric('restricY');
    let arrayTempValResults = getFieldRestric('restricValResult');

    let arrayRestricoes = makeArrayRestric( arrayTempXs, arrayTempYs, arrayTempValResults);

    return arrayRestricoes;
}
const cramer = (a,b) => {
    let arrayResult = [];
    let det = (a[0]*b[1])-(b[0]*a[1]);
    let detX = (a[2]*b[1])-(b[2]*a[1]);
    let detY = (a[0]*b[2])-(b[0]*a[2]);
    arrayResult.push( detX/ det);
    arrayResult.push( detY/ det);
    return arrayResult;
}

/*para conhecer todas interseções de linha é necessario combinar par a par as funções */
const iteraForCramer = ( array) => {
    //debugger
    let = arrayResultParXY = [];
    for( let i = 0 ; i < (array.length-1); i++){
        for( let j = (i+1) ; j < array.length; j++){
            let returnCramer = cramer(array[i], array[j]);
            if(! (isNaN(returnCramer[0]) || isNaN( returnCramer[1])) ){
                arrayResultParXY.push(returnCramer);
            }
        }
    }
    return arrayResultParXY;
}

const startCalc = () => {
    //debugger
    let minOrMax = window.btn != 0 ? true : false;
    let xFuncObjetivo = document.getElementById('f-o-constX') != "" ? true : false;
    let yFuncObjetivo = document.getElementById('f-o-constY') != "" ? true: false;
    let retricoes = document.getElementsByClassName('restricValResult').length > 2 ? true : false; // deve conter pelo menos 3 restricoes

    if( minOrMax && xFuncObjetivo && yFuncObjetivo && retricoes){
        let data = getDataInput();
        let resultsPar = iteraForCramer( data);
        getFuncObjetivo();
        getFuncRestricao();
        let pontosValidos = resultsPar.filter( e => {
            return window.funcaoRestricao.reduce(( a, f) => a = a && f(...e),true);
        });
        
        let table = plottaTable( mapeiaValorMaisPromissor( pontosValidos));
        console.log(table);
        let target = document.getElementById('tabela');
        target.innerHTML = table;
    }else{
        alert( 'Confirme se todos os campos necessários estão preenchidos, e se o tipo de problema( maximização ou minimização) foi selecionado');
    }
}


/*Responsavel por capturar as formulas de restricao e objetivo */
var funcaoObjetivo = null;
var funcaoRestricao = [];
var teste;

const getFuncObjetivo = () =>{
    let xFuncObjetivo = parseFloat( document.getElementById('f-o-constX').value);
    let yFuncObjetivo = parseFloat( document.getElementById('f-o-constY').value);

    eval( `window.funcaoObejtivo = ( x, y) => { return (${xFuncObjetivo}*x)+(${yFuncObjetivo}*y);}`);
}

const getFuncRestricao = () => {
    //debugger
    //index para possibilitar sobreescrever o array de funcoes de restricoes no escopo global toda ves que getFuncaoRestricao for chamado
    let indexForWindowFunc = 0;
    var listForms = document.getElementsByTagName('form');
    //descarta o primeiro elemento pois se refere a função objetivo
    for( let i = 1; i < listForms.length; i++){
        if( listForms[i].querySelector('.restricValResult').value != ""){
            let inputs = listForms[i].getElementsByTagName('input');
            let xVal = inputs[0].value != "" ? parseFloat( inputs[0].value) : 0;
            let yVal = inputs[1].value != "" ? parseFloat( inputs[1].value) : 0;
            let operator = listForms[i].querySelector('.restricOpResult').value;
            let result = parseFloat( listForms[i].querySelector('.restricValResult').value);
            //console.log(operator);

            eval( `window.funcaoRestricao[${indexForWindowFunc++}] = ( x, y) => { return ((${xVal}*x)+(${yVal}*y) ${operator} ${result});}`);
        }
    }
}

const mapeiaValorMaisPromissor = (array) => {
    const classifica = (a, b) => {
        return a[2] - b[2];
    };

    let result = array.map( e => {
        e.push( window.funcaoObejtivo(...e));
        return e;
    });
    
    return result.sort( classifica);
}

const plottaTable = (array) => {
    //debugger
    if( window.btn == 1 ){
        array.reverse();
    }

    let valRow = '';

    for( let i = 0; i < array.length; i++){
        valRow += "<tr><th scope='row'>"+i+"</th><td>"+array[i][0]+"</td><td>"+array[i][1]+"</td><td>"+array[i][2]+"</td></tr>";

    }
    // array.forEach((e, i) => {

    // });

    let tabela = `<table class="table"></tbody><thead><tr><th scope="col">#</th><th scope="col">X</th><th scope="col">Y</th><th scope="col">resultado</th>${valRow}</tr></thead><tbody>`
    return tabela;
}

/*funcao de teste */
function popula(array = null,arrayOp = null) {
    let geral = document.getElementsByTagName('input');
    window.btn = 1;
    let operadores = document.getElementsByClassName('restricOpResult');
    if(array){
        for ( let i = 0; i < geral.length; i++) {
            geral[i].value = array[i];
        }
        for ( let i = 0; i < operadores.length; i++){
            operadores[i].value = arrayOp[i];
        }
    }else{
        for (let i = 0; i < geral.length; i++) {
            geral[i].value = Math.floor((Math.random() * 30));
        }
    }
}

