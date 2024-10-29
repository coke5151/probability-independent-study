import React, { useEffect, useRef, useState } from 'react';
import { GenerateAllCatalanPathPoints } from '../../wailsjs/go/main/App';
import EChartsReact from 'echarts-for-react';
import Scrollbars from 'react-custom-scrollbars-2';

async function getPaths(n: number, setChartOption: any) {

    setChartOption({
        animation: false,
        grid: [],
        xAxis: [],
        yAxis: [],
        series: []
    });

    const result = await GenerateAllCatalanPathPoints(n);

    // 生成 n * n + 1 的網格配置
    const rows = result.length;
    const cols = n + 1;

    // 計算每個子圖的位置和大小
    const gridSettings = [];
    const xAxisSettings = [];
    const yAxisSettings = [];
    const seriesSettings = [];

    // 設置間距和大小
    const topMargin = 5;
    const bottomMargin = 5;
    const leftMargin = 5;
    const rightMargin = 5;

    const gridWidth = (95 - leftMargin - rightMargin) / cols;
    const gridHeight = (80 - topMargin - bottomMargin) / cols;
    const gridSquare = Math.min(gridHeight, gridWidth);

    // 生成網格配置
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const gridIndex = i * cols + j;

            // 網格配置
            gridSettings.push({
                left: `${(leftMargin + j * gridWidth)}%`,
                top: `${(topMargin + i * gridHeight)}%`,
                width: `${(gridWidth - 5)}%`,
                height: `${(gridHeight - 5)}%`,
                containLabel: true,
            });

            // X軸配置
            xAxisSettings.push({
                type: 'value',
                gridIndex: gridIndex,
                min: 0,
                max: n,
                interval: 1,
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
            });

            // Y軸配置
            yAxisSettings.push({
                type: 'value',
                gridIndex: gridIndex,
                min: 0,
                max: n,
                interval: 1,
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
            });


            // 對角線
            seriesSettings.push({
                name: 'Diagonal',
                type: 'line',
                xAxisIndex: gridIndex,
                yAxisIndex: gridIndex,
                data: [[0, 0], [n, n]],
                lineStyle: {
                    type: 'dashed',
                    color: '#ccc'
                },
                symbol: 'none'
            });

            // 路徑
            seriesSettings.push({
                name: `Path ${gridIndex}`,
                type: 'line',
                xAxisIndex: gridIndex,
                yAxisIndex: gridIndex,
                data: result[i][j].map((point: any) => [point.X, point.Y]),
                lineStyle: {
                    color: '#0066FF',
                    width: 5
                },
                symbol: 'none'
            });
        }
    }


    // ECharts 配置
    setChartOption({
        animation: false,
        grid: gridSettings,
        xAxis: xAxisSettings,
        yAxis: yAxisSettings,
        series: seriesSettings,
    });
}

export function CatalanPage() {

    const [chartOption, setChartOption] = useState({});
    const [n, setN] = useState('1');
    const [error, setError] = useState('');

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

    const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 移除非數字字符，並移除前導零
        const newN = value.replace(/[^0-9]/g, '').replace(/^0+/, '');
        setN(newN === '' ? '0' : newN);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nNum = parseInt(n);
        if (nNum < 1 || nNum > 3 || !Number.isInteger(nNum)) {
            setError('為了顯示正常，請確保 1 <= n <= 3，且 n 為整數。');
            return;
        }
        setError('');
        setChartOption({});
        getPaths(nNum, setChartOption);
    };

    return (
        <div className='flex flex-row h-full w-full'>
            <div className='mt-10 ml-10 w-1/6'>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <div className='flex flex-row'>
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
                    </form>
                </div>
            </div>
            <div className='ml-5 w-full h-full' >
                <div className='aspect-square mt-5 ml-5'>
                    <EChartsReact
                        option={chartOption}
                        style={{ width: '100%', height: '100%', aspectRatio: 1 }}
                        notMerge={true}
                    />
                </div>
            </div>
        </div >
    );
}