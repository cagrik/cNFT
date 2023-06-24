"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
var spl_account_compression_1 = require("@solana/spl-account-compression");
var mpl_bubblegum_1 = require("@metaplex-foundation/mpl-bubblegum");
var mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
var generated_1 = require("@metaplex-foundation/mpl-bubblegum/dist/src/generated");
var fs = require("fs");
var initBalance, balance;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var keyfileBytes, payer, testWallet, connection, maxDepthSizePair, canopyDepth, treeKeypair, tree, collectionMetadataV3, collection, compressedNFTMetadata;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                keyfileBytes = JSON.parse(fs.readFileSync('id.json', { encoding: "utf-8" }));
                payer = web3_js_1.Keypair.fromSecretKey(new Uint8Array(keyfileBytes));
                testWallet = web3_js_1.Keypair.fromSecretKey(new Uint8Array(keyfileBytes));
                connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
                console.log("İşlemi gerçekleştiren cüzdan adresi:", payer.publicKey.toBase58());
                console.log("Deneme Cüzdan adresi:", testWallet.publicKey.toBase58());
                return [4 /*yield*/, connection.getBalance(payer.publicKey)];
            case 1:
                //işlem öncesi cüzdan bakiyesi
                initBalance = _a.sent();
                maxDepthSizePair = {
                    maxDepth: 14,
                    maxBufferSize: 64,
                };
                canopyDepth = maxDepthSizePair.maxDepth - 5;
                treeKeypair = web3_js_1.Keypair.generate();
                return [4 /*yield*/, createTree(connection, payer, treeKeypair, maxDepthSizePair, canopyDepth)];
            case 2:
                tree = _a.sent();
                collectionMetadataV3 = {
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
                return [4 /*yield*/, createCollection(connection, payer, collectionMetadataV3)];
            case 3:
                collection = _a.sent();
                compressedNFTMetadata = {
                    name: "Brazilian Legends",
                    symbol: "Brasil",
                    uri: "https://raw.githubusercontent.com/cagrik/cNFT/master/metadata.json",
                    creators: [
                        {
                            address: payer.publicKey,
                            verified: false,
                            share: 100,
                        },
                        {
                            address: testWallet.publicKey,
                            verified: false,
                            share: 0,
                        },
                    ],
                    editionNonce: 0,
                    uses: null,
                    collection: null,
                    primarySaleHappened: false,
                    sellerFeeBasisPoints: 0,
                    isMutable: false,
                    tokenProgramVersion: mpl_bubblegum_1.TokenProgramVersion.Original,
                    tokenStandard: mpl_bubblegum_1.TokenStandard.NonFungible,
                };
                console.log("Minting a single compressed NFT to ".concat(payer.publicKey.toBase58(), "..."));
                return [4 /*yield*/, mintCompressedNFT(connection, payer, treeKeypair.publicKey, collection.mint, collection.metadataAccount, collection.masterEditionAccount, compressedNFTMetadata, payer.publicKey)];
            case 4:
                _a.sent();
                // 
                console.log("1 adet s\u0131k\u0131\u015Ft\u0131r\u0131lm\u0131\u015F nft olu\u015Fturuluyor ".concat(testWallet.publicKey.toBase58(), "..."));
                return [4 /*yield*/, mintCompressedNFT(connection, payer, treeKeypair.publicKey, collection.mint, collection.metadataAccount, collection.masterEditionAccount, compressedNFTMetadata, 
                    // nft'nin gönderileceği adres
                    testWallet.publicKey)];
            case 5:
                _a.sent();
                return [4 /*yield*/, connection.getBalance(payer.publicKey)];
            case 6:
                //işlem öncesi cüzdan bakiyesi
                balance = _a.sent();
                console.log("===============================");
                console.log("Total cost:", numberFormatter((initBalance - balance) / web3_js_1.LAMPORTS_PER_SOL, true), "SOL\n");
                return [2 /*return*/];
        }
    });
}); })();
function createTree(connection, payer, treeKeypair, maxDepthSizePair, canopyDepth) {
    if (canopyDepth === void 0) { canopyDepth = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, treeAuthority, _bump, allocTreeIx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Merkle tree oluşturuluyor");
                    console.log("ağaç adresi:", treeKeypair.publicKey.toBase58());
                    _a = web3_js_1.PublicKey.findProgramAddressSync([treeKeypair.publicKey.toBuffer()], generated_1.PROGRAM_ID), treeAuthority = _a[0], _bump = _a[1];
                    console.log("treeAuthority:", treeAuthority.toBase58());
                    return [4 /*yield*/, (0, spl_account_compression_1.createAllocTreeIx)(connection, treeKeypair.publicKey, payer.publicKey, maxDepthSizePair, canopyDepth)];
                case 1:
                    allocTreeIx = _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
;
function createCollection(connection, payer, metadataV3) {
    return __awaiter(this, void 0, void 0, function () {
        var mint, tokenAccount, mintSig, _a, metadataAccount, _bump, createMetadataIx, _b, masterEditionAccount, _bump2, createMasterEditionIx, collectionSizeIX, tx, txSignature, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("Koleksiyon oluşturuluyor");
                    return [4 /*yield*/, (0, spl_token_1.createMint)(connection, payer, 
                        // mint authority
                        payer.publicKey, 
                        // freeze authority
                        payer.publicKey, 
                        // `0` NFT için
                        0)];
                case 1:
                    mint = _c.sent();
                    console.log("Mint addresi:", mint.toBase58());
                    // token hesabı oluştur
                    console.log("Token Hesabı oluşturuluyor");
                    return [4 /*yield*/, (0, spl_token_1.createAccount)(connection, payer, mint, payer.publicKey)];
                case 2:
                    tokenAccount = _c.sent();
                    console.log("Token hesabı:", tokenAccount.toBase58());
                    // mint 1 token ()
                    console.log("Koleksiyon için 1 adet token oluşturuluyor");
                    return [4 /*yield*/, (0, spl_token_1.mintTo)(connection, payer, mint, tokenAccount, payer, 1, [], undefined, spl_token_1.TOKEN_PROGRAM_ID)];
                case 3:
                    mintSig = _c.sent();
                    _a = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("metadata", "utf8"), mpl_token_metadata_1.PROGRAM_ID.toBuffer(), mint.toBuffer()], mpl_token_metadata_1.PROGRAM_ID), metadataAccount = _a[0], _bump = _a[1];
                    console.log("Metadata hesabı:", metadataAccount.toBase58());
                    createMetadataIx = (0, mpl_token_metadata_1.createCreateMetadataAccountV3Instruction)({
                        metadata: metadataAccount,
                        mint: mint,
                        mintAuthority: payer.publicKey,
                        payer: payer.publicKey,
                        updateAuthority: payer.publicKey,
                    }, {
                        createMetadataAccountArgsV3: metadataV3,
                    });
                    _b = web3_js_1.PublicKey.findProgramAddressSync([
                        Buffer.from("metadata", "utf8"),
                        mpl_token_metadata_1.PROGRAM_ID.toBuffer(),
                        mint.toBuffer(),
                        Buffer.from("edition", "utf8"),
                    ], mpl_token_metadata_1.PROGRAM_ID), masterEditionAccount = _b[0], _bump2 = _b[1];
                    console.log("Master edition hesabı:", masterEditionAccount.toBase58());
                    createMasterEditionIx = (0, mpl_token_metadata_1.createCreateMasterEditionV3Instruction)({
                        edition: masterEditionAccount,
                        mint: mint,
                        mintAuthority: payer.publicKey,
                        payer: payer.publicKey,
                        updateAuthority: payer.publicKey,
                        metadata: metadataAccount,
                    }, {
                        createMasterEditionArgs: {
                            maxSupply: 0,
                        },
                    });
                    collectionSizeIX = (0, mpl_token_metadata_1.createSetCollectionSizeInstruction)({
                        collectionMetadata: metadataAccount,
                        collectionAuthority: payer.publicKey,
                        collectionMint: mint,
                    }, {
                        setCollectionSizeArgs: { size: 8 },
                    });
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    tx = new web3_js_1.Transaction()
                        .add(createMetadataIx)
                        .add(createMasterEditionIx)
                        .add(collectionSizeIX);
                    tx.feePayer = payer.publicKey;
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, tx, [payer], {
                            commitment: "confirmed",
                            skipPreflight: true,
                        })];
                case 5:
                    txSignature = _c.sent();
                    console.log("\nKoleksiyon başarılı bir şekilde oluşturuldu!");
                    console.log(txSignature);
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _c.sent();
                    console.error("\nKoleksiyon oluşturulamadı:", err_1);
                    throw err_1;
                case 7: return [2 /*return*/, { mint: mint, tokenAccount: tokenAccount, metadataAccount: metadataAccount, masterEditionAccount: masterEditionAccount }];
            }
        });
    });
}
function mintCompressedNFT(connection, payer, treeAddress, collectionMint, collectionMetadata, collectionMasterEditionAccount, compressedNFTMetadata, receiverAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, treeAuthority, _bump, _b, bubblegumSigner, _bump2, mintIxs, metadataArgs, computedDataHash, computedCreatorHash, tx2, txSignature, err_2;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = web3_js_1.PublicKey.findProgramAddressSync([treeAddress.toBuffer()], generated_1.PROGRAM_ID), treeAuthority = _a[0], _bump = _a[1];
                    _b = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("collection_cpi", "utf8")], generated_1.PROGRAM_ID), bubblegumSigner = _b[0], _bump2 = _b[1];
                    mintIxs = [];
                    metadataArgs = Object.assign(compressedNFTMetadata, {
                        collection: { key: collectionMint, verified: false },
                    });
                    computedDataHash = new web3_js_1.PublicKey((0, mpl_bubblegum_1.computeDataHash)(metadataArgs)).toBase58();
                    computedCreatorHash = new web3_js_1.PublicKey((0, mpl_bubblegum_1.computeCreatorHash)(metadataArgs.creators)).toBase58();
                    console.log("computedDataHash:", computedDataHash);
                    console.log("computedCreatorHash:", computedCreatorHash);
                    mintIxs.push((0, mpl_bubblegum_1.createMintToCollectionV1Instruction)({
                        payer: payer.publicKey,
                        merkleTree: treeAddress,
                        treeAuthority: treeAuthority,
                        treeDelegate: payer.publicKey,
                        leafOwner: receiverAddress || payer.publicKey,
                        leafDelegate: payer.publicKey,
                        collectionAuthority: payer.publicKey,
                        collectionAuthorityRecordPda: generated_1.PROGRAM_ID,
                        collectionMint: collectionMint,
                        collectionMetadata: collectionMetadata,
                        editionAccount: collectionMasterEditionAccount,
                        compressionProgram: spl_account_compression_1.SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
                        logWrapper: spl_account_compression_1.SPL_NOOP_PROGRAM_ID,
                        bubblegumSigner: bubblegumSigner,
                        tokenMetadataProgram: mpl_token_metadata_1.PROGRAM_ID,
                    }, {
                        metadataArgs: metadataArgs,
                    }));
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    tx2 = (_c = new web3_js_1.Transaction()).add.apply(_c, mintIxs);
                    tx2.feePayer = payer.publicKey;
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, tx2, [payer], {
                            commitment: "confirmed",
                            skipPreflight: true,
                        })];
                case 2:
                    txSignature = _d.sent();
                    console.log("\nSıkıştırılmış NFT başarılı bir şekilde oluşturuldu");
                    console.log(txSignature);
                    return [2 /*return*/, txSignature];
                case 3:
                    err_2 = _d.sent();
                    console.error("\nSıkıştırılmış NFT oluşturulamadı", err_2);
                    throw err_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function numberFormatter(num, forceDecimals) {
    if (forceDecimals === void 0) { forceDecimals = false; }
    var minimumFractionDigits = num < 1 || forceDecimals ? 10 : 2;
    return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: minimumFractionDigits,
    }).format(num);
}
