import React from 'react';
import 'moment/locale/pt-br';
import { ResponsiveLine } from '@nivo/line'
import bundle from 'i18n/bundle';

const SimpleGraph = ({ data , panel = '', colorScheme = 'category10'}) => {
    return (
        <div className={(panel) ? 'panel ' + panel : 'panel panel-primary'}>
            <div className="panel-heading ">
                {bundle('last.months')}
            </div>
            <div className="panel-body bill-graph">
                <ResponsiveLine
                    data={data}
                    margin={{ top: 30, right: 110, bottom: 50, left: 70 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', stacked: false, min: 'auto', max: 'auto' }}
                    axisTop={null}
                    axisRight={null}
                    lineWidth={3}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: bundle('month'),
                        legendOffset: 36,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 15,
                        tickRotation: 0,
                        legend: bundle('value'),
                        legendOffset: -55,
                        legendPosition: 'middle'
                    }}
                    enablePointLabel={true}
                    enableGridX={false}
                    enablePoints={true}
                    isInteractive={false}
                    // @ts-ignore
                    colors={{ "scheme": colorScheme }}
                    pointSize={10}
                    pointColor="#ffffff"
                    pointLabel="yFormatted"
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-10}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}

                />
            </div>
        </div>
    );
}

export default SimpleGraph;