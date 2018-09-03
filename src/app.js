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
  $(document).on("click", ".transaction", getTransactionData);
}

function getAndValidateBlockRangeInput(e) {
  e.preventDefault();
  $(".validation-error").empty();
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
    if (!error) {
      const latestBlock = result.number;
      const startBlock = latestBlock - blocksFromLatest + 1;
      getBlockData(startBlock, latestBlock);
    } else {
      console.log(error);
    }
  });
}

function getBlockData(start, end) {
  $(".block-data").empty();
  for (var i = start; i <= end; i++) {
    web3.eth.getBlock(i, function(error, result) {
      if (!error) {
        $(".no-data-message").empty();
        displayBlockData(result);
      } else {
        console.log(error);
      }
    });
  }
}

function displayBlockData(result) {
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

function getTransactionData(e) {
  e.preventDefault();
  const blockNo = e.target.id;
  web3.eth.getBlock(blockNo, true, function(error, result) {
    if (!error) {
      $(".transaction-data").empty();
      let totalWei = new web3.BigNumber(0);
      const transactions = result.transactions;
      transactions.forEach(function(transaction) {
        totalWei = totalWei.plus(transaction.value);
        checkIfAddressIsContractAddress(transaction.to, function(result) {
          const isContractAddress = result;
          displayTransactionData(transaction, isContractAddress, blockNo);
        });
      });
      convertTotalWeiToEtherAndDisplay(totalWei);
    } else {
      console.log(error);
    }
  });
}

function displayTransactionData(transaction, isContractAddress, blockNo) {
  $(".validation-error").empty();
  $(".no-data-message").hide();
  updateModalTitleWithSelectedBlockNo(blockNo);
  let valueInEther = web3.fromWei(transaction.value, "ether");
  $(".transaction-data").append(`
    <tr>
      <td> ${transaction.from} </td>
      <td> ${transaction.to} </td>
      <td> ${isContractAddress} </td>
      <td> ${valueInEther.toNumber()} </td>
    </tr>
    `);
}

function updateModalTitleWithSelectedBlockNo(blockNo) {
  $("#transactionDataModalLabel").text(
    `Block # ${blockNo} Transaction Details`
  );
}

function checkIfAddressIsContractAddress(toAddress, callback) {
  let isAddress = web3.isAddress(toAddress);
  if (isAddress) {
    web3.eth.getCode(toAddress, function(error, result) {
      if (!error) {
        if (result !== "0x") {
          output = "yes";
        } else {
          output = "";
        }
        return callback(output);
      } else {
      }
    });
  }
}

function convertTotalWeiToEtherAndDisplay(totalWei) {
  let totalForAllTransactionsInEther = web3.fromWei(totalWei, "ether");
  $(".total-ether").text(
    `Total Ether Transferred: ${totalForAllTransactionsInEther.toNumber()}`
  );
}
