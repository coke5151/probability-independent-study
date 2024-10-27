import React, { useEffect, useRef, useState } from 'react';
import EChartsReact from 'echarts-for-react';

export function CatalanPage() {

    const echartRef: any = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            echartRef.current.getEchartsInstance().resize();
        };

        window.addEventListener('resize', handleResize); // 監聽窗口大小變化
        return () => {
            window.removeEventListener('resize', handleResize); // 清除監聽器
        };
    }, []);

    const [chartOption, setChartOption] = useState({});
    const [showChart, setShowChart] = useState(true);

    const toggleChartVisibility = () => {
        setShowChart(prev => !prev);
    };

    const [n, setN] = useState('10');
    const [favorable, setFavorable] = useState(0);
    const [probability, setProbability] = useState(0);
    const [error, setError] = useState('');

    const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 移除非數字字符，並移除前導零
        const newN = value.replace(/[^0-9]/g, '').replace(/^0+/, '');
        setN(newN === '' ? '0' : newN);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nNum = parseInt(n);
        if (nNum < 1 || !Number.isInteger(nNum)) {
            setError('請確保 n 為大於等於 1 的整數。');
            return;
        }
        setError('');
        setChartOption({});
    };

    return (
        <div className='flex flex-row h-full w-full'>
            <div className='mt-10 ml-10 w-1/2'>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <div className='flex flex-row'>
                    <div className='w-1/2'>
                        <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
                            <div>
                                <label htmlFor="n-input" className='block mb-0'>邊長 (n):</label>
                                <input
                                    id="n-input"
                                    type="text"
                                    inputMode="decimal"
                                    value={n}
                                    onChange={handleNChange}
                                    className='w-full p-0.5 border rounded bg-slate-900'
                                    autoComplete="off"
                                />
                            </div>
                            <button type="submit" className='bg-blue-500 text-white p-0 rounded hover:bg-blue-600'>
                                計算
                            </button>
                            {
                                showChart ?
                                    <button onClick={toggleChartVisibility} className='bg-blue-500 text-white p-0.5 rounded hover:bg-gray-600'>
                                        顯示 ECharts
                                    </button>
                                    :
                                    <button onClick={toggleChartVisibility} className='bg-gray-500 text-white p-0.5 rounded hover:bg-blue-500'>
                                        隱藏 ECharts
                                    </button>
                            }
                        </form>
                    </div>
                    <div className='w-1/2'>
                        <p>Result</p>
                        <p>{favorable}/{n} = {probability}</p>
                    </div>
                </div>
            </div>
            <div className='w-1/2'>
                <div className='aspect-square mt-5 ml-5'>
                    {showChart && <EChartsReact option={chartOption} style={{ width: "100%", height: "100%", aspectRatio: 1 }} />}
                </div>
            </div>
        </div>
    );
}