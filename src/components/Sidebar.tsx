import React from 'react';
import { TrendingUp, Video, Settings, BarChart2 } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'trends', label: 'الترندات الحالية', icon: TrendingUp },
    { id: 'video', label: 'تحليل الفيديو', icon: Video },
    { id: 'analytics', label: 'إحصائيات', icon: BarChart2 },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-l border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          ترند سكاوت
        </h1>
        <p className="text-sm text-gray-500 mt-1">محلل السوشيال ميديا</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            م
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">مستخدم</p>
            <p className="text-xs text-gray-500">الخطة المجانية</p>
          </div>
        </div>
      </div>
    </div>
  );
}
