import { ConnectKitButton } from "connectkit";

export const ConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <button
            onClick={show}
            className="bg-gradient-to-r from-[#E7692C] to-[#EB88EF] px-6 py-2 rounded-full font-carbonic text-white hover:opacity-90 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};