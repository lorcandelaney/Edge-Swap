//I dont know how to get this to work
var config = {
        container: "#tree_diag",
        
        connectors: {
            type: 'step'
        },
        node: {
            HTMLclass: 'nodeExample1'
        }
    }
window.node1 = {
    text: {
        name: 'Creator',
    },
    myID: 0
};
window.tree = [
        config,window.node1
    ];    

function addOriginalNode(fileId, address){

    var newNode = address + fileId;

	window.newNode = {
        parent: window.tree[window.tree.length -1],
        text: {
            name: (address + fileId),
            balance: 'Balance: ' + 0,
            banned: '', 
        },
        myID: (window.tree[window.tree.length -1].myID + 1),
        stackChildren: true,
    };
    window.tree.push(window.newNode);

    writeTree(window.tree);
}

function nodeBalanceUpdate(fileId, address, amount){
    //newNodeadd = address + fileId;
    for(i = 0; i< window.tree.length; i++){
        if(i !== 0){
            if(window.tree[i].text.name === (address+fileId)){
                var myArray = window.tree[i].text.balance.split(' ');
                //myArray[myArray.length-1] = myArray[myArray.length-1] + amount;
                //console.log(myArray[myArray.length-1]);
                var number = +myArray[myArray.length-1] + +amount;
                window.tree[i].text.balance = 'Balance: ' + number;
                //console.log(window.tree[i].text.balance);
            }
        }    
    }
    writeTree(window.tree);
    //window.newNodeadd.text.balance +=amount;
 
}

function banNode(fileId, address){
    for(i = 0; i< window.tree.length; i++){
        if(i !== 0){
            if(window.tree[i].text.name === (address+fileId)){

                window.tree[i].text.banned = 'Banned';
            }
        }   
    }

    writeTree(window.tree);

}

function addNode(fileId, parentAddress, address){
    //disId = window.contractInstance.getDisId.call(fileId, address)
    var parent_obj = null;
    var newNode = address + fileId;
    for(i = 0; i < window.tree.length; i++){
        if(i!== 0){
            if(window.tree[i].text.name === (parentAddress + fileId)){
                parent_obj = window.tree[i];
            }
        }    
    }
    window.newNode = {
        parent: parent_obj,
        text:{
            name: (address + fileId),
            balance: 'Balance: ' + 0,
            banned: '',
        },
        myID: (window.tree[window.tree.length -1].myID + 1),
        //stackChildren: true,
    };

    window.tree.push(window.newNode);

    writeTree(window.tree);
}

function writeTree(tree){

    localStorage['tree_diag' + localStorage['fileId']] = JSON.stringify(tree);

}

function readTree(){
    var stored = localStorage['tree_diag' + localStorage['fileId']];
    if (stored) tree_diag = JSON.parse(stored);
    else tree_diag = null;

    return tree_diag;

}

function deleteTree(){
    localStorage['tree_diag' + localStorage['fileId']] = null;
}


// function storeBalances(balances){
//     localStorage['balance_' + localStorage['fileId']] = JSON.stringify(balances)
// }

// function readBalances(){
//     var stored = localStorage['balance_' + localStorage['fileId']];
//     if (stored) balances = JSON.parse(stored);
//     else balances = null;

//     return balances;

// }

