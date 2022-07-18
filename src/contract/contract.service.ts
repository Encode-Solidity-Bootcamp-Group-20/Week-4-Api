import { Injectable } from '@nestjs/common';
import { ProviderService } from './../shared/services/provider/provider.service';
import { ethers } from 'ethers';
import { SignerService } from './../shared/services/signer/signer.service';
import * as TokenContract from '../../abi.json';
import { ExpressAdapter } from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ContractService {
  contractPublicInstance: ethers.Contract;
  contractSignedInstance: ethers.Contract;

  

  constructor(
    private providerService: ProviderService,
    private signerService: SignerService,
    private httpService: HttpService,
  ) {
    this.setupContractInstances();
  }

  setupContractInstances() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress || contractAddress.length === 0) return;
    this.contractPublicInstance = new ethers.Contract(
      contractAddress,
      TokenContract.abi,
      this.providerService.provider,
    );
    this.contractSignedInstance = new ethers.Contract(
      contractAddress,
      TokenContract.abi,
      this.signerService.signer,
    );
  }

  async getNFTMetadataById(id: number) {
    const url =
      'https://ipfs.io/ipfs/QmP5QyW4phUmDEwRh5CwSQTfM3ZrX1TTBmXErmtK3t2mfQ?filename=metadata.json';
      const url2 = 'ipfs://QmP5QyW4phUmDEwRh5CwSQTfM3ZrX1TTBmXErmtK3t2mfQ';
    //How do I query this in node?
    return this.httpService.get(url);
    // const metadata = this.httpService.get(url);
    // return metadata[id];
  }

  async mintTokens(address: string, amount: number) {
    const tx = await this.contractSignedInstance.mint(
      address,
      ethers.utils.parseEther(amount.toFixed(18)),
    );
    return tx;
  }
}
