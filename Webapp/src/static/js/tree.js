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
        balance: 0,
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
            balance: '0',
            contact: '12'
        },
        myID: (window.tree[window.tree.length -1].myID + 1),
        stackChildren: true,
    };
    window.tree.push(window.newNode);

    writeTree(window.tree);
}

function nodeBalanceUpdate(fileId, address, amount){
    for(i = 0; i< window.tree.length; i++){
        if(i !== 0){
            if(window.tree[i].text.name === (address+fileId)){
                window.tree[i].text.balance = String(amount + parseInt(window.tree[i].text.balance));
            }
        }    
    }
    console.log(window.tree);
    writeTree(window.tree);
 
}

function addNode(fileId, parentAddress, address){
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
            balance: '0',
        },
        myID: (window.tree[window.tree.length -1].myID + 1),
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

