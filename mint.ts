import {
  Keypair,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  PublicKey, Transaction,
  sendAndConfirmTransaction, Connection,
  TransactionInstruction,
} from "@solana/web3.js";
import { createAccount, createMint, mintTo, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  ValidDepthSizePair,
  getConcurrentMerkleTreeAccountSize,
  createAllocTreeIx,
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import {
  MetadataArgs,
  TokenProgramVersion,
  TokenStandard, createCreateTreeInstruction,
  createMintToCollectionV1Instruction,
  computeCreatorHash,
  computeDataHash,
} from "@metaplex-foundation/mpl-bubblegum";
import { 
  CreateMetadataAccountArgsV3, 
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
   createCreateMasterEditionV3Instruction,
   createCreateMetadataAccountV3Instruction,
   createSetCollectionSizeInstruction} from "@metaplex-foundation/mpl-token-metadata";
import { PROGRAM_ID as BUBBLEGUM_PROGRAM_ID, compressStruct } from "@metaplex-foundation/mpl-bubblegum/dist/src/generated";
import * as fs from 'fs';


let initBalance: number, balance: number;

(async () => {

//yerel cüzdan bilgilerini içeri aktarın
  const keyfileBytes = JSON.parse(fs.readFileSync('id.json', { encoding: "utf-8" }));

  const payer = Keypair.fromSecretKey(new Uint8Array(keyfileBytes));
  const testWallet = Keypair.fromSecretKey(new Uint8Array(keyfileBytes));
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  
  console.log("İşlemi gerçekleştiren cüzdan adresi:", payer.publicKey.toBase58());
  console.log("Deneme Cüzdan adresi:", testWallet.publicKey.toBase58());

 

  //işlem öncesi cüzdan bakiyesi
  initBalance = await connection.getBalance(payer.publicKey);



  
   //Ağaç boyutu için parametreleri ayarlayın
  
  const maxDepthSizePair: ValidDepthSizePair = {
   
    maxDepth: 5,
    maxBufferSize: 8,
  };
  const canopyDepth = maxDepthSizePair.maxDepth - 2;


  // ağacın oluşturulacağı adres
  const treeKeypair = Keypair.generate();

  // zincir üzerinde ağaç oluşturma işlemi
  const tree = await createTree(connection, payer, treeKeypair, maxDepthSizePair, canopyDepth);


  const collectionMetadataV3: CreateMetadataAccountArgsV3 = {
    data: {
      name: "Brazilian Legends",
         symbol: "Brasil",
         uri: "https://raw.githubusercontent.com/cagrik/cNFT/master/metadata.json",
      sellerFeeBasisPoints: 100,
      creators: [
        {
          address: payer.publicKey,
          verified: false,
          share: 100,
        },
      ],
      collection: null,
      uses: null,
    },
    isMutable: false,
    collectionDetails: null,
  };

  
  const collection = await createCollection(connection, payer, collectionMetadataV3);



  const compressedNFTMetadata: MetadataArgs = {
    name: "Brazilian Legends",
    symbol: "Brasil",
    uri: "https://raw.githubusercontent.com/cagrik/cNFT/master/metadata.json",
    creators: [
      {
        address: payer.publicKey,
        verified: false,
        share: 100,
      },
    ],
    editionNonce: 0,
    uses: null,
    collection: null,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 0,
    isMutable: false,
    tokenProgramVersion: TokenProgramVersion.Original,
    tokenStandard: TokenStandard.NonFungible,
  };

 
  console.log(`Minting a single compressed NFT to ${payer.publicKey.toBase58()}...`);

  await mintCompressedNFT(
    connection,
    payer,
    treeKeypair.publicKey,
    collection.mint,
    collection.metadataAccount,
    collection.masterEditionAccount,
    compressedNFTMetadata,
    payer.publicKey,
  );

  // 
  console.log(`1 adet sıkıştırılmış nft oluşturuluyor ${testWallet.publicKey.toBase58()}...`);

  await mintCompressedNFT(
    connection,
    payer,
    treeKeypair.publicKey,
    collection.mint,
    collection.metadataAccount,
    collection.masterEditionAccount,
    compressedNFTMetadata,
    // nft'nin gönderileceği adres
    testWallet.publicKey,
  );

 //işlem öncesi cüzdan bakiyesi
  balance = await connection.getBalance(payer.publicKey);

  console.log(`===============================`);
  console.log(
    "Total cost:",
    numberFormatter((initBalance - balance) / LAMPORTS_PER_SOL, true),
    "SOL\n",
  );
})();

async function createTree(
  connection: Connection,
  payer: Keypair,
  treeKeypair: Keypair,
  maxDepthSizePair: ValidDepthSizePair,
  canopyDepth: number = 0,
) {
  console.log("Merkle tree oluşturuluyor");
  console.log("ağaç adresi:", treeKeypair.publicKey.toBase58());

  
  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [treeKeypair.publicKey.toBuffer()],
    BUBBLEGUM_PROGRAM_ID,
  );
  console.log("treeAuthority:", treeAuthority.toBase58());

  const allocTreeIx = await createAllocTreeIx(
    connection,
    treeKeypair.publicKey,
    payer.publicKey,
    maxDepthSizePair,
    canopyDepth,
  )};
  async function createCollection(
    connection: Connection,
    payer: Keypair,
    metadataV3: CreateMetadataAccountArgsV3,
  ) {
    
    console.log("Koleksiyon oluşturuluyor");
    const mint = await createMint(
      connection,
      payer,
      // mint authority
      payer.publicKey,
      // freeze authority
      payer.publicKey,
      // `0` NFT için
      0,
    );
    console.log("Mint addresi:", mint.toBase58());
  
    // token hesabı oluştur
    console.log("Token Hesabı oluşturuluyor");
    const tokenAccount = await createAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
    );
    console.log("Token hesabı:", tokenAccount.toBase58());
  
    // mint 1 token ()
    console.log("Koleksiyon için 1 adet token oluşturuluyor");
    const mintSig = await mintTo(
      connection,
      payer,
      mint,
      tokenAccount,
      payer,
      1,
      [],
      undefined,
      TOKEN_PROGRAM_ID,
    );
    
     
    const [metadataAccount, _bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("metadata", "utf8"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID,
    );
    console.log("Metadata hesabı:", metadataAccount.toBase58());
  
    // metadata hesabı oluşturmak için instruction
    const createMetadataIx = createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataAccount,
        mint: mint,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: payer.publicKey,
      },
      {
        createMetadataAccountArgsV3: metadataV3,
      },
    );
  
   
    const [masterEditionAccount, _bump2] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata", "utf8"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition", "utf8"),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    );
    console.log("Master edition hesabı:", masterEditionAccount.toBase58());
  
    //  metadata hesabı oluşturmak için instruction
    const createMasterEditionIx = createCreateMasterEditionV3Instruction(
      {
        edition: masterEditionAccount,
        mint: mint,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: payer.publicKey,
        metadata: metadataAccount,
      },
      {
        createMasterEditionArgs: {
          maxSupply: 0,
        },
      },
    );
  
    // koleksiyon boyutu için instruction
    const collectionSizeIX = createSetCollectionSizeInstruction(
      {
        collectionMetadata: metadataAccount,
        collectionAuthority: payer.publicKey,
        collectionMint: mint,
      },
      {
        setCollectionSizeArgs: { size: 8 },
      },
    );
  
    try {
      
      const tx = new Transaction()
        .add(createMetadataIx)
        .add(createMasterEditionIx)
        .add(collectionSizeIX);
      tx.feePayer = payer.publicKey;
  
      // işlemi onaylayın
      const txSignature = await sendAndConfirmTransaction(connection, tx, [payer], {
        commitment: "confirmed",
        skipPreflight: true,
      });
  
      console.log("\nKoleksiyon başarılı bir şekilde oluşturuldu!");
      console.log(txSignature);
    } catch (err) {
      console.error("\nKoleksiyon oluşturulamadı:", err);
  
      
       
  
      throw err;
    }
  
   
    return { mint, tokenAccount, metadataAccount, masterEditionAccount };
  }
  async function mintCompressedNFT(
    connection: Connection,
    payer: Keypair,
    treeAddress: PublicKey,
    collectionMint: PublicKey,
    collectionMetadata: PublicKey,
    collectionMasterEditionAccount: PublicKey,
    compressedNFTMetadata: MetadataArgs,
    receiverAddress?: PublicKey,
  ) {
    
    const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
      [treeAddress.toBuffer()],
      BUBBLEGUM_PROGRAM_ID,
    );
  
    
    const [bubblegumSigner, _bump2] = PublicKey.findProgramAddressSync(
      
      [Buffer.from("collection_cpi", "utf8")],
      BUBBLEGUM_PROGRAM_ID,
    );
  
    // Tek seferde birden fazla sıkıştırılmış nft üretin
    const mintIxs: TransactionInstruction[] = [];
  
  
    const metadataArgs = Object.assign(compressedNFTMetadata, {
      collection: { key: collectionMint, verified: false },
    });
  
  
    const computedDataHash = new PublicKey(computeDataHash(metadataArgs)).toBase58();
    const computedCreatorHash = new PublicKey(computeCreatorHash(metadataArgs.creators)).toBase58();
    console.log("computedDataHash:", computedDataHash);
    console.log("computedCreatorHash:", computedCreatorHash);
  
   
    mintIxs.push(
      createMintToCollectionV1Instruction(
        {
          payer: payer.publicKey,
  
          merkleTree: treeAddress,
          treeAuthority,
          treeDelegate: payer.publicKey,
  
         
          leafOwner: receiverAddress || payer.publicKey,
        
          leafDelegate: payer.publicKey,
  
          
  
           
          collectionAuthority: payer.publicKey,
          collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
          collectionMint: collectionMint,
          collectionMetadata: collectionMetadata,
          editionAccount: collectionMasterEditionAccount,
  
          
          compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
          logWrapper: SPL_NOOP_PROGRAM_ID,
          bubblegumSigner: bubblegumSigner,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        },
        {
          metadataArgs,
        },
      ),
    );
  
    try {
      
      const tx2 = new Transaction().add(...mintIxs);
      tx2.feePayer = payer.publicKey;
  
      // İşlemi onayla
      const txSignature = await sendAndConfirmTransaction(connection, tx2, [payer], {
        commitment: "confirmed",
        skipPreflight: true,
      });
  
      console.log("\nSıkıştırılmış NFT başarılı bir şekilde oluşturuldu");
      console.log(txSignature);
  
      return txSignature;
    } catch (err) {
      console.error("\nSıkıştırılmış NFT oluşturulamadı", err);
  
     
       
  
      throw err;
    }}

    function numberFormatter(num: number, forceDecimals = false) {
 
      const minimumFractionDigits = num < 1 || forceDecimals ? 10 : 2;
  

      return new Intl.NumberFormat(undefined, {
          minimumFractionDigits,
      }).format(num);
  }