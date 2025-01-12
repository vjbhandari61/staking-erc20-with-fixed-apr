# ERC20 Staking Contract

This is a smart contract that allows users to stake ERC20 tokens and earn rewards over time. The contract supports staking, claiming rewards, compounding rewards, and withdrawing staked tokens.

## Features:
- **Stake** ERC20 tokens to earn rewards.
- **Claim** rewards at any time.
- **Compound** rewards to increase the staked balance and earn more.
- **Withdraw** staked tokens with accumulated rewards.
- Events for logging actions like stake, claim, compound, and withdraw.

## Dependencies:
- [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) for secure ERC20 token operations.

---

## Setup

### Prerequisites:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Truffle](https://www.trufflesuite.com/truffle) or [Hardhat](https://hardhat.org/)
- A wallet (e.g., MetaMask) for interacting with the contract

---

## Installation:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/ERC20Staking.git
   cd ERC20Staking
   ```

2. **Install Dependencies**:

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

3. **Configure Environment**:
   - Update the `.env` file to include your Ethereum wallet private key and the token address (ERC20 token) that you want to stake.

4. **Deploy Contract**:
   - Use either Truffle or Hardhat to deploy the contract to a local or test network.

   For **Hardhat**:
   - Create a deployment script under the `scripts/` folder. For example, `deploy.js`:

     ```js
     async function main() {
       const [deployer] = await ethers.getSigners();
       console.log("Deploying contracts with the account:", deployer.address);

       const Token = await ethers.getContractFactory("ERC20Staking");
       const token = await Token.deploy("Your ERC20 Token Address");
       console.log("Staking contract deployed to:", token.address);
     }

     main().catch((error) => {
       console.error(error);
       process.exitCode = 1;
     });
     ```

   For **Truffle**:
   - Update the `migrations/` folder with a migration script to deploy the contract.

---

## Contract Functions:

- **stake(uint _amount)**: Stake a specified amount of ERC20 tokens.
- **rewards(address _user)**: View the rewards for a specific user.
- **claim()**: Claim rewards for the caller.
- **compound()**: Compound rewards to increase the staked balance.
- **withdraw(uint amount)**: Withdraw staked tokens (after compounding rewards).

---

## Example Interactions:

```javascript
// Stake tokens
await staking.stake(1000);

// Claim rewards
await staking.claim();

// Compound rewards
await staking.compound();

// Withdraw staked tokens
await staking.withdraw(500);
```

---

## Error Handling:

- **InsufficientBalance**: If trying to withdraw more than the staked balance.
- **InsufficientReward**: If attempting to claim rewards with no available rewards.
- **UnsupportedTokenReceived**: If any unsupported tokens are sent to the contract.

---
