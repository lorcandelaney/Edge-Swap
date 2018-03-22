pragma solidity ^0.4.13;

//1 instance of the smart contract per corporation/group that uses it. So the smart contract keeps track of all file distributors for that corporation/group.

import './TrialCoin.sol';
import "./strings.sol"; //gives you the ability to do string manipulations

contract Tree {

    using strings for *;
    
    struct Distributor {
        address referrer; //person who introduced you to the network
        address distributor_add; //your address
        bool isBanned;
        bool isInit; //are you initialised
        string disId; //your id, calculated from your height in the tree and your branch no starting from the left going right
        bytes32 childrenNo; //how many children you have
    }

    
    struct File {
        string link; // ipfs hash
        address committer; //file creator address
        //Distributor[] distributors; //all the dstrubutors of this file
        bool exists; 
        uint256 balance; //This is the credit that's left for this file. A file can only be distributed as long as credit remains for it. Each time it gets distributed, the credit decreases. This credit can be topped up.
        //distrib map to check for bans
        mapping(address => Distributor) distributorMap;

        mapping(string => mapping(address => bool)) payed;
    }
    
    // hash-map where bytes32 = id of file
    mapping(string => File) files;

    //distrib map to check for bans
    mapping(string => bool) outOfFunds;
    //wether a distributor has been payed yet for a given file.
    address public owner;

    //the amount of funds attached to a contract that triggers a lowfund event
    uint256 threshold;
    //the rate of our token/eth
    uint256 coinRate;

    TrialCoin public token;
    
    modifier isUnique(string id) {
        require(files[id].exists != true);
        _;
    }
    
    modifier onlyOwner{
        require(owner == msg.sender);
        _;
    }
    
    event lowFunds(string id);

    event noFunds(string id);

    event checkForPayment(string disId);

    event madePayment(address claimant, uint amount);

    event addedDistributor(address parentAddress, address newAddress);

    event newFile(address original_distributor);

    event distributorBanned(address banned_distributor);
    
    function Tree(uint256 rate, uint256 lowFundCap){

        owner = msg.sender;
        coinRate = rate;
        threshold = lowFundCap;
        token = createTokenContract();
        
    }
    
    function addFile(string id, string link, address original_distributor) 
    payable 
    onlyOwner
    isUnique(id) 
    {
        // msg.sender is the committer
        // e.g. BBC

        //setup file info

        File memory file = File({link:link, committer:msg.sender, exists:true, balance:msg.value*coinRate});

        //setup distributor info

        Distributor memory distributor = Distributor({referrer:msg.sender, distributor_add:original_distributor, 
            isBanned:false, isInit:true, disId:'0', childrenNo:bytes32(0)
            });

        //this might be problematic if you want original_distributor to be dynamic

        //store the data
        files[id] = file;

        files[id].distributorMap[original_distributor] = distributor;

        newFile(original_distributor);
        
    }


    //The organisation/group that owns the file and hence this contract can increase the balance/credit for a file so it can be distributed more.
    function topUp(string id) external payable onlyOwner{
        //not sure what to do with the ether that amasses on the contract
        uint256 topUpAmt = msg.value*coinRate;

        files[id].balance = files[id].balance + topUpAmt;        
    }

    //This is called by a person who is already a distributor. It allows a current distributor to add a new one.
    //Also implements functionality allowing us to find the id of the inviter given an invitee.
    function addDistributor(string id, address invitee) external returns(bool){

        require(files[id].distributorMap[invitee].isBanned != true);
        //could add a require to stop banned members from adding new distributors but they dont get paid for that anyway

        require(files[id].distributorMap[invitee].isInit != true);

        //if the file has associated funds hen set up a new distributor profile
        if(outOfFunds[id] != true){

            files[id].distributorMap[msg.sender].childrenNo = bytes32(uint(files[id].distributorMap[msg.sender].childrenNo) + 1);

            Distributor memory distributor = Distributor({referrer:msg.sender, distributor_add:invitee, 
                isBanned:false, isInit:true, disId:appendUintToString(files[id].distributorMap[msg.sender].disId,uint(files[id].distributorMap[msg.sender].childrenNo)), childrenNo:bytes32(0)});

            files[id].distributorMap[invitee] = distributor;

            addedDistributor(msg.sender, invitee);
            checkForPayment(distributor.disId);

            return true;
        }

        else{
            noFunds(id);
            return false;
        }

    }


    function makePayment(string fileId, string disId) external returns(bool){
        //needs update for multiple files
        require(files[fileId].payed[disId][msg.sender] != true);
        require(!compareStrings(disId, files[fileId].distributorMap[msg.sender].disId));
        require(files[fileId].distributorMap[msg.sender].isBanned != true);

        //match the disId of the claimant with the disId of the person a child/they signed up
        //if there is a match then the claimant must have the new distributor as a child and they can be paid


        bool check = strings.equals(disId.toSlice().find(files[fileId].distributorMap[msg.sender].disId.toSlice()),disId.toSlice());
        if(check){ 

            if(files[fileId].balance >=1){

                files[fileId].balance = files[fileId].balance -1;
                uint quantity = 1;
                token.mint(msg.sender, quantity);

                madePayment(msg.sender, quantity);

                files[fileId].payed[disId][msg.sender] = true; //they have now been paid so no more payments

            }

            else{
                outOfFunds[fileId] = true;
            }
        }
    }
    
    // Called by the end user
    function getFile(string id) external returns(string){

        if(files[id].balance < threshold){
            lowFunds(id);
        }

        return  files[id].link; //return ipfs hash

    }

    function createTokenContract() internal returns(TrialCoin){

        return new TrialCoin();

    }
    
    function banDistributor(string id, address distrib) external onlyOwner{

        files[id].distributorMap[distrib].isBanned = true;
        distributorBanned(distrib);
        
    }

    function compareStrings (string a, string b) internal returns (bool){
       return keccak256(a) == keccak256(b);
    }

    function getDisId(string fileId, address distrib) external returns(string){
        return files[fileId].distributorMap[distrib].disId;
    }

    function getChildrenNo(string fileId, address distrib) external returns(bytes32){
        return files[fileId].distributorMap[distrib].childrenNo;
    }

    function getBalance(address account) external returns(uint){

        return token.balanceOf(account);

    }


    function appendUintToString(string inStr, uint v) constant returns (string str) {
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = byte(48 + remainder);
        }
        bytes memory inStrb = bytes(inStr);
        bytes memory s = new bytes(inStrb.length + i);
        uint j;
        for (j = 0; j < inStrb.length; j++) {
            s[j] = inStrb[j];
        }
        for (j = 0; j < i; j++) {
            s[j + inStrb.length] = reversed[i - 1 - j];
        }
        str = string(s);
    }

}