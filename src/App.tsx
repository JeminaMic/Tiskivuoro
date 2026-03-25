/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, RefreshCw, CheckCircle2, Settings2, Trash2 } from 'lucide-react';
import { User, TurnState } from './types';

export default function App() {
  const [state, setState] = useState<TurnState>(() => {
    const saved = localStorage.getItem('tiskivuoro_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse state', e);
      }
    }
    return {
      currentTurnUserId: '1',
      users: [
        { id: '1', name: 'E' },
        { id: '2', name: 'J' }
      ],
      lastUpdated: Date.now()
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editNames, setEditNames] = useState({
    user1: state.users[0].name,
    user2: state.users[1].name
  });

  useEffect(() => {
    localStorage.setItem('tiskivuoro_state', JSON.stringify(state));
  }, [state]);

  const toggleTurn = () => {
    setState(prev => ({
      ...prev,
      currentTurnUserId: prev.currentTurnUserId === '1' ? '2' : '1',
      lastUpdated: Date.now()
    }));
  };

  const saveNames = () => {
    setState(prev => ({
      ...prev,
      users: [
        { ...prev.users[0], name: editNames.user1 },
        { ...prev.users[1], name: editNames.user2 }
      ]
    }));
    setIsEditing(false);
  };

  const resetData = () => {
    if (window.confirm('Haluatko varmasti nollata kaikki tiedot?')) {
      localStorage.removeItem('tiskivuoro_state');
      window.location.reload();
    }
  };

  const currentUser = state.users.find(u => u.id === state.currentTurnUserId);
  const otherUser = state.users.find(u => u.id !== state.currentTurnUserId);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50">
      <div className="w-full max-w-md space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Tiskivuoro</h1>
          <p className="text-zinc-500">Kenen vuoro on hoitaa tiskit?</p>
        </header>

        <main className="relative">
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div
                key="display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  {state.users.map((user) => {
                    const isCurrent = user.id === state.currentTurnUserId;
                    return (
                      <div
                        key={user.id}
                        className={`relative p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-4 ${
                          isCurrent
                            ? 'bg-white border-zinc-900 shadow-xl scale-105 z-10'
                            : 'bg-zinc-100 border-transparent opacity-60 grayscale'
                        }`}
                      >
                        <div className={`p-4 rounded-full ${isCurrent ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                          <UserIcon size={32} />
                        </div>
                        <span className="text-2xl font-bold">{user.name}</span>
                        {isCurrent && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full border-4 border-white"
                          >
                            <CheckCircle2 size={20} />
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="text-center space-y-4 pt-4">
                  <p className="text-lg font-medium text-zinc-700">
                    Nyt on <span className="text-zinc-900 font-bold">{currentUser?.name}</span>:n vuoro!
                  </p>
                  <button
                    onClick={toggleTurn}
                    className="w-full py-4 px-6 bg-zinc-900 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-zinc-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={20} />
                    Merkkaa tehdyksi
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="edit"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-8 rounded-3xl shadow-xl border border-zinc-200 space-y-6"
              >
                <h2 className="text-xl font-bold">Muokkaa nimiä</h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Henkilö 1</label>
                    <input
                      type="text"
                      value={editNames.user1}
                      onChange={(e) => setEditNames(prev => ({ ...prev, user1: e.target.value }))}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      placeholder="Esim. E"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Henkilö 2</label>
                    <input
                      type="text"
                      value={editNames.user2}
                      onChange={(e) => setEditNames(prev => ({ ...prev, user2: e.target.value }))}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      placeholder="Esim. J"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 px-4 bg-zinc-100 text-zinc-600 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
                  >
                    Peruuta
                  </button>
                  <button
                    onClick={saveNames}
                    className="flex-1 py-3 px-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
                  >
                    Tallenna
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="flex justify-center gap-4 pt-8">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-3 text-zinc-400 hover:text-zinc-900 hover:bg-white rounded-full transition-all"
            title="Asetukset"
          >
            <Settings2 size={24} />
          </button>
          <button
            onClick={resetData}
            className="p-3 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
            title="Nollaa"
          >
            <Trash2 size={24} />
          </button>
        </footer>
      </div>
    </div>
  );
}
