const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    return { game };
  }

  async function getWinnerWallet() {
    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";
    let winnerAddress;

    while (!winnerAddress) {
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      const address = await wallet.getAddress();

      if (address < threshold) {
        winnerAddress = address;
        const [signer] = await ethers.getSigners();
        await signer.sendTransaction({
          to: winnerAddress,
          value: ethers.utils.parseEther("1.0"),
        });
        return wallet;
      }
    }
  }

  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // good luck
    const winnerWallet = await getWinnerWallet();

    const tx = await game.connect(winnerWallet).win();
    await tx.wait();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
