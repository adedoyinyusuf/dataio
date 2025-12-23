'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface ChartProps {
    type: 'line' | 'bar';
    data: any;
    title?: string;
    height?: number;
    onDrilldown?: (label: string) => void;
}

export default function TrendChart({ type, data, title, height = 300, onDrilldown }: ChartProps) {
    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: onDrilldown ? (event: any, elements: any) => {
            if (elements.length > 0) {
                const elementIndex = elements[0].index;
                const label = data.labels[elementIndex];
                onDrilldown(label);
            }
        } : undefined,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: !!title,
                text: title,
            },
            tooltip: {
                callbacks: {
                    footer: onDrilldown ? () => 'Click to drill down' : undefined
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        },
        ...(onDrilldown && type === 'bar' ? {
            hover: {
                mode: 'nearest' as const,
                intersect: true
            }
        } : {})
    };

    return (
        <div style={{ height: `${height}px`, position: 'relative' }} className="w-full">
            {type === 'line' ? (
                <Line options={options} data={data} />
            ) : (
                <Bar options={options} data={data} />
            )}
        </div>
    );
}
