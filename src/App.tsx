/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Trends from './components/Trends';
import VideoAnalyzer from './components/VideoAnalyzer';

export default function App() {
  const [activeTab, setActiveTab] = useState('trends');

  return (
    <div className="flex h-screen bg-gray-50 font-sans" dir="rtl">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'trends' && <Trends />}
        {activeTab === 'video' && <VideoAnalyzer />}
        {activeTab === 'analytics' && (
          <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center h-full text-gray-400">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">الإحصائيات</h2>
            <p>قريباً...</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center h-full text-gray-400">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">الإعدادات</h2>
            <p>قريباً...</p>
          </div>
        )}
      </main>
    </div>
  );
}
