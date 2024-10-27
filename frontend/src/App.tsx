import { useState } from 'react';
import './App.css';
import { WindowSetAlwaysOnTop } from '../wailsjs/runtime';
import { Pin, Info } from 'lucide-react';
import { FirstMethod } from '../wailsjs/go/main/App'

import { BertrandPage } from './pages/Bertrandpage';
import { CatalanPage } from './pages/CatalanPage';
import { PrisonersPage } from './pages/PrisonersPage';
import { SecretaryPage } from './pages/SecretaryPage';

function TopmostPin() {
    const [isChecked, setIsChecked] = useState(false);

    const setTopmost = (turnOn: boolean) => {
        WindowSetAlwaysOnTop(turnOn);
    };

    const handleClick = () => {
        const newState = !isChecked;
        setIsChecked(newState);
        setTopmost(newState);
    };

    return (
        <button
            onClick={handleClick}
            className="bg-transparent border-none cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
            title={isChecked ? "取消置頂" : "置頂"}
        >
            <Pin
                size={20}
                className={`transition-transform ${isChecked ? 'text-blue-500' : 'text-gray-500'}`}
                style={{
                    transform: isChecked ? 'rotate(0deg)' : 'rotate(-45deg)'
                }}
            />
        </button>
    );
}

function About(props: any) {
    const [isOpen, setIsOpen] = [props.isOpen, props.setIsOpen];

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            <button
                onClick={openModal}
                className="bg-transparent border-none cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="關於"
            >
                <Info size={20} className="text-gray-500" />
            </button>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-black p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">關於我們</h2>
                        <p className="mb-4 text-left">這是用來模擬伯特蘭悖論、卡特蘭數、祕書問題、囚犯問題的程式。</p>
                        <p className='text-left'>作者：</p>
                        <p className='text-left'>程式 & GUI：侯竣奇</p>
                        <p className='text-left'>理論推導：鄭弘翊</p>
                        <p></p>
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            關閉
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

function Menu(props: any) {
    const [activePage, setActivePage] = [props.activePage, props.setActivePage]
    const [isOpen, setIsOpen] = useState(false);

    const renderPage = () => {
        switch (activePage) {
            case 'bertrand':
                return <BertrandPage />;
            case 'catalan':
                return <CatalanPage />;
            case 'secretary':
                return <SecretaryPage />;
            case 'prisoners':
                return <PrisonersPage />;
            default:
                return <div />;
        }
    };

    return (
        <div className='flex flex-col h-full'>
            <div className="flex justify-between">
                <div className='flex justify-normal'>
                    <About isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>
                <div className='mt-1 ml-2'>
                    <button onClick={() => setActivePage('bertrand')} className="mr-2 px-3 py-1 bg-blue-500 text-white rounded">伯特蘭悖論</button>
                    <button onClick={() => setActivePage('catalan')} className="mr-2 px-3 py-1 bg-blue-500 text-white rounded">卡特蘭數</button>
                    <button onClick={() => setActivePage('secretary')} className="mr-2 px-3 py-1 bg-blue-500 text-white rounded">秘書問題</button>
                    <button onClick={() => setActivePage('prisoners')} className="px-3 py-1 bg-blue-500 text-white rounded">囚犯問題</button>
                </div>
                <div className='flex justify-end'>
                    <TopmostPin />
                </div>
            </div>
            {!isOpen && renderPage()}
        </div>
    );
}

function App() {
    const [activePage, setActivePage] = useState('');

    return (
        <div id="App" className='h-full w-full'>
            <Menu activePage={activePage} setActivePage={setActivePage} />
        </div>
    );
}

export default App