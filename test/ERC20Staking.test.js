const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20Staking", function () {
  let token;
  let staking;
  let owner;
  let user;
  let user2;
  
  beforeEach(async function () {
    [owner, user, user2] = await ethers.getSigners();

    // Deploy ERC20 Token
    const Token = await ethers.getContractFactory("DummyToken");
    token = await Token.deploy("TestToken", "TT", ethers.parseUnits("100000000000", 18));
    await token.waitForDeployment()

    // Deploy Staking Contract
    const Staking = await ethers.getContractFactory("ERC20Staking");
    staking = await Staking.deploy(token.target);
    await staking.waitForDeployment();

    // Transfer some tokens to user for staking
    await token.transfer(user.address, ethers.parseUnits("1000", 18));
    await token.transfer(user2.address, ethers.parseUnits("1000", 18));
    await token.transfer(staking.target, ethers.parseUnits("500000", 18));
  });

  // describe("Staking", function () {
  //   it("should allow users to stake tokens", async function () {

  //     const amount = ethers.parseUnits("100", 18);
  //     await token.connect(user).approve(staking.target, amount);

  //     await expect(staking.connect(user).stake(amount))
  //       .to.emit(staking, "Stake")
  //       .withArgs(user.address, amount);

  //     const balance = await staking.connect(user).getBalance(user.address);
  //     expect(balance).to.equal(amount);
  //   });

  //   it("should not allow users to stake more than their balance", async function () {
  //     const amount = ethers.parseUnits("2000", 18);
  //     await token.connect(user).approve(staking.target, amount);

  //     await expect(staking.connect(user).stake(amount))
  //       .to.be.revertedWithCustomError(token, "ERC20InsufficientBalance")
  //       .withArgs(user.address, "1000000000000000000000", "2000000000000000000000");
  //   });
  // });

  describe("Claiming Rewards", function () {
    it("should allow users to claim rewards", async function () {
      const amount = ethers.parseUnits("100", 18);
      await token.connect(user).approve(staking.target, amount);
      await staking.connect(user).stake(amount);
    
      // Fast forward time by 1 hour
      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine", []);
    
      // await expect(staking.connect(user).claim())
      //   .to.emit(staking, "Claim")
      //   .withArgs(user.address, ethers.parseUnits("36000", 18));

      const tx = await staking.connect(user).claim();
      const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
      const eventInterface = staking.interface.getEvent("Debug");

      console.log("receipt ============================>", receipt.logs);

      console.log("eventInterface ========================================>", eventInterface. )

      const logs = receipt.logs.filter(log => log.topics[0] === eventInterface.topic);
      console.log("logs", logs)
        
    
      // const balance = await staking.getClaimed(user.address);
      // expect(balance).to.be.gt(0);
    });
    

    // it("should revert claim if no rewards are earned", async function () {
    //   await expect(staking.connect(user).claim()).to.be.revertedWithCustomError(staking, "InsufficientReward");
    // });
  });

  // describe("Compounding Rewards", function () {
  //   it("should allow users to compound their rewards", async function () {
  //     const amount = ethers.parseUnits("100", 18);
  //     await token.connect(user).approve(staking.target, amount);
  //     await staking.connect(user).stake(amount);
    
  //     // Fast forward time by 1 hour
  //     await ethers.provider.send("evm_increaseTime", [3600]);
  //     await ethers.provider.send("evm_mine", []);
    
  //     // Expected reward after 1 hour for 100 tokens staked at a rate of 0.1 per second
  //     const reward = ethers.parseUnits("36010", 18);
    
  //     // Now, the user compounds the reward, meaning their balance increases by the reward amount
  //     await expect(staking.connect(user).compound())
  //       .to.emit(staking, "Compound")
  //       .withArgs(user.address, (reward + amount));  // Compound reward should be added to the initial balance
    
  //     // Verify that the user's balance is updated correctly
  //     const balance = await staking.getBalance(user.address);
  //     expect(balance).to.equal((amount + reward));  // The balance should be the original staked amount plus the compounded reward
  //   });
  // });
    

  // describe("Withdrawing", function () {
  //   it("should allow users to withdraw their staked tokens", async function () {
  //     const amount = ethers.parseUnits("100", 18);
  //     await token.connect(user).approve(staking.address, amount);
  //     await staking.connect(user).stake(amount);

  //     await expect(staking.connect(user).withdraw(amount))
  //       .to.emit(staking, "Withdraw")
  //       .withArgs(user.address, amount);

  //     const balance = await staking.balances(user.address);
  //     expect(balance).to.equal(0);
  //   });

  //   it("should not allow users to withdraw more than they have staked", async function () {
  //     const amount = ethers.parseUnits("100", 18);
  //     await token.connect(user).approve(staking.address, amount);
  //     await staking.connect(user).stake(amount);

  //     await expect(staking.connect(user).withdraw(ethers.parseUnits("200", 18)))
  //       .to.be.revertedWith("InsufficientBalance");
  //   });
  // });

  // describe("Total Rewards", function () {
  //   it("should return the total rewards correctly", async function () {
  //     const amount = ethers.parseUnits("100", 18);
  //     await token.connect(user).approve(staking.address, amount);
  //     await staking.connect(user).stake(amount);

  //     const totalRewards = await staking.totalRewards();
  //     expect(totalRewards).to.be.gt(0);
  //   });
  // });

  // describe("Receive Ether (Fallback Function)", function () {
  //   it("should revert if ether is sent to the contract", async function () {
  //     await expect(user.sendTransaction({ to: staking.address, value: ethers.parseEther("1") }))
  //       .to.be.revertedWith("UnsupportedTokenReceived");
  //   });
  // });
});
