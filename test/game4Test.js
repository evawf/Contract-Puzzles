const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const add = require("nodemon/lib/rules/add");

describe("Game4", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game4");
    const game = await Game.deploy();
    const [owner] = await ethers.getSigners();

    const signer1 = await ethers.provider.getSigner(0);

    const address1 = await signer1.getAddress();

    return { game, signer1, address1, owner };
  }
  it("should be a winner", async function () {
    const { game, signer1, address1, owner } = await loadFixture(
      deployContractAndSetVariables
    );

    // nested mappings are rough :}
    await game.write(address1);

    await game.win(address1);

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
