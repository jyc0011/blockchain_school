const ImageNFT = artifacts.require("myNFT");

module.exports =function (deployer){
    const name="MyNFT";
    const symbol="MNT";
    deployer.deploy(ImageNFT,name,symbol);
}