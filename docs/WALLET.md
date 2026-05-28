# Wallet Integration Behavior

This document covers wallet connection flows, expected errors, network/account change handling, and UX copy recommendations for ChainBridge.

## Supported Wallets

| Chain    | Wallet      | Browser Extension |
|----------|-------------|-------------------|
| Stellar  | Freighter   | `window.freighter` |
| Ethereum | MetaMask    | `window.ethereum`  |
| Bitcoin  | UniSat      | `window.unisat`    |

## Architecture

Wallet state is managed by a Zustand store with localStorage persistence so sessions survive page reloads.

| File | Role |
|------|------|
| [`frontend/src/hooks/useWallet.ts`](../frontend/src/hooks/useWallet.ts) | Core Zustand store — `connect`, `disconnect`, balance, error |
| [`frontend/src/lib/wallets/`](../frontend/src/lib/wallets/) | Per-chain adapters (Stellar, Ethereum, Bitcoin) |
| [`frontend/src/components/wallet/UnifiedWalletProvider.tsx`](../frontend/src/components/wallet/UnifiedWalletProvider.tsx) | React context that wraps the store for components |
| [`frontend/src/components/wallet/WalletConnectionModal.tsx`](../frontend/src/components/wallet/WalletConnectionModal.tsx) | Modal UI for chain selection and connect triggers |
| [`frontend/src/components/swap/WalletConnect.tsx`](../frontend/src/components/swap/WalletConnect.tsx) | Navbar/swap connect button and connected state display |
| [`frontend/src/types/wallet.ts`](../frontend/src/types/wallet.ts) | Shared TypeScript types (`WalletState`, `WalletStore`, `WalletAdapter`) |

## Happy Path — Connect Flow

```
User clicks "Connect Wallet"
  → WalletConnectionModal opens (chain picker)
  → User selects chain (Stellar / Ethereum / Bitcoin)
  → WalletConnect.handleConnect(chain) is called
  → useWalletStore.connect(chain) dispatches adapter.connect()
      Stellar  → Freighter popup → returns address + publicKey + network
      Ethereum → MetaMask popup  → returns address + chainId
      Bitcoin  → UniSat popup    → returns address + publicKey
  → adapter.getBalance(address) resolves
  → Store sets isConnected=true, address, walletName, network, balance
  → Toast: "Wallet connected" (or network warning if mismatched)
  → Modal closes
```

## Happy Path — Disconnect Flow

```
User clicks the disconnect (LogOut) button
  → disconnectActiveWallet() / useWalletStore.disconnect() called
  → Ethereum/UniSat event listeners detached
  → adapter.disconnect() called for the active chain
  → Store reset: address=null, isConnected=false, balance=null, etc.
```

## Network / Account Change Handling

### Ethereum (MetaMask)

| Event | Behavior |
|-------|----------|
| `accountsChanged` — new address | Store updates `address`; balance refetched |
| `accountsChanged` — empty (lock) | `disconnect()` triggered |
| `accountsChanged` — different address from initial | `disconnect()` triggered (security) |
| `chainChanged` | `network` updated; `isUnsupportedNetwork` re-evaluated against `EXPECTED_ETH_CHAIN_ID` |
| `disconnect` | `disconnect()` triggered |

### Bitcoin (UniSat)

| Event | Behavior |
|-------|----------|
| `accountsChanged` — new address | Store updates `address`; balance refetched |
| `accountsChanged` — empty | `disconnect()` triggered |
| `accountsChanged` — different address | `disconnect()` triggered |

### Stellar (Freighter)

Freighter does not emit realtime events. Network and account are captured at connect time. If a user changes their Freighter account or network they must disconnect and reconnect manually.

## Failure Cases

### Extension Not Installed

- **Stellar**: `window.freighter` is undefined → adapter throws `"Freighter not installed"`.
- **Ethereum**: `window.ethereum` is undefined → adapter throws `"MetaMask not installed"`.
- **Bitcoin**: `window.unisat` is undefined → adapter throws `"UniSat not installed"`.

**UX copy**: "Could not find [Wallet]. Make sure the browser extension is installed and enabled, then try again."

### User Rejects the Connection Prompt

The wallet extension closes the popup without granting permission.

**UX copy**: "Connection cancelled. Approve the request in your wallet extension to continue."

### Unsupported Network

The connected wallet is on a network that ChainBridge does not support (e.g., Ethereum Mainnet when Sepolia is required on testnet).

- `isUnsupportedNetwork: true` is set in the store.
- A warning banner appears below the connect button.

**UX copy** (Stellar): "Freighter is connected to [network]. Switch to [expectedNetwork] to use ChainBridge on the supported Stellar network."

**UX copy** (Ethereum): "MetaMask is connected to [network]. Switch to [expectedNetwork] to use ChainBridge on the supported Ethereum network."

### Balance Fetch Failure

`adapter.getBalance()` rejects (e.g., RPC timeout). This is treated as a transient error — the wallet remains connected but `balance` is `null`. No disconnect is forced. The UI shows `"..."` in the balance slot.

**UX copy**: Display `"..."` until a subsequent successful balance poll; no error toast.

### Generic Connection Error

Any unhandled adapter rejection sets `error` in the store and surfaces a toast.

**UX copy**: "Wallet connection failed. [error message from extension]. Please try again."

## Persistence

The following fields survive a page reload via `localStorage` key `chainbridge-wallet`:

- `address`, `publicKey`, `chain`, `network`, `walletName`, `isUnsupportedNetwork`, `isConnected`

`balance`, `error`, and `isConnecting` are session-only (not persisted).

## UX Copy Recommendations

| Scenario | Recommended Copy |
|----------|-----------------|
| Button — not connected | `Connect Wallet` |
| Button — connecting | `Connecting…` (spinner) |
| Button — connected | `[truncatedAddress] · [CHAIN]` |
| Toast — success | `Wallet connected` / `[WalletName] connected on [Network].` |
| Toast — unsupported network | `Unsupported [Chain] network` / `Switch [Wallet] to [ExpectedNetwork] to continue.` |
| Toast — failure | `Wallet connection failed` / `[error message]. Please try again.` |
| Disconnect tooltip | `Disconnect Wallet` |
| Settings page — no wallet | `No wallet connected. Connect a wallet from the swap page or the top navigation bar.` |

## Adding a New Chain Adapter

1. Create `frontend/src/lib/wallets/<chain>.ts` implementing `WalletAdapter` from [`frontend/src/types/wallet.ts`](../frontend/src/types/wallet.ts).
2. Register it in [`frontend/src/lib/wallets/index.ts`](../frontend/src/lib/wallets/index.ts) `getAdapter()`.
3. Add the chain to `ChainType` in [`frontend/src/types/wallet.ts`](../frontend/src/types/wallet.ts).
4. Wire event listeners for account/network changes in [`frontend/src/hooks/useWallet.ts`](../frontend/src/hooks/useWallet.ts) following the Ethereum pattern.
5. Add the wallet to the `WalletConnectionModal` chain list.
