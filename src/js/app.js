window.addEventListener("load", function() {
  if (typeof web3 != "undefined") {
    web3js = new Web3(web3.currentProvider);
    switch (web3js.version.network) {
      case "1":
        networkName = "Main";
        break;
      case "2":
        $(".metamask-modal").modal("show");
        networkName = "Morden";
        break;
      case "3":
        networkName = "Ropsten";
        break;
      case "4":
        networkName = "Rinkeby";
        break;
      case "42":
        networkName = "Kovan";
        break;
      default:
        $(".metamask-modal").modal("show");
        networkName = "Unknown";
    }
  } else {
    web3 = new Web3(
      new Web3.providers.HttpProvider(
        "https://mainnet.infura.io/v3/fd5325c20c01481e8355583ef506e471"
      )
    );
  }
  startApp();
});

function startApp() {
  $(".range").on("click", getAndValidateBlockRangeInput);
  $(".from-latest").on("click", getNumberOfBlocksToQueryFromLatest);
}

function getAndValidateBlockRangeInput(e) {
  e.preventDefault();
  const startBlock = $("#start-block").val();
  const endBlock = $("#end-block").val();
  if (startBlock >= endBlock) {
    $(".validation-error").append(
      `<div class="alert alert-danger" role="alert" style="width:70%; margin:auto;">
        The start block # must be less than the end block #
      </div>`
    );
  }
  getBlockData(startBlock, endBlock);
}

function getNumberOfBlocksToQueryFromLatest(e) {
  e.preventDefault();
  $(".validation-error").empty();
  const blocksFromLatest = $("#blocks-from-latest").val();
  getNumberOfBlocksFromLatestBlockData(blocksFromLatest);
}

function getNumberOfBlocksFromLatestBlockData(blocksFromLatest) {
  web3.eth.getBlock("latest", function(error, result) {
    let latestBlock = result.number;
    let startBlock = latestBlock - blocksFromLatest + 1;
    getBlockData(startBlock, latestBlock);
  });
}

function getBlockData(start, end) {
  $(".block-data").empty();
  for (var i = start; i <= end; i++) {
    web3.eth.getBlock(i, true, function(error, result) {
      if (!error) {
        displayBlockData(result);
      } else {
        console.log(error);
      }
    });
  }
}

function displayBlockData(result) {
  $(".validation-error").empty();
  $(".no-data-message").hide();
  const date = new Date(result.timestamp * 1000);
  $(".block-data").append(`
    <tr>
      <td> ${result.number} </td>
      <td> ${date} </td>
      <td><button type="button" class="btn btn-link transaction" id="${
        result.number
      }" data-toggle="modal" data-target="#transactionDataModal"> ${
    result.transactions.length
  } </button></td>
      <td> ${result.uncles.length} </td>
    </tr>
    `);
}
