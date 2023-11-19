# 🐱 Lmeow cart 🐱

The open source decentralized e-commerce software, with native web3 integration.

## Technologies Used

This is a Next.JS 13 app made with [NextUI](v2https://github.com/nextui-org/next-app-template). It integrates natively an API to connect an online store to any web3 wallet to allows the admin to claim the website by linking it to their address, and for customers to buy from the store.

### UI

- [Next.js 13](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

### API

- JavaScript
- MongoDB (deployed on [Clever Cloud](https://clever-cloud.com))
- [Chainlist](https://chainlist.org/) for direct connection to public RPCs

## How it works

1. Clone this repository
2. Install dependencies

```bash
npm install
```

2. Run the development server

```bash
npm run dev
```

3. Claim the store!

Go to `localhost:300/setup` to get started.

## Perks

Some cool things about this software:

### 🔑 Authentification

Claiming the store links it to your adress and your JWT token. Only you can access the administration zone, add products, check orders and customers.

### 🦄 Censorship resistant

This is a free software that anyone can clone, deploy and maintain or improve. Customers are identified by their Ethereum address and submit the information they'll wish, there is no KYC, no countries restrictions.

### 🌏 Access to Global Capital

Since this software integrates a cart and a payment system on its own, there are no restrictions you'll usually encounter with fiduciary online payment systems. Transactions amounts are unlimited and there are no geopolitical borders to take into account.

### 🏴‍☠️ Chain Agnostic

Since this software relies on public RPCs, you can connect it to any chain you wish.

## ⚠️ Precautions

Do not use this software before reading this:

### 👁️ Public Transactions

Almost all crypto transactions are recorded on a public ledger. Remember that your Ethereum address is public, so are the ones of your customers. Be careful before transacting with anyone.

You are discouraged from using this software for criminal activities on a public ledger.

### 💸 No paybacks

Refunds are left at the discretion of the seller. There is no native refund system in crypto, you are entirely accountable for who you send your money to. Keep that in mind before transacting or selling using this software.

## 💕 Final Words

There are no restrictions from using this software beside the MIT License from the app template. We created this, it's not much (but it's honest work) and we give it to you. Take it, change it, use it in another Next.JS template, use it with PHP or Rust, it's yours. Enjoy.

Licensed under the [MIT license](https://github.com/nextui-org/next-app-template/blob/main/LICENSE).
