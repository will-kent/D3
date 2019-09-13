d3.csv('/js/data/SheepNumbers.csv', function(d) {

    var state = [],
        sheep = [],
        margin = { top: 0, right: 0, bottom: 30, left: 20 }
        height = 400 - margin.top - margin.bottom,
        width = 600 - margin.left - margin.right,
        barOffset = 5,
        barWidth = ((width - 80) / d.length) - (d.length + barOffset),
        formatNum = d3.format(",")
        axisPadding = -20;

    var yScale,
        yAxisValues,
        yAxisTicks,
        yGuide,
        xScale,
        xAxisValues,
        xAxisTicks,
        chart

    for (var i = 0; i<d.length; i++) {
             state.push(d[i].State)
             sheep.push((d[i].SheepPopulation));
           }

    yScale = d3.scaleLinear()
        .domain([0, d3.max(sheep)])
        .range([0, height - 20])

    yAxisValues = d3.scaleLinear()
        .domain([0, d3.max(sheep)])
        .range([height, 20])

    yAxisTicks = d3.axisLeft(yAxisValues)
        .ticks(10)

    xScale = d3.scaleBand()
        .domain(state)
        .range([0, width])

    xAxisValues = d3.scaleBand()
        .domain(state)
        .range([0, (barWidth + barOffset) * state.length])

    xAxisTicks = d3.axisBottom(xAxisValues)
        .ticks(state.length)

    colours = d3.scaleOrdinal()
        .range(["#FFD700","#FF0000",'#800000',"#87CEEB","#000080","#006A4E"])

    tooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', '#F5F5F5')
        .style('opacity', .2);

chart = d3.select('#viz').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(80,' + axisPadding +')')
        .selectAll('rect').data(sheep)
        .enter().append('rect')
        .style('fill', colours)
        .attr('width', barWidth)
        .attr('height', 0)
        .attr('x', function(d,i) {
            return i * (barWidth + barOffset);
        })
        .attr('y', function(d) {
            return height - (d/100000)
        })

        .on('mouseover', function(d) {
            tempColour = this.style.fill;
            tooltip.transition().duration(200)
                .style('opacity', .9)
            tooltip.html('<div style="font-size: 1.5rem; font-weight: bold">' +
                formatNum(d) + '</div>'
                )

            d3.select(this)
                .style('opacity', 1)
        })

        .on('mousemove', function(d) {
            tooltip.html('<div style="font-size: 1.5rem; font-weight: bold">' +
                            formatNum(d) + '</div>'
                            )
            .style('left', (d3.event.pageX - 40) + 'px')
            .style('top', (d3.event.pageY - 50) + 'px')

        })

        .on('mouseout', function(d) {
            tooltip.html('')
            d3.select(this)
                .style('fill', tempColour)
                .style('opacity', 1)
        })

    yGuide = d3.select('#viz svg').append('g')
        .attr('transform', 'translate(80,' + axisPadding + ')')
        .call(yAxisTicks)

    xGuide = d3.select('#viz svg').append('g')
        .attr('transform', 'translate(80, ' + (400 - margin.bottom - 20) + ')')
        .call(xAxisTicks)

    chart.transition()
        .attr('height',  function(d) {
            return yScale(d)
        })
        .attr('y', function(d) {
            return height - yScale(d)
        })
        .delay(function(d,i) {
            return i * 20
        })
        .duration(500)

});