import React, { useEffect, useRef, useState } from 'react';
import EChartsReact from 'echarts-for-react';
import { FirstMethod, ThirdMethod } from '../../wailsjs/go/main/App';
import { SecondMethod } from '../../wailsjs/go/main/App';

async function fetchDataMethod1(setChartOption: any, setFavorable: any, setProbability: any, r: number, n: number, setIsCalculating: any) {
    try {
        setIsCalculating(true);
        setProbability("Calculating...");
        setFavorable("?");
        const result = await FirstMethod(r, n);
        const data = result.RandomPoints.map(point => ({
            value: [point.Point.X, point.Point.Y],
            itemStyle: {
                color: point.IsFavorable ? 'green' : 'red' // 根據 IsFavorable 設置顏色
            }
        }));
        setFavorable(result.Favorable);
        setProbability(result.Probability);

        // 繪製三角形的數據
        const triangleData = [
            {
                coords: [
                    [result.TriangleA.X, result.TriangleA.Y],
                    [result.TriangleB.X, result.TriangleB.Y]
                ],
                lineStyle: {
                    color: 'blue', // 第一條邊的顏色
                    width: 5
                }
            },
            {
                coords: [
                    [result.TriangleB.X, result.TriangleB.Y],
                    [result.TriangleC.X, result.TriangleC.Y]
                ],
                lineStyle: {
                    color: 'green', // 第二條邊的顏色
                    width: 5
                }
            },
            {
                coords: [
                    [result.TriangleC.X, result.TriangleC.Y],
                    [result.TriangleA.X, result.TriangleA.Y]
                ],
                lineStyle: {
                    color: 'blue', // 第三條邊的顏色
                    width: 5
                }
            }
        ];

        // 繪製從 triangleA 連到每個點的線的數據
        const lines = result.RandomPoints.map((point, index) => ({
            coords: [
                [result.TriangleA.X, result.TriangleA.Y],
                [point.Point.X, point.Point.Y]
            ]
        }));

        // 生成圓形的點
        const circleData = {
            type: 'line',
            smooth: true,
            data: Array.from({ length: 361 }, (_, i) => {
                const angle = (i * Math.PI) / 180;
                return {
                    value: [
                        r * Math.cos(angle),
                        r * Math.sin(angle)
                    ]
                };
            }),
            symbolSize: 0,  // 不顯示節點
            lineStyle: {
                color: 'blue',
                width: 2,
                type: 'solid'
            }
        };

        setIsCalculating(false);
        setChartOption({
            title: {
                text: 'Bertrand Paradox'
            },
            grid: {
                top: '20%',
                bottom: `10%`,
                left: `10%`,
                right: `10%`,
                containLabel: true,
            },
            xAxis: {
                min: -r * 1.5,
                max: r * 1.5
            },
            yAxis: {
                min: -r * 1.5,
                max: r * 1.5
            },
            series: [
                circleData,  // 先畫圓
                {
                    type: "scatter",
                    symbolSize: 1,
                    data: data,
                },
                {
                    // 從 triangleA 到點的線
                    type: 'lines',
                    coordinateSystem: 'cartesian2d',
                    data: lines,
                    lineStyle: {
                        width: 2,
                        opacity: 0.5,
                        color: (params: any) => {
                            return result.RandomPoints[params.dataIndex].IsFavorable ? 'green' : 'red';
                        }
                    }
                },
                // 三角形
                {
                    type: 'lines',
                    coordinateSystem: 'cartesian2d',
                    data: triangleData,
                    lineStyle: {
                        width: 5,
                    }
                },
            ],
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function fetchDataMethod2(setChartOption: any, setFavorable: any, setProbability: any, r: number, n: number, setIsCalculating: any) {
    try {
        setIsCalculating(true);
        setProbability("Calculating...");
        setFavorable("?");
        const result = await SecondMethod(r, n);
        const randomPoints = result.RandomPoints.map(point => ({
            value: [point.Point.X, point.Point.Y],
            itemStyle: {
                color: point.IsFavorable ? 'green' : 'red', // 根據 IsFavorable 設置顏色
            }
        }));
        const perpendicularLines = result.PerpendicularLines.map(point => ({
            coords: [
                [point.PointFirst.X, point.PointFirst.Y],
                [point.PointSecond.X, point.PointSecond.Y]
            ],
            lineStyle: {
                color: point.IsFavorable ? 'green' : 'red', // 第一條邊的顏色
                width: 3
            }
        }));
        setFavorable(result.Favorable);
        setProbability(result.Probability);

        // 繪製三角形的數據
        const triangleData = [
            {
                coords: [
                    [result.TriangleA.X, result.TriangleA.Y],
                    [result.TriangleB.X, result.TriangleB.Y]
                ],
                lineStyle: {
                    color: 'blue', // 第一條邊的顏色
                    width: 5
                }
            },
            {
                coords: [
                    [result.TriangleB.X, result.TriangleB.Y],
                    [result.TriangleC.X, result.TriangleC.Y]
                ],
                lineStyle: {
                    color: 'blue', // 第二條邊的顏色
                    width: 5
                }
            },
            {
                coords: [
                    [result.TriangleC.X, result.TriangleC.Y],
                    [result.TriangleA.X, result.TriangleA.Y]
                ],
                lineStyle: {
                    color: 'blue', // 第三條邊的顏色
                    width: 5
                }
            }
        ];

        // 生成圓形的點
        const circleData = {
            type: 'line',
            smooth: true,
            data: Array.from({ length: 361 }, (_, i) => {
                const angle = (i * Math.PI) / 180;
                return {
                    value: [
                        r * Math.cos(angle),
                        r * Math.sin(angle)
                    ]
                };
            }),
            symbolSize: 0,  // 不顯示節點
            lineStyle: {
                color: 'blue',
                width: 2,
                type: 'solid'
            }
        };

        setIsCalculating(false);
        setChartOption({
            title: {
                text: 'Bertrand Paradox'
            },
            grid: {
                top: '20%',
                bottom: `10%`,
                left: `10%`,
                right: `10%`,
                containLabel: true,
            },
            xAxis: {
                min: -r * 1.5,
                max: r * 1.5
            },
            yAxis: {
                min: -r * 1.5,
                max: r * 1.5
            },
            series: [
                circleData,  // 先畫圓
                // 垂直線
                {
                    type: 'lines',
                    coordinateSystem: 'cartesian2d',
                    data: perpendicularLines,
                    lineStyle: {
                        width: 5,
                    }
                },
                // 三角形
                {
                    type: 'lines',
                    coordinateSystem: 'cartesian2d',
                    data: triangleData,
                    lineStyle: {
                        width: 5,
                    }
                },
                {
                    type: 'scatter',
                    data: randomPoints,
                    symbolSize: 1,
                }
            ],
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function fetchDataMethod3(setChartOption: any, setFavorable: any, setProbability: any, r: number, n: number, setIsCalculating: any) {
    try {
        setIsCalculating(true);
        setProbability("Calculating...");
        setFavorable("?");
        const result = await ThirdMethod(r, n);
        const randomPoints = result.RandomPoints.map(point => ({
            value: [point.Point.X, point.Point.Y],
            itemStyle: {
                color: point.IsFavorable ? 'green' : 'red', // 根據 IsFavorable 設置顏色
            }
        }));
        setFavorable(result.Favorable);
        setProbability(result.Probability);

        // 繪製三角形的數據
        const triangleData = [
            {
                coords: [
                    [result.TriangleA.X, result.TriangleA.Y],
                    [result.TriangleB.X, result.TriangleB.Y]
                ],
                lineStyle: {
                    color: 'blue', // 第一條邊的顏色
                    width: 5
                }
            },
            {
                coords: [
                    [result.TriangleB.X, result.TriangleB.Y],
                    [result.TriangleC.X, result.TriangleC.Y]
                ],
                lineStyle: {
                    color: 'blue', // 第二條邊的顏色
                    width: 5
                }
            },
            {
                coords: [
                    [result.TriangleC.X, result.TriangleC.Y],
                    [result.TriangleA.X, result.TriangleA.Y]
                ],
                lineStyle: {
                    color: 'blue', // 第三條邊的顏色
                    width: 5
                }
            }
        ];

        // 生成大圓形的點
        const bigCircleData = {
            type: 'line',
            smooth: true,
            data: Array.from({ length: 361 }, (_, i) => {
                const angle = (i * Math.PI) / 180;
                return {
                    value: [
                        r * Math.cos(angle),
                        r * Math.sin(angle)
                    ]
                };
            }),
            symbolSize: 0,  // 不顯示節點
            lineStyle: {
                color: 'blue',
                width: 2,
                type: 'solid'
            }
        };

        // 生成小圓形的點
        const smallCircleData = {
            type: 'line',
            smooth: true,
            data: Array.from({ length: 361 }, (_, i) => {
                const angle = (i * Math.PI) / 180;
                return {
                    value: [
                        r / 2 * Math.cos(angle),
                        r / 2 * Math.sin(angle)
                    ]
                };
            }),
            symbolSize: 0,  // 不顯示節點
            lineStyle: {
                color: 'gray',
                width: 2,
                type: 'solid'
            }
        };

        setIsCalculating(false);
        setChartOption({
            title: {
                text: 'Bertrand Paradox'
            },
            grid: {
                top: '20%',
                bottom: `10%`,
                left: `10%`,
                right: `10%`,
                containLabel: true,
            },
            xAxis: {
                min: -r * 1.5,
                max: r * 1.5
            },
            yAxis: {
                min: -r * 1.5,
                max: r * 1.5
            },
            series: [
                // 先畫大圓及小圓
                bigCircleData,
                smallCircleData,
                // 三角形
                {
                    type: 'lines',
                    coordinateSystem: 'cartesian2d',
                    data: triangleData,
                    lineStyle: {
                        width: 5,
                    }
                },
                {
                    type: 'scatter',
                    data: randomPoints,
                    symbolSize: 5,
                }
            ],
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


export function BertrandPage() {

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

    const [r, setR] = useState('5');
    const [n, setN] = useState('10');
    const [nNum, setNNum] = useState(10);
    const [favorable, setFavorable] = useState(0);
    const [probability, setProbability] = useState(0);
    const [error, setError] = useState('');

    const handleRChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 移除非數字字符，並移除前導零
        const newR = value.replace(/[^0-9.]/g, '').replace(/^0+(?!$|\.)/, '');
        setR(newR === '' ? '0' : newR);
    };

    const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 移除非數字字符，並移除前導零
        const newN = value.replace(/[^0-9]/g, '').replace(/^0+/, '');
        setN(newN === '' ? '0' : newN);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const rNum = parseFloat(r);
        const nNum = parseInt(n);
        if (rNum <= 0 || nNum < 1 || !Number.isInteger(nNum)) {
            setError('請確保 r 大於 0，n 為大於等於 1 的整數。');
            return;
        }
        setError('');
        setNNum(nNum);
        setChartOption({});
        fetchDataMethod1(setChartOption, setFavorable, setProbability, rNum, nNum, setIsCalculating);
    };

    const handleMethod2 = (e: React.FormEvent) => {
        e.preventDefault();
        const rNum = parseFloat(r);
        const nNum = parseInt(n);
        if (rNum <= 0 || nNum < 1 || !Number.isInteger(nNum)) {
            setError('請確保 r 大於 0，n 為大於等於 1 的整數。');
            return;
        }
        setError('');
        setNNum(nNum);
        // 呼叫 Method2 的函數
        setChartOption({});
        fetchDataMethod2(setChartOption, setFavorable, setProbability, rNum, nNum, setIsCalculating);
    };

    const handleMethod3 = (e: React.FormEvent) => {
        e.preventDefault();
        const rNum = parseFloat(r);
        const nNum = parseInt(n);
        if (rNum <= 0 || nNum < 1 || !Number.isInteger(nNum)) {
            setError('請確保 r 大於 0，n 為大於等於 1 的整數。');
            return;
        }
        setError('');
        setNNum(nNum);
        // 呼叫 Method3 的函數
        fetchDataMethod3(setChartOption, setFavorable, setProbability, rNum, nNum, setIsCalculating);
    };

    return (
        <div className='flex flex-row h-full w-full'>
            <div className='mt-10 ml-10 w-1/2'>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <div className='flex flex-row'>
                    <div className='w-1/2'>
                        <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
                            <div>
                                <label htmlFor="r-input" className='block mb-0'>半徑 (r):</label>
                                <input
                                    id="r-input"
                                    type="text"
                                    inputMode="decimal"
                                    value={r}
                                    onChange={handleRChange}
                                    className='w-full p-0.5 border rounded bg-slate-900'
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label htmlFor="n-input" className='block mb-0'>點數 (n):</label>
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
                            <button type="submit" className='bg-blue-500 text-white p-0 rounded hover:bg-blue-600'
                                disabled={isCalculating}>
                                {isCalculating ? 'Calculating...' : 'Method1'}
                            </button>
                            <button onClick={handleMethod2} className='bg-green-500 text-white p-0 rounded hover:bg-green-600'
                                disabled={isCalculating}
                            >
                                {isCalculating ? 'Calculating...' : 'Method2'}
                            </button>
                            <button onClick={handleMethod3} className='bg-red-500 text-white p-0 rounded hover:bg-red-600'
                                disabled={isCalculating}>
                                {isCalculating ? 'Calculating...' : 'Method3'}
                            </button>
                        </form>
                    </div>
                    <div className='w-1/2'>
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
                        <p>{favorable}/{nNum} = {probability}</p>
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