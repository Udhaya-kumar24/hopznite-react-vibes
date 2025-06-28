import React, { useState } from 'react';
import Modal from '@/components/ui/Modal.jsx';
import { getDJWallet } from '@/services/api.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function getMonthYear(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

const DJWalletTab = ({
  wallet,
  walletLoading,
  addMoneyAmount,
  setAddMoneyAmount,
  handleAddMoney,
  setWallet,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [modalError, setModalError] = useState('');
  const [loading, setLoading] = useState(false);

  // Always use API data for the cards
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
  let monthEarnings = 0;
  let monthFees = 0;
  let monthEvents = 0;
  if (wallet.transactions && wallet.transactions.length) {
    wallet.transactions.forEach(tx => {
      if (getMonthYear(tx.date) === thisMonth) {
        if (tx.type === 'credit') {
          monthEarnings += tx.amount;
          monthEvents += 1;
        } else if (tx.type === 'debit') {
          monthFees += tx.amount;
        }
      }
    });
  }

  // Always use a number for payAmount
  const payAmount = selectedAmount || Number(customAmount) || 0;
  const isValidAmount = !isNaN(payAmount) && payAmount >= 500 && payAmount <= 100000;

  const handlePreset = (amt) => {
    setSelectedAmount(amt);
    setCustomAmount('');
    setModalError('');
  };
  const handleCustom = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    setSelectedAmount(0);
    setModalError('');
  };

  const handleTopUp = async () => {
    setModalError('');
    if (!isValidAmount) {
      setModalError('Amount must be between ₹500 and ₹100,000');
      return;
    }
    setLoading(true);
    setAddMoneyAmount(payAmount);
    await handleAddMoney();
    // Re-fetch wallet from API after top-up
    const res = await getDJWallet(1);
    if (res.success) setWallet(res.data);
    setLoading(false);
    setModalOpen(false);
    setSelectedAmount(0);
    setCustomAmount('');
    setModalError('');
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedAmount(0);
    setCustomAmount('');
    setModalError('');
  };

  return (
    <div className="">
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-center items-start shadow">
          <div className="text-lg font-semibold mb-1 text-foreground">Current Balance</div>
          <div className="text-3xl font-bold text-green-600 mb-1">₹{wallet.balance}</div>
          <div className="text-xs text-muted-foreground">Available for bookings</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-center items-start shadow">
          <div className="text-lg font-semibold mb-1 text-foreground">This Month Earnings</div>
          <div className="text-3xl font-bold mb-1 text-foreground">₹{monthEarnings.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">From {monthEvents} events</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-center items-start shadow">
          <div className="text-lg font-semibold mb-1 text-foreground">Platform Fees</div>
          <div className="text-3xl font-bold text-red-600 mb-1">₹{monthFees.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Booking deductions</div>
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <Button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded flex items-center gap-2" onClick={() => { setModalOpen(true); setModalError(''); }}>
          Top-Up Wallet
        </Button>
      </div>
      <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow">
        <div className="text-xl font-bold mb-2 text-foreground">Booking Deduction Structure</div>
        <div className="text-sm text-muted-foreground mb-4">Platform fees based on your booking amounts</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4 flex flex-col items-start bg-background">
            <div className="text-green-600 font-bold mb-1">₹1,000 - ₹4,000</div>
            <div className="text-2xl font-bold mb-1 text-foreground">₹100</div>
            <div className="text-xs text-muted-foreground">Per booking</div>
          </div>
          <div className="border border-border rounded-lg p-4 flex flex-col items-start bg-background">
            <div className="text-orange-600 font-bold mb-1">₹4,001 - ₹7,000</div>
            <div className="text-2xl font-bold mb-1 text-foreground">₹200</div>
            <div className="text-xs text-muted-foreground">Per booking</div>
          </div>
          <div className="border border-border rounded-lg p-4 flex flex-col items-start bg-background">
            <div className="text-red-600 font-bold mb-1">₹7,001 & above</div>
            <div className="text-2xl font-bold mb-1 text-foreground">₹300</div>
            <div className="text-xs text-muted-foreground">Per booking</div>
          </div>
        </div>
      </div>
      <Modal open={modalOpen} onClose={handleModalClose} title="Top-Up Wallet">
        <div className="text-sm text-muted-foreground mb-4">Add funds to your wallet for booking deductions</div>
        <div className="flex gap-2 mb-4">
          {[500, 1000, 2000].map((amt) => (
            <Button
              key={amt}
              variant={selectedAmount === amt ? 'default' : 'outline'}
              className={`flex-1 px-4 py-3 text-center ${selectedAmount === amt ? 'border-primary bg-primary/10' : ''}`}
              onClick={() => handlePreset(amt)}
            >
              <div className="text-xl font-bold">₹{amt}</div>
              <div className="text-xs">{amt === 500 ? 'Basic' : amt === 1000 ? 'Standard' : 'Premium'}</div>
            </Button>
          ))}
        </div>
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">Custom Amount (₹)</Label>
          <Input
            type="number"
            className={customAmount && !isValidAmount ? 'border-red-500' : ''}
            placeholder="Enter amount"
            value={customAmount}
            onChange={handleCustom}
            min={500}
            max={100000}
          />
          {customAmount && !isValidAmount && (
            <div className="text-xs text-red-600 mt-1">Amount must be between ₹500 and ₹100,000</div>
          )}
        </div>
        {modalError && <div className="text-red-600 text-sm mb-2">{modalError}</div>}
        <div className="mb-4 text-xs text-muted-foreground">Payment Gateway: Razorpay (Secure)</div>
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg flex items-center justify-center gap-2 text-lg font-semibold"
          onClick={handleTopUp}
          disabled={loading || !isValidAmount}
        >
          Pay ₹{payAmount}
        </Button>
      </Modal>
      {/* Transaction List */}
      <div className="bg-card border border-border rounded-xl p-6 mt-6 shadow">
        <div className="text-lg font-bold mb-2 text-foreground">Recent Transactions</div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {wallet.transactions && wallet.transactions.length ? wallet.transactions.map(tx => (
            <div key={tx.id} className="flex justify-between p-2 bg-muted/50 rounded">
              <span className="text-foreground">{tx.description}</span>
              <span className={tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
              </span>
              <span className="text-xs text-muted-foreground">{tx.date}</span>
            </div>
          )) : <div className="text-muted-foreground">No transactions yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default DJWalletTab; 