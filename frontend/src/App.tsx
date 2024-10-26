import { useState } from 'react';
import './App.css';
import { WindowSetAlwaysOnTop } from '../wailsjs/runtime';
import { Pin } from 'lucide-react';

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
        <div className="flex justify-end mb-4">
            <div>
                <TopmostPin />
            </div>
        </div>
    );
}


function App() {
    return (
        <div id="App">
            <Menu />
        </div>
    )
}

export default App