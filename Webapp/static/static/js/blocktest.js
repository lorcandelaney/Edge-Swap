
    /* Configuration variables */
    var ipfsHost    = 'localhost';
    var ipfsAPIPort = '5001';
    var ipfsWebPort = '8080';
    var web3Host    = 'http://localhost';
    var web3Port    = '8545';

    /* IPFS initialization */
    var ipfs = window.IpfsApi(ipfsHost, ipfsAPIPort)
    ipfs.swarm.peers(function (err, res) {
        if (err) {
            console.error(err);
        } else {
            var numPeers = res.Peers === null ? 0 : res.Peers.length;
            console.log("IPFS - connected to " + numPeers + " peers");
        }
    });

    /* web3 initialization */ //NOT SURE IF THIS WILL WORK may need to edit
    var Web3 = require('web3');
    var web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(web3Host + ':' + web3Port));
    if (!web3.isConnected()) {
        console.error("Ethereum - no connection to RPC server");
    } else {
        console.log("Ethereum - connected to RPC server");
    }
    
    var contractInterface = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "id",
          "type": "string"
        }
      ],
      "name": "topUp",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "link",
          "type": "string"
        },
        {
          "name": "original_distributor",
          "type": "address"
        }
      ],
      "name": "addFile",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "fileId",
          "type": "string"
        },
        {
          "name": "distrib",
          "type": "address"
        }
      ],
      "name": "getDisId",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "fileId",
          "type": "string"
        },
        {
          "name": "distrib",
          "type": "address"
        }
      ],
      "name": "getChildrenNo",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "invitee",
          "type": "address"
        }
      ],
      "name": "addDistributor",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "distrib",
          "type": "address"
        }
      ],
      "name": "banDistributor",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "fileId",
          "type": "string"
        },
        {
          "name": "disId",
          "type": "string"
        }
      ],
      "name": "makePayment",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "inStr",
          "type": "string"
        },
        {
          "name": "v",
          "type": "uint256"
        }
      ],
      "name": "appendUintToString",
      "outputs": [
        {
          "name": "str",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "id",
          "type": "string"
        }
      ],
      "name": "getFile",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "name": "getBalance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "token",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "rate",
          "type": "uint256"
        },
        {
          "name": "lowFundCap",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "id",
          "type": "string"
        }
      ],
      "name": "lowFunds",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "id",
          "type": "string"
        }
      ],
      "name": "noFunds",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "disId",
          "type": "string"
        }
      ],
      "name": "checkForPayment",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "claimant",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "madePayment",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "parentAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "newAddress",
          "type": "address"
        }
      ],
      "name": "addedDistributor",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "original_distributor",
          "type": "address"
        }
      ],
      "name": "newFile",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "banned_distributor",
          "type": "address"
        }
      ],
      "name": "distributorBanned",
      "type": "event"
    }
  ];

    var account = web3.eth.accounts[0];


    var sendDataObject = {
        gas: 300000,
        from: account
    };

    window.sendDataObject = sendDataObject;
    window.ipfs = ipfs;
    window.web3 = web3;
    //window.contractObject = contractObject;
    window.contract = web3.eth.contract(contractInterface);
    window.contractInstance = window.contract.at('0xfd145b623b136a792fb3014f07b81925d5ca4d33');

    window.ipfsAddress = "http://" + ipfsHost + ':' + ipfsWebPort + "/ipfs";


    window.fileId = localStorage['fileId'] || null;

    window.disId = null;


   //TODO: INERGRATE OUR CONTRACT
    function storeContent(path, newFileId, original_distributor, amount) {
        window.ipfs.add(path, function(err, result) {
            if (err) {
                console.error(err);
                return false;
            } else if (result && result[0] && result[0].Hash) {
                console.log("Content successfully stored. IPFS address:", result[0].Hash);

                console.log("Now storing file information on blockchain");
                addFile(newFileId, result[0].Hash, original_distributor, amount);

                console.log("File information successfully stored on blockchain");
            } else {
                console.error("Unresolved content submission error");
                return null;
            }
        });
    }

    //original_distributor? Would this not just be window.account?
    function addFile(newFileId, ipfsHash, original_distributor, amount) {
        if (!window.contractInstance) {
            console.error('Ensure the storage contract has been deployed');
            return;
        }

        value_wei = window.web3.toWei(amount,"ether");

        window.contractInstance.addFile(newFileId, ipfsHash, original_distributor, {from:window.account, value:value_wei, gas:300000}, function (err, result) {
            if (err) {
                console.error("Transaction submission error:", err);
            } else {
                console.log(result);
                setFileId(newFileId);
            }
        });
    }

    function addDistributor(invitee, onBehalfOf){
       window.contractInstance.addDistributor(window.fileId, invitee, {gas:1000000, from:onBehalfOf}, function(err,result){
        if(!err){
          console.log('successfully called addDistributor.');
        }
        else{
          console.err('error'+ err);
        }
      });
    }

    function fetchContent(fileId) {
        if (!window.contractInstance) {
            console.error("Storage contract has not been connected to. check the abi and/or connection initialization above");
            return;
        }

        window.contractInstance.getFile.call(fileId, function (err, result) {
            if (err) {
                console.error(err);
            } 
            else{
                window.IPFSHash = result;
                var URL = window.ipfsAddress + "/" + result;
                console.log("Content successfully retrieved. IPFS address", result);
                console.log("Content URL:", URL);
                window.open(URL,'_blank');
            } 
        });
    }

    function getBalance() {
        window.web3.eth.getBalance(window.account, function (err, balance){
            console.log(parseFloat(window.web3.fromWei(balance, "ether")));
        });
    }


    //watches events and performs action.
    var checkPayment = window.contractInstance.checkForPayment();
    checkPayment.watch(function(error, result){
      if (!error){
        console.log('\n' + "New distributor was added, perhaps you can be paid." + '\n');
        console.log("New disId: " + result.args.disId);

        for (i = 0; i < window.web3.eth.accounts.length; i++){

            var tempAccount = window.web3.eth.accounts[i];

            var tempSendDataObject = {
            gas: 300000,
            from: tempAccount
            };

            window.contractInstance.makePayment(window.fileId, result.args.disId, tempSendDataObject , function(err,result){
              if(!err){
                console.log('Successfully called make payment on the user address: ' +  tempAccount);
                //TODO
              }
              else{
                console.err('error'+ err);
              }
            });
        }
      }
    });


    //watches events and performs action.
    var lowBalance = window.contractInstance.lowFunds();
    lowBalance.watch(function(error, result){
      if (!error){
        console.log('\n' + "Your balance of trialcoin is low, you should top up." + '\n');
      }

      else{
        console.err('error:', err);
      }
    });


    //watches events and performs action.
    var noBalance = window.contractInstance.noFunds();
    noBalance.watch(function(error, result){
      if (!error){
        console.log('\n' + "You need to top up ur trial coins bruh" + '\n');
      }

      else{
        console.err('error:', err);
      }
    });


    //watches events and performs action.
    var paymentMade = window.contractInstance.madePayment();
    paymentMade.watch(function(error, result){
      var j =0;
      if (!error){
        console.log('\n' + "Payment has been made" + '\n');
        //TODO: nodeBalance update is called when it shouldnt be because of the watch filter.
        //Asynchronicity means that sometimes if this happens it wipes window.char_config.
        // for(i = 1; i< window.chart_config.length; i++){
        //     if(window.chart_config[i].text.name === (result.args.claimant+fileId)){
        //       j+=1;
        nodeBalanceUpdate(window.fileId, result.args.claimant, result.args.amount);
        //       // console.log('\n' + "Payment has been made" + '\n');
        //     }
        // }
        // if(j === 0){
        //   //nodeBalanceUpdate(window.fileId, result.args.claimant, result.args.amount);
        //   // console.log('\n' + "Payment has been made" + '\n');
        // }    
      }
      else{
        console.err('error:', err);
      }
    });


    //watches events and performs action.
    var addedDistributor = window.contractInstance.addedDistributor();
    addedDistributor.watch(function(error, result){
      if (!error){
        console.log('\n' + "New distributor:" + result.args.newAddress + ' added' + '\n');
        addNode(window.fileId, result.args.parentAddress, result.args.newAddress);
      }

      else{
        console.err('error:', err);
      }
    });


    //watches events and performs action.
    var newFile = window.contractInstance.newFile();
    newFile.watch(function(error, result){
      if (!error){
        console.log('\n' + "New distributor: " + result.args.original_distributor + ' added' + '\n');
        addOriginalNode(window.fileId, result.args.original_distributor);
      }

      else{
        console.err('error:', err);
      }
    });

    var bannedDistributor = window.contractInstance.distributorBanned();
    bannedDistributor.watch(function(error, result){
      if (!error){
        console.log('\n' + "Distributor: " + result.args.banned_distributor + ' has been banned.' + '\n');
        banNode(window.fileId, result.args.banned_distributor);
      }

      else{
        console.err('error:', err);
      }
    });



    //perhaps a dropdown list of registered fileIDs or something - can be manual for the demo
    function setFileId(fileId){

      window.fileId = fileId;
      localStorage['fileId'] = fileId;
    }

    function getDisId(){

       window.contractInstance.getDisId.call(window.fileId, window.account, function(err,result){
          if(!err){
            console.log('successfully called getDisId.');

            window.disId = result;
          }
          else{
            console.err('error'+ err);
          }
        });
    }  

    function banDistributor(toBan){


         window.contractInstance.banDistributor(window.fileId, toBan, window.sendDataObject, function(err, result){

          if(!err){
            console.log('successfully called banDistributor.');
          }
          else{
            console.err('error'+ err);
          }
        });

    }

    function topUp(amount){

        window.contractInstance.topUp(window.account, {from:window.account, gas:100000, value:web3.toWei(amount,"ether")}, function(err, result){

          if(!err){
            console.log('successfully called topUp.');
          }
          else{
            console.err('error'+ err);
          }
        });
    }


   function getPayed(fileId, disId){
    window.contractInstance.makePayment(fileId, disId, sendDataObject, function(err,result){
      if(!err){
        console.log('successfully called makePayment.');
      }
      else{
        console.err('error'+ err);
      }
    });
   }

   function getArbDisId(address){

      window.contractInstance.getDisId.call(window.fileId, address, function(err,result){
        if(!err){
          console.log(disId);
        }
        else{
          console.err('error'+ err);
        }
      });
   }



      // function catFile(){
      //   window.ipfs.cat(ipfsPath, function (err, file) {
          
      //     if (err) {
      //       console.err(err);
      //     }

      //     console.log(file.toString('utf8'));

      //   })
      
      // }

    //TODOS

    /*


      ETH FUNC NAMES AND WHAT TO DO IN JS IMPLEMENTATION

      addDistributor(bytes32 id, address invitee) <-------- input boxes for these args anyone can run this


      topUp(bytes32 id) <--------- input box, creator sends money as msg.value to use this


      DONE    addFile(bytes32 id, string link, address original_distributor)  <--------- only cretor(handled by ethereum), invoke using the hash from ipfs (which is the string link arg) (
              also generation method of the id is up to you)


      DONE     getFile(bytes32 id)  <----- returns the ipfs hash


      DONE     makePayment(bytes32 fileId, string disId) <------- this function is called by an event listener. google 'event listener' or ill do it if u arent confident

      banDistributor(bytes32 id, address distrib) <------only cretor(handled by ehterueum) does this, bans distributor


      JS FUNC DESCRIP

      storeContent(url) <------ allow users to submit files to this rather than just a url (maybe it already uses hardrive paths?) other than that it should already function

    **/