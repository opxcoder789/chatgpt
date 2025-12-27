import React, { useState } from 'react';
import { XIcon } from './Icons';

interface SettingsScreenProps {
  email: string;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onClose: () => void;
  onLogout: () => void;
  onUpgrade: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ email, apiKey, onApiKeyChange, onClose, onLogout, onUpgrade }) => {
  const [hapticEnabled, setHapticEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('haptic_enabled') !== 'false';
    }
    return true;
  });

  const toggleHaptic = () => {
    const newValue = !hapticEnabled;
    setHapticEnabled(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('haptic_enabled', String(newValue));
      // Trigger haptic feedback on toggle
      if (newValue && navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        />
        
        {/* Modal */}
        <div className="w-full max-w-[400px] bg-[#1c1c1e] text-white rounded-[32px] overflow-hidden shadow-2xl relative z-10 border border-white/10 animate-[fadeIn_0.2s_ease-out]">
            
            {/* Header */}
            <div className="flex items-center justify-center py-4 relative border-b border-white/5">
                <h2 className="text-[17px] font-semibold">Settings</h2>
                <button 
                    onClick={onClose}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#2c2c2e] rounded-full text-gray-400 hover:text-white hover:bg-[#3a3a3c] transition-colors"
                >
                    <XIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[80vh] scrollbar-thin">
            
                {/* App Section */}
                <div className="mb-6">
                    <div className="px-4 mb-2 text-[13px] font-medium text-gray-500 uppercase tracking-wide">App</div>
                    <div className="bg-[#2c2c2e] rounded-xl overflow-hidden divide-y divide-white/5">
                    <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-[16px]">Color Scheme</span>
                        <span className="text-[16px] text-gray-400">Dark</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-[16px]">Haptic Feedback</span>
                        <button 
                            onClick={toggleHaptic}
                            className={`w-[51px] h-[31px] rounded-full relative transition-all duration-300 ease-in-out cursor-pointer ${hapticEnabled ? 'bg-[#34c759]' : 'bg-[#3a3a3c]'}`}
                            aria-label="Toggle Haptic Feedback"
                        >
                            <div 
                                className={`absolute top-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-md transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${hapticEnabled ? 'left-[22px]' : 'left-[2px]'}`} 
                            />
                        </button>
                    </div>
                    </div>
                </div>

                {/* Developer / API Section */}
                <div className="mb-6">
                    <div className="px-4 mb-2 text-[13px] font-medium text-gray-500 uppercase tracking-wide">Developer</div>
                    <div className="bg-[#2c2c2e] rounded-xl overflow-hidden p-4">
                         <label className="block text-[15px] mb-2 font-medium">Custom API Key</label>
                         <input 
                            type="password"
                            value={apiKey}
                            onChange={(e) => onApiKeyChange(e.target.value)}
                            placeholder="Paste your Gemini API Key..."
                            className="w-full bg-[#1c1c1e] text-white px-3 py-3 rounded-lg border border-white/10 focus:border-white/30 outline-none text-[15px] placeholder-gray-600 font-mono"
                         />
                         <p className="text-[12px] text-gray-500 mt-2 leading-tight">
                             Leave blank to use the default provided key. Key is stored locally in your browser.
                         </p>
                    </div>
                </div>

                {/* Speech Section */}
                <div className="mb-6">
                    <div className="px-4 mb-2 text-[13px] font-medium text-gray-500 uppercase tracking-wide">Speech</div>
                    <div className="bg-[#2c2c2e] rounded-xl overflow-hidden divide-y divide-white/5">
                    <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-[16px]">Voice</span>
                        <span className="text-[16px] text-gray-400">Breeze</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-[16px]">Main Language</span>
                        <span className="text-[16px] text-gray-400">Auto-Detect</span>
                    </div>
                    </div>
                </div>

                {/* Account Section */}
                <div className="mb-6">
                    <div className="px-4 mb-2 text-[13px] font-medium text-gray-500 uppercase tracking-wide">Account</div>
                    <div className="bg-[#2c2c2e] rounded-xl overflow-hidden divide-y divide-white/5">
                    <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-[16px]">Email</span>
                        <span className="text-[16px] text-gray-400">{email || 'user@example.com'}</span>
                    </div>
                    <button 
                        onClick={onUpgrade}
                        className="w-full flex items-center justify-center px-4 py-3 bg-[#2c2c2e] hover:bg-[#3a3a3c] transition-colors text-[#ffd700] font-semibold text-[16px]"
                    >
                        Upgrade to ChatGPT Plus
                    </button>
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-center px-4 py-3 bg-[#2c2c2e] hover:bg-[#3a3a3c] transition-colors text-red-500 font-semibold text-[16px]"
                    >
                        Log Out
                    </button>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 mt-8 opacity-40">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <span className="text-xs text-white">ChatGPT for Web</span>
                </div>
            </div>
        </div>
    </div>
  );
};
