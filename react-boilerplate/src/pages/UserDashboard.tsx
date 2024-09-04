// src/pages/UserDashboard.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AssetList from '../components/AssetList';
import Notification from '../components/Notification';
import Modal from '../components/Modal';
import AssetForm from '../components/AssetForm';
import AssetDetails from '../components/AssetDetails';

interface Asset {
  assetId: string;
  assetName: string;
  assetType: string;
  description: string;
  imageUrl: string;
}

interface UserDashboardProps {
  account: string;
  contract: any;
  setNotification: (notification: { message: string; type: 'error' | 'success' }) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ account, contract, setNotification }) => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      assetId: '1',
      assetName: 'Asset 1',
      assetType: 'Certificate',
      description: 'This is a description for Asset 1',
      imageUrl: 'https://via.placeholder.com/150', // Dummy image URL
    },
    {
      assetId: '2',
      assetName: 'Asset 2',
      assetType: 'DigitalStamp',
      description: 'This is a description for Asset 2',
      imageUrl: 'https://via.placeholder.com/150', // Dummy image URL
    },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [verifyTokenId, setVerifyTokenId] = useState<string>('');
  const [verifiedAsset, setVerifiedAsset] = useState<Asset | null>(null);

  useEffect(() => {
    if (account) {
      fetchAssets(account);
    }
  }, [account]);

  const fetchAssets = async (address: string) => {
    try {
      const response = await fetch(`http://localhost:3001/assets?ownerAddress=${address}`);
      const data = await response.json();
      if (data.success) {
        setAssets(data.assets);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching assets', error);
      setNotification({ message: 'Failed to fetch assets', type: 'error' });
    }
  };

  const handleAssetSubmit = async (assetData: { assetName: string; assetType: string; assetId: string; image: File; details: Record<string, string> }) => {
    try {
      const formData = new FormData();
      formData.append('ownerAddress', account);
      formData.append('assetName', assetData.assetName);
      formData.append('assetType', assetData.assetType);
      formData.append('assetId', assetData.assetId);
      formData.append('description', assetData.details.description);
      formData.append('image', assetData.image);

      const response = await fetch('http://localhost:3001/add-asset', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setNotification({ message: 'Asset submitted successfully', type: 'success' });
        fetchAssets(account);
        closeAddModal(); // Close modal after successful submission
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error submitting asset', error);
      setNotification({ message: 'Failed to submit asset', type: 'error' });
    }
  };

  const handleVerifyAsset = async () => {
    try {
      const response = await fetch(`http://localhost:3001/verify-asset?tokenId=${verifyTokenId}`);
      const data = await response.json();
      if (data.success) {
        setVerifiedAsset(data.asset);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error verifying asset', error);
      setNotification({ message: 'Failed to verify asset', type: 'error' });
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedAsset(null); // Reset selected asset when closing modal
  };

  const openVerifyModal = () => {
    setIsVerifyModalOpen(true);
  };

  const closeVerifyModal = () => {
    setIsVerifyModalOpen(false);
    setVerifyTokenId('');
    setVerifiedAsset(null); // Reset verification state when closing modal
  };

  const viewAssetDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    openAddModal();
  };

  return (
    <div className="container mx-auto max-w-4xl mt-8 p-4 border-2 border-teal-900 bg-teal-800 rounded shadow-md">
      <h1 className="text-3xl font-bold text-center mb-4">User Dashboard</h1>

      {/* User Information */}
      <div className="mb-6 p-4 bg-teal-600 rounded">
        <h2 className="text-2xl font-semibold">Welcome, User!</h2>
        <p className="text-xl">Account: {account}</p>
      </div>

      {/* Asset Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.assetId}
            className="p-4 bg-white rounded shadow hover:bg-gray-200 cursor-pointer"
            onClick={() => viewAssetDetails(asset)}
          >
            <img src={asset.imageUrl} alt={asset.assetName} className="w-full h-32 object-cover rounded mb-4" />
            <h3 className="text-lg font-semibold">{asset.assetName}</h3>
            <p className="text-sm text-gray-600">{asset.assetType}</p>
            <p className="text-sm text-gray-600">{asset.description}</p>
          </div>
        ))}
      </div>

      {/* Add and Verify Asset Buttons */}
      <div className="text-center mt-6 grid grid-cols-2 gap-2">
        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded bg-teal-600 text-white"
        >
          Add Asset
        </button>
        <button
          onClick={openVerifyModal}
          className="px-4 py-2 rounded bg-teal-600 text-white"
        >
          Verify Asset
        </button>
      </div>

      {/* Modal for Adding Asset */}
      <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
        {selectedAsset ? (
          <div>
            <AssetDetails selectedAsset={selectedAsset} />
          </div>
        ) : (
          <div>
            <h2 className="font-semibold text-xl mb-4">Add Asset</h2>
            <AssetForm onSubmit={handleAssetSubmit} />
          </div>
        )}
      </Modal>

      {/* Modal for Verifying Asset */}
      <Modal isOpen={isVerifyModalOpen} onClose={closeVerifyModal}>
        <h2 className="font-semibold text-xl mb-4">Verify Asset</h2>
        <div className="mb-4">
          <input
            type="text"
            value={verifyTokenId}
            onChange={(e) => setVerifyTokenId(e.target.value)}
            placeholder="Enter Token ID"
            className="w-full p-2 bg-gray-200 rounded outline-none"
          />
        </div>
        <button
          onClick={handleVerifyAsset}
          className="px-4 py-2 mb-4 rounded bg-teal-600 text-white w-full"
        >
          Verify
        </button>
        {verifiedAsset && (
          <div>
            <AssetDetails selectedAsset={verifiedAsset} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserDashboard;
