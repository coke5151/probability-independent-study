import React, { useEffect, useRef, useState } from 'react';
import EChartsReact from 'echarts-for-react';
import { PrisonersProblem } from '../../wailsjs/go/main/App';


export function PrisonersPage() {

    const echartRef: any = useRef(null);
    const [isCalculating, setIsCalculating] = useState(false);

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
    const [prisoners, setPrisoners] = useState('100');
    const [probability, setProbability] = useState('0');
    const [error, setError] = useState('');

    const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 移除非數字字符，並移除前導零
        const newN = value.replace(/[^0-9]/g, '').replace(/^0+/, '');
        setN(newN === '' ? '0' : newN);
    };

    const handlePrisonersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 移除非數字字符，並移除前導零
        const newPrisoners = value.replace(/[^0-9]/g, '').replace(/^0+/, '');
        setPrisoners(newPrisoners === '' ? '0' : newPrisoners);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nNum = parseInt(n);
        const prisonersNum = parseInt(prisoners)
        if (nNum < 1 || prisonersNum < 1 || prisonersNum % 2 != 0 || !Number.isInteger(nNum) || !Number.isInteger(prisonersNum)) {
            setError('請確保 n 為大於等於 1 的整數，且 prisoners number 應為偶數。');
            return;
        }
        setError('');
        setChartOption({});
        updateChart(Number(n), prisonersNum);
    };

    async function updateChart(n: number, prisoners: number) {
        setIsCalculating(true);
        setProbability("Calculating...");
        const results: any = await PrisonersProblem(n, prisoners);
        setProbability(results[results.length - 1]);
        setChartOption({
            grid: {
                left: '25%',
                right: '20%',
                bottom: '20%',
                top: '20%',
            },
            xAxis: {
                name: `Attempts`,
                type: 'category',
                nameLocation: 'middle', // 將 x 軸名稱放在中間
                nameGap: 25, // 調整 x 軸名稱與軸的距離
                data: results.map((_: any, index: number) => index.toString()), // 使用索引作為 x 軸數據
            },
            yAxis: {
                name: 'Average Probability at that time',
                type: 'value',
                nameLocation: 'middle',
                nameGap: 30,
                min: 0,
                max: 1,
            },
            series: [{
                data: results, // 使用結果作為 y 軸數據
                type: 'line', // 使用折線圖
            }],
        });
        setIsCalculating(false);
    }

    return (
        <div className='flex flex-row h-11/12 w-11/12'>
            <div className='mt-10 ml-10 w-1/2'>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <div className='flex flex-row'>
                    <div className='w-1/2'>
                        <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
                            <div>
                                <label htmlFor="n-input" className='block mb-0'>Attemps (n):</label>
                                <input
                                    id="n-input"
                                    type="text"
                                    inputMode="numeric"
                                    value={n}
                                    onChange={handleNChange}
                                    className='w-full p-0.5 border rounded bg-slate-900'
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label htmlFor="prisoners-input" className='block mb-0'>Prisoners numbers:</label>
                                <input
                                    id="prisoners-input"
                                    type="text"
                                    inputMode="numeric"
                                    value={prisoners}
                                    onChange={handlePrisonersChange}
                                    className='w-full p-0.5 border rounded bg-slate-900'
                                    autoComplete="off"
                                />
                            </div>
                            <button type="submit" className='bg-blue-500 text-white p-0 rounded hover:bg-blue-600'
                                disabled={isCalculating}>
                                {isCalculating ? '計算中…' : '計算'}
                            </button>
                        </form>
                        <div className='w-full'>
                            <p>Result</p>
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
                            <p>P = {probability}</p>
                        </div>
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