// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract ERC20Staking {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    uint private totalStaked = 0;
    uint256 public constant RATE_PER_SECOND = 0.1 * 1 ether;

    // mappings
    mapping(address => uint) private balances;
    mapping(address => uint) private lastUpdated;
    mapping(address => uint) private claimed;

    // events
    event Stake(address indexed _user, uint256 _stakedAmt);
    event Claim(address indexed _user, uint256 _claimedAmt);
    event Compound(address indexed _user, uint256 _compoundedAmt);
    event Withdraw(address indexed _user, uint256 _withdrawnAmt);
    event Debug(uint256 blocktime);

    // errors
    error InsufficientBalance(uint requested, uint256 available);
    error UnsupportedTokenReceived();
    error InsufficientReward();

    constructor(IERC20 _token) {
        token = _token;
    }

    function totalRewards() external view returns (uint) {
        return token.balanceOf(address(this)) - totalStaked;
    }

    function stake(uint _amount) external {
        _compound();

        token.safeTransferFrom(msg.sender, address(this), _amount);
        balances[msg.sender] += _amount;

        _updateLastUpdated(msg.sender);

        totalStaked += _amount;

        emit Stake(msg.sender, _amount);
    }

    function rewards(address _user) public view returns (uint256) {
        uint256 balance = balances[_user];
        uint256 rate = RATE_PER_SECOND;
        uint256 time = block.timestamp - lastUpdated[msg.sender];

        uint256 reward = balance * rate;
        reward = (reward * time) / 10 ** 18;
        return reward;
    }

    function claim() external {
        if (balances[msg.sender] > 0) {
            uint amt = rewards(msg.sender);
            token.transfer(msg.sender, amt);
            claimed[msg.sender] += amt;

            _updateLastUpdated(msg.sender);
            
            emit Debug(block.timestamp);
            emit Claim(msg.sender, amt);
        } else {
            revert InsufficientReward();
        }
    }

    function _compound() internal {
        uint amt = rewards(msg.sender);
        claimed[msg.sender] += amt;
        balances[msg.sender] += amt;
        totalStaked += amt;

        _updateLastUpdated(msg.sender);

        emit Compound(msg.sender, amt);
    }

    function compound() external {
        _compound();
    }

    function withdraw(uint amount) external {
        uint userBal = balances[msg.sender];
        if (userBal < amount) {
            revert InsufficientBalance(amount, userBal);
        }

        _compound();

        token.transfer(msg.sender, amount);
        balances[msg.sender] -= amount;

        _updateLastUpdated(msg.sender);

        emit Withdraw(msg.sender, amount);
    }

    function _updateLastUpdated(address _user) internal {
        lastUpdated[_user] = block.timestamp;
    }

    function getBalance(address _user) external view returns (uint) {
        return balances[_user];
    }

    function getClaimed(address _user) external view returns (uint) {
        return claimed[_user];
    }

    receive() external payable {
        revert UnsupportedTokenReceived();
    }
}
