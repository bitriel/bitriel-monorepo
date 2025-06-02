# Loyalty Program with Simple ERC20 Standard for Future Interoperability with Other Loyalty Programs

## Authentication & Linked Address

Create a web3-based loyalty program linked to normal web2 users' authentication, such as email, OAuth, or JWT.

You can use the [Bitriel SDK](https://github.com/bitriel/wallet-sdk) to generate unique addresses and map them to authenticated users on your web app. This will expedite wallet creation and ensure interoperability with future tokens and addresses on the Selendra Network and other EVM-based chains.

Bitriel is a non-custodial wallet, but if you use Bitriel to generate addresses for your users, you are essentially holding custody for them. Therefore, we recommend encrypting the seed phrase for each wallet address generated and linking it to the user's authenticated account.

## Smart Contract

An ERC20 smart contract with functions such as event handling to listen to web2 API calls for logic to mint tokens, transfer to intended authenticated addresses, or trigger burns when users redeemed.

The smart contract can be developed and tested on remix.selendra.org by selecting the testnet for testing and the mainnet for production. You can request testnet tokens via the [Selendra Group](https://t.me/selendranetwork) community.

For documentation on how to use Selendra Remix, visit [Selendra Remix Documentation](https://www.selendra.org/documents/develop/contracts/evm).

### Blockchain Gas Sponsorship

Ideally, we should airdrop 1-2 SEL tokens to authenticated users so they can perform blockchain operations on your app without worrying about or needing to understand blockchain. Selendra Gas fees are very low, and this amount of SEL could allow them to execute thousands of normal transactions.

This can be achieved by transferring SEL tokens to authenticated addresses from a master address. This function can also be included in the smart contract.

Your organization can request SEL token for each user.

If you have any question, please reach out to the team directly or via Selendra Community above.
