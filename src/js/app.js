window.addEventListener("load", function() {
  if (typeof web3 != "undefined") {
    web3js = new Web3(web3.currentProvider);
  } else {
    console.log("No web3? You should consider trying MetaMask!");
    web3js = new Web3(
      new Web3.providers.HttpProvider(
        "https://mainnet.infura.io/v3/fd5325c20c01481e8355583ef506e471"
      )
    );
  }

  startApp();
});

function startApp() {
  console.log(web3js);
}
