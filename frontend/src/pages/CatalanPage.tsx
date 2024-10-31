import React, { useEffect, useState } from 'react';
import { GenerateAllCatalanPathPoints } from '../../wailsjs/go/main/App';
import EChartsReact from 'echarts-for-react';

function createChartOption(n: number, points: any) {
    return {
        animation: false,
        grid: {
            left: '10%',
            right: '10%',
            top: '10%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            min: 0,
            max: n,
            interval: 1,
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: n,
            interval: 1,
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        series: [
            // 對角線
            {
                name: 'Diagonal',
                type: 'line',
                data: [[0, 0], [n, n]],
                lineStyle: {
                    type: 'dashed',
                    color: '#ccc'
                },
                symbol: 'none'
            },
            // 路徑
            {
                name: 'Path',
                type: 'line',
                data: points.map((point: any) => [point.X, point.Y]),
                lineStyle: {
                    color: '#0066FF',
                    width: 5
                },
                symbol: 'none'
            }
        ]
    };
}

export function CatalanPage() {
    const [chartOptions, setChartOptions] = useState<any[][]>([]);
    const [n, setN] = useState('1');
    const [nNum, setNNum] = useState(1);
    const [displayResult, setDisplayResult] = useState(false);
    const [error, setError] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);

    const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayResult(false);
        const value = e.target.value;
        const newN = value.replace(/[^0-9]/g, '').replace(/^0+/, '');
        setN(newN === '' ? '0' : newN);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setIsCalculating(true);
        setDisplayResult(false);
        setChartOptions([]);
        e.preventDefault();
        const nNum = parseInt(n);

        if (nNum < 1 || !Number.isInteger(nNum)) {
            setError('請確保 1 <= n，且 n 為整數。');
            return;
        }

        setNNum(nNum);
        setError('');

        try {
            const result = await GenerateAllCatalanPathPoints(nNum);
            setDisplayResult(true);
            const options = result.map((row: any) =>
                row.map((points: any) => createChartOption(nNum, points))
            );
            setChartOptions(options);
            setIsCalculating(false);
        } catch (err) {
            setError('錯誤：' + err);
        }
    };

    return (
        <div className='flex flex-col h-full w-full'>
            <div className='w-full flex flex-row'>
                <div className='mt-10 ml-10 w-1/6'>
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
                        <div>
                            <div className='flex flex-row'>
                                <label htmlFor="n-input" className='block mb-0 mr-5'>n:</label>
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
                        </div>
                        <button
                            type="submit"
                            className='bg-blue-500 text-white p-0 rounded hover:bg-blue-600'
                            disabled={isCalculating}
                        >
                            {isCalculating ? '計算中' : '計算'}
                        </button>
                    </form>
                </div>
                <div className='mt-10 ml-10'>
                    {
                        displayResult &&
                        <p className='mt-3'>Result: 全非法（{chartOptions.length}） * {Number(n) + 1} = {chartOptions.length * (Number(n) + 1)}</p>
                    }
                </div>
            </div>

            {displayResult && chartOptions.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className='flex w-full justify-center items-center gap-4 p-4'
                >
                    {row.map((option, index) => (
                        <div
                            key={index}
                            className='aspect-square'
                            style={{ width: nNum > 1 ? String(((1 / (nNum + 3))) * 100) + '%' : '100%' }}
                        >
                            <EChartsReact
                                option={option}
                                style={{ width: '100%', height: '100%' }}
                                notMerge={true}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}