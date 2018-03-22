pragma solidity ^0.4.13;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';

contract TrialCoin is MintableToken {
  string public name = "TRIAL COIN";
  string public symbol = "TRI";
  uint8 public decimals = 18;
}