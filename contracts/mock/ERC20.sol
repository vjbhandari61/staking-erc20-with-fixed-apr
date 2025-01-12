// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyToken is ERC20 {

    uint256 private _customTotalSupply;

    constructor(string memory _name, string memory _symbol, uint256 _customSupply) ERC20(_name, _symbol) {
        _customTotalSupply = _customSupply * (10 ** uint256(decimals()));
        _mint(msg.sender, _customTotalSupply);
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _customTotalSupply;
    }
}