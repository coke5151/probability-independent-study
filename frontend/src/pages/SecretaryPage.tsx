import React, { useEffect, useRef, useState } from 'react';
import EChartsReact from 'echarts-for-react';
import { SecretaryDoMultipleRounds } from '../../wailsjs/go/main/App';


export function SecretaryPage() {

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

    const [n, setN] = useState('1000');
    const [step, setStep] = useState('100');
    const [hint, setHint] = useState('');
    const [error, setError] = useState('');

    const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 移除非數字字符，並移除前導零
        const newN = value.replace(/[^0-9]/g, '').replace(/^0+/, '');
        setN(newN === '' ? '0' : newN);
    };

    const handleStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 移除非數字字符，並移除前導零
        const newStep = value.replace(/[^0-9]/g, '').replace(/^0+/, '');
        setStep(newStep === '' ? '0' : newStep);
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nNum = parseInt(n);
        const stepNum = parseInt(step)
        if (nNum < 1 || stepNum < 1 || !Number.isInteger(nNum)) {
            setError('請確保 1 <= n, step，n, step 為整數。且 step <= n');
            return;
        }
        setError('');
        setChartOption({});
        updateChart();
    };

    async function updateARound(n: number, setChartOption: any, prevData: any, maxData: any) {
        let results = await SecretaryDoMultipleRounds(n);
        const updatedData = results.map((success: number, index: number) => {
            const previousValue = prevData ? Number(prevData[index]) || 0 : null; // 確保不會是 NaN
            return previousValue ? (success + previousValue) : success;
        });
        setChartOption({
            grid: {
                left: '25%',
                right: '20%',
                bottom: '20%',
                top: '20%',
            },
            xAxis: {
                name: `RejectNumber`,
                type: 'category',
                nameLocation: 'middle', // 將 x 軸名稱放在中間
                nameGap: 25, // 調整 x 軸名稱與軸的距離
                data: updatedData.map((_: any, index: number) => (index / 1000).toString()), // 使用索引作為 x 軸數據
            },
            yAxis: {
                name: 'Numbers',
                type: 'value',
                nameLocation: 'middle',
                nameGap: 30,
            },
            series: [{
                data: updatedData, // 使用結果作為 y 軸數據
                type: 'line', // 使用折線圖
            },],

        });
        return updatedData;
    }

    async function updateChart() {
        setIsCalculating(true);
        const stepNum = Number(step)
        const totalNum = Number(n)
        let data = null;
        let maxData = { value: -Infinity, index: -1 };
        for (let current = stepNum; current <= totalNum; current += stepNum) {
            setHint("Calculating...(" + current + "/" + totalNum + ")");
            data = await updateARound(stepNum, setChartOption, data, maxData);

            // 更新最大值
            const currentMax = Math.max(...data);
            if (currentMax > maxData.value) {
                maxData = { value: currentMax, index: data.indexOf(currentMax) }; // 更新最大值及其索引
                setChartOption((prev: any) => ({
                    ...prev,
                    graphic: [{
                        type: 'text',
                        left: 'center',
                        top: `5%`,
                        style: {
                            text: `Max: ${maxData.value} at x: ${(maxData.index / 1000).toFixed(3)}`,
                            fill: '#fff',
                            font: 'bold 16px sans-serif',
                        },
                    }],
                }));
            }
        }
        if (totalNum % stepNum != 0) {
            data = await updateARound(totalNum % stepNum, setChartOption, data, maxData);
        }
        setHint('');
        setIsCalculating(false);
    }

    return (
        <div className='flex flex-row h-11/12 w-11/12'>
            <div className='mt-10 ml-10 w-1/2'>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <div className='flex flex-row'>
                    <div className='w-1/2 mr-5'>
                        <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
                            <div>
                                <label htmlFor="n-input" className='block mb-0'>Total rounds (n):</label>
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
                                <label htmlFor="step-input" className='block mb-0'>Rounds per step:</label>
                                <input
                                    id="step-input"
                                    type="text"
                                    inputMode="numeric"
                                    value={step}
                                    onChange={handleStepChange}
                                    className='w-full p-0.5 border rounded bg-slate-900'
                                    autoComplete="off"
                                />
                            </div>
                            <button type="submit" className='bg-blue-500 text-white p-0 rounded hover:bg-blue-600'
                                disabled={isCalculating}>
                                {isCalculating ? '計算中…' : '計算'}
                            </button>
                        </form>
                    </div>
                    <div className='w-1/4'>
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
                        <p>{hint}</p>
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