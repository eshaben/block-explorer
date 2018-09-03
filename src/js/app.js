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
  $(".from-latest").on("click", getBlocksFromLatestInput);
}

function getAndValidateBlockRangeInput(e) {
  e.preventDefault();
  var startBlockNo = $("#start-block").val();
  var endBlockNo = $("#end-block").val();
  if (startBlockNo => endBlockNo) {
    $(".validation-error").append(
      `<div class="alert alert-danger" role="alert" style="width:70%; margin:auto;">
        The start block # must be less than the end block #
      </div>`
    );
  }
}

function getBlocksFromLatestInput(e) {
  e.preventDefault();
  $(".validation-error").empty();
  var blocksFromLatest = $("#blocks-from-latest").val();
}
