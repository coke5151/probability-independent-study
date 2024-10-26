import { useState } from 'react';
import './App.css';
import { WindowSetAlwaysOnTop } from '../wailsjs/runtime';
import { Pin } from 'lucide-react';
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

function Menu() {
    return (
        <div className="flex justify-end">
            <div>
                <TopmostPin />
            </div>
        </div>
    );
}

function ConsoleLog() {
    FirstMethod(5, 100).then((res) => {
        console.log(res)
    })
    return <div>
    </div>
}


function App() {
    const [activePage, setActivePage] = useState('');

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
        <div id="App">
            <Menu />
            <nav className="mb-4">
                <button onClick={() => setActivePage('bertrand')} className="mr-2 px-3 py-1 bg-blue-500 text-white rounded">伯特蘭悖論</button>
                <button onClick={() => setActivePage('catalan')} className="mr-2 px-3 py-1 bg-blue-500 text-white rounded">卡特蘭數</button>
                <button onClick={() => setActivePage('secretary')} className="mr-2 px-3 py-1 bg-blue-500 text-white rounded">秘書問題</button>
                <button onClick={() => setActivePage('prisoners')} className="px-3 py-1 bg-blue-500 text-white rounded">囚犯問題</button>
            </nav>
            {renderPage()}
        </div>
    );
}

export default App